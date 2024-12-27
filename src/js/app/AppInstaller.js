/**
 * AppInstaller.js - アプリケーションのインストールを担当
 */
class AppInstaller {
    constructor() {
        this.zip = new JSZip();
    }

    async installApp(file) {
        try {
            console.log('インストール開始:', file.name);
            console.log('ファイルタイプ:', file.type);
            console.log('ファイルサイズ:', file.size, 'bytes');

            // ファイル名から拡張子を確認
            if (!file.name.endsWith('.8313osapp')) {
                AppNotification.show('エラー', 'サポートされていないファイル形式です。', 'error');
                return null;
            }

            // ZIPファイルとして読み込み
            console.log('ZIPファイルを読み込み中...');
            const zipContent = await this.zip.loadAsync(file);
            const fileList = Object.keys(zipContent.files);
            console.log('ZIP内のファイル一覧:', fileList);
            console.log('ZIP内のファイル詳細:', zipContent.files);
            
            // application.jsonの存在確認
            const appJsonFile = zipContent.files['application.json'];
            if (!appJsonFile) {
                console.error('application.jsonが見つかりません。ファイル一覧:', fileList);
                AppNotification.show('エラー', 'application.jsonが見つかりません。', 'error');
                return null;
            }

            // application.jsonの読み込みとパース
            try {
                console.log('application.jsonを読み込み中...');
                console.log('application.jsonのファイル情報:', appJsonFile);
                
                const appConfigText = await appJsonFile.async('string');
                console.log('読み込んだJSON文字列:', appConfigText);
                
                if (!appConfigText || appConfigText.trim() === '') {
                    console.error('application.jsonの内容が空です');
                    AppNotification.show('エラー', 'application.jsonの内容が空です。', 'error');
                    return null;
                }
                
                const appConfig = JSON.parse(appConfigText);
                console.log('パースしたJSON:', appConfig);

                // アプリケーション設定の検証
                if (!AppValidator.validateConfig(appConfig)) {
                    AppNotification.show('エラー', '不正なapplication.jsonです。', 'error');
                    return null;
                }

                // アプリケーションのインストール
                const appData = await this.extractAppFiles(zipContent, appConfig);
                if (appData) {
                    AppNotification.show('成功', 'アプリケーションがインストールされました。', 'success');
                    return appData;
                }
            } catch (jsonError) {
                console.error('JSONパースエラー:', jsonError);
                console.error('エラーの詳細:', jsonError.message);
                AppNotification.show('エラー', `application.jsonの解析に失敗しました: ${jsonError.message}`, 'error');
                return null;
            }

            return null;
        } catch (error) {
            console.error('インストールエラー:', error);
            console.error('エラーの詳細:', error.message);
            AppNotification.show('エラー', 'インストール中にエラーが発生しました。', 'error');
            return null;
        }
    }

    async extractAppFiles(zip, config) {
        try {
            console.log('ファイル展開開始:', config.name);
            
            const appData = {
                name: config.name,
                version: config.version,
                description: config.description,
                icon: null,
                files: {}
            };

            // アイコンの読み込み
            if (zip.files[config.icon]) {
                console.log('アイコンを読み込み中...');
                const iconBlob = await zip.files[config.icon].async('blob');
                appData.icon = URL.createObjectURL(iconBlob);
            }

            // 必要なファイルの展開
            for (const fileName of config.files) {
                console.log('ファイル展開中:', fileName);
                if (zip.files[fileName]) {
                    const content = await zip.files[fileName].async('text');
                    appData.files[fileName] = content;
                } else {
                    console.warn(`ファイルが見つかりません: ${fileName}`);
                }
            }

            console.log('ファイル展開完了:', appData);
            return appData;
        } catch (error) {
            console.error('ファイル展開エラー:', error);
            console.error('エラーの詳細:', error.message);
            AppNotification.show('エラー', 'ファイルの展開に失敗しました。', 'error');
            return null;
        }
    }
}

// グローバルインスタンスの作成
const appInstaller = new AppInstaller();