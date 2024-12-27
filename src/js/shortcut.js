class ShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.isLKeyPressed = false;
        this.isZKeyPressed = false;
        this.initializeShortcuts();
    }

    // ショートカットの初期化
    initializeShortcuts() {
        this.registerDefaultShortcuts();
        this.setupKeyboardListeners();
    }

    // デフォルトのショートカットを登録
    registerDefaultShortcuts() {
        // L + キー: アプリケーション起動とウィンドウ操作のショートカット
        this.registerShortcut('s', () => {
            const notesApp = applicationManager.apps.find(app => app.id === 'kensaku');
            if (notesApp) applicationManager.launchApplication(notesApp);
        }, '8313複合検索エンジンを開く', 'L');

        this.registerShortcut('c', () => {
            const calcApp = applicationManager.apps.find(app => app.id === 'dentaku');
            if (calcApp) applicationManager.launchApplication(calcApp);
        }, '電卓を開く', 'L');

        this.registerShortcut('n', () => {
            const calcApp = applicationManager.apps.find(app => app.id === 'memotyou');
            if (calcApp) applicationManager.launchApplication(calcApp);
        }, 'メモを開く', 'L');

        this.registerShortcut('t', () => {
            const calcApp = applicationManager.apps.find(app => app.id === 'txtEditor');
            if (calcApp) applicationManager.launchApplication(calcApp);
        }, 'テキストエディタを開く', 'L');

        this.registerShortcut('b', () => {
            const calcApp = applicationManager.apps.find(app => app.id === 'bookmark');
            if (calcApp) applicationManager.launchApplication(calcApp);
        }, 'ブックマーク保存を開く', 'L');

        this.registerShortcut('p', () => {
            const calcApp = applicationManager.apps.find(app => app.id === 'privacyOS');
            if (calcApp) applicationManager.launchApplication(calcApp);
        }, 'privacyOSを開く', 'L');

        this.registerShortcut('w', () => {
            if (windowManager.activeWindow) {
                windowManager.closeWindow(windowManager.activeWindow.id);
            }
        }, 'アクティブウィンドウを閉じる', 'L');

        this.registerShortcut('m', () => {
            if (windowManager.activeWindow) {
                windowManager.minimizeWindow(windowManager.activeWindow.id);
            }
        }, 'アクティブウィンドウを最小化', 'L');

        this.registerShortcut('f', () => {
            if (windowManager.activeWindow) {
                windowManager.maximizeWindow(windowManager.activeWindow.id);
            }
        }, 'アクティブウィンドウを最大化', 'L');

        // Z + キー: システム操作のショートカット
        this.registerShortcut('d', () => {
            systemManager.toggleShowDesktop();
        }, 'デスクトップを表示', 'Z');

        this.registerShortcut('s', () => {
            taskbarManager.toggleStartMenu();
        }, 'スタートメニューを開く', 'Z');


    }


        // 新しいモディファイアキー + キーのショートカットを追加する場合はここに追加
        /*例:
        this.registerShortcut('p', () => {
            アクション
        }, '説明', 'K');*/

    // ショートカットを登録
    registerShortcut(key, callback, description, modifier = 'L') {
        this.shortcuts.set(`${modifier}+${key.toLowerCase()}`, {
            callback,
            description,
            key: key.toLowerCase(),
            modifier
        });
    }

    // キーボードイベントリスナーの設定
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'l') {
                this.isLKeyPressed = true;
            } else if (e.key.toLowerCase() === 'z') {
                this.isZKeyPressed = true;

            // 新しいモディファイアキーを追加する場合はここに条件を追加
            /* 
            例
            else if (e.key.toLowerCase() === 'k') {
                 this.isKKeyPressed = true;
             }*/
            } else if ((this.isLKeyPressed || this.isZKeyPressed) && !e.repeat) {
                const modifier = this.isLKeyPressed ? 'L' : 'Z';
                this.handleShortcut(e.key.toLowerCase(), modifier);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'l') {
                this.isLKeyPressed = false;
            } else if (e.key.toLowerCase() === 'z') {
                this.isZKeyPressed = false;
            }
        });

            // 新しいモディファイアキーを追加する場合はここに条件を追加
            /* 
            例
            else if (e.key.toLowerCase() === 'k') {
                 this.isKKeyPressed = true;
             }*/
    }

    // ショートカットの処理
    handleShortcut(key, modifier) {
        const shortcut = this.shortcuts.get(`${modifier}+${key}`);
        if (shortcut) {
            shortcut.callback();
            this.showShortcutNotification(shortcut, modifier);
        }
    }

    // ショートカット実行時の通知表示
    showShortcutNotification(shortcut, modifier) {
        const notification = document.createElement('div');
        notification.className = 'shortcut-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="shortcut-key">${modifier} + ${shortcut.key.toUpperCase()}</span>
                <span class="shortcut-description">${shortcut.description}</span>
            </div>
        `;

        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('show'));

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 3000);
    }

    // ショートカット一覧の取得
    getShortcutsList() {
        return Array.from(this.shortcuts.entries()).map(([key, shortcut]) => ({
            key: `${shortcut.modifier} + ${shortcut.key.toUpperCase()}`,
            description: shortcut.description
        }));
    }

    // ショートカットヘルプの表示
    showShortcutHelp() {
        const helpWindow = document.createElement('div');
        helpWindow.className = 'shortcut-help';
        
        const shortcuts = this.getShortcutsList();
        const shortcutsList = shortcuts.map(shortcut => `
            <div class="shortcut-item">
                <span class="key">${shortcut.key}</span>
                <span class="description">${shortcut.description}</span>
            </div>
        `).join('');

        helpWindow.innerHTML = `
            <div class="help-header">
                <h2>キーボードショートカット</h2>
                <button class="close-button">×</button>
            </div>
            <div class="shortcuts-list">
                ${shortcutsList}
            </div>
        `;

        document.body.appendChild(helpWindow);

        helpWindow.querySelector('.close-button').addEventListener('click', () => {
            helpWindow.remove();
        });
    }
}

// グローバルなショートカットマネージャーのインスタンスを作成
const shortcutManager = new ShortcutManager();

