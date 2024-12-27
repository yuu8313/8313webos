/**
 * FileSystemManager.js - ファイルシステムの操作を担当
 */
class FileSystemManager {
    constructor() {
        this.appsFolderHandle = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            // すでに許可されているディレクトリハンドルがあるか確認
            const savedHandle = localStorage.getItem('8313app-folder-handle');
            if (savedHandle) {
                // 保存されたハンドルがある場合は、それを使用
                try {
                    // ハンドルの検証（権限が有効かどうか）
                    const handle = JSON.parse(savedHandle);
                    // 権限の確認（これはユーザージェスチャーなしで実行可能）
                    const permission = await handle.requestPermission({ mode: 'readwrite' });
                    if (permission === 'granted') {
                        this.appsFolderHandle = handle;
                        this.initialized = true;
                        return true;
                    }
                } catch (error) {
                    console.warn('保存されたハンドルが無効です:', error);
                    localStorage.removeItem('8313app-folder-handle');
                }
            }
            return false;
        } catch (error) {
            console.error('フォルダーアクセスの初期化エラー:', error);
            return false;
        }
    }

    async requestPermission() {
        try {
            // ユーザーにフォルダー選択を要求（これはユーザージェスチャーから呼び出される必要がある）
            const handle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'desktop'
            });

            // 8313webosappフォルダーを作成または取得
            this.appsFolderHandle = await handle.getDirectoryHandle('8313webosapp', {
                create: true
            });

            // ハンドルを保存
            localStorage.setItem('8313app-folder-handle', JSON.stringify(this.appsFolderHandle));
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('フォルダー作成エラー:', error);
            return false;
        }
    }

    async saveAppFiles(appName, files, iconBlob) {
        if (!this.initialized) {
            throw new Error('FileSystemManager が初期化されていません');
        }

        try {
            // アプリ用のフォルダーを作成
            const appFolder = await this.appsFolderHandle.getDirectoryHandle(appName, {
                create: true
            });

            // ソースファイルを保存
            for (const [fileName, content] of Object.entries(files)) {
                const fileHandle = await appFolder.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
            }

            // アイコンファイルを保存（存在する場合）
            if (iconBlob) {
                const iconHandle = await appFolder.getFileHandle('icon.png', { create: true });
                const writable = await iconHandle.createWritable();
                await writable.write(iconBlob);
                await writable.close();
            }

            return true;
        } catch (error) {
            console.error(`アプリファイル保存エラー (${appName}):`, error);
            return false;
        }
    }

    async loadAppFiles(appName) {
        if (!this.initialized) {
            throw new Error('FileSystemManager が初期化されていません');
        }

        try {
            const appFolder = await this.appsFolderHandle.getDirectoryHandle(appName);
            const files = {};
            let iconUrl = null;

            for await (const entry of appFolder.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    if (entry.name === 'icon.png') {
                        iconUrl = URL.createObjectURL(file);
                    } else {
                        files[entry.name] = await file.text();
                    }
                }
            }

            return { files, iconUrl };
        } catch (error) {
            console.error(`アプリファイル読み込みエラー (${appName}):`, error);
            return null;
        }
    }
}

const fileSystemManager = new FileSystemManager();
