// main.js - アプリケーションのエントリーポイント

// システムの初期化
document.addEventListener('DOMContentLoaded', () => {
    // 各マネージャーのインスタンスは自動的に作成される
    
    // システムの初期設定
    setupSystem();
});

// システムの初期設定
function setupSystem() {
    // デスクトップの背景とスタイルを設定
    setupDesktopStyle();
    
    // ヘルプショートカットを登録
    registerHelpShortcut();
    
    // コンテキストメニューのスタイルを追加
    addContextMenuStyle();
}

// デスクトップのスタイル設定
function setupDesktopStyle() {
    const style = document.createElement('style');
    style.textContent = `
        /* リサイザーのスタイル */
        .resizer {
            position: absolute;
            background: transparent;
        }

        .resizer-n { top: -5px; left: 0; right: 0; height: 10px; cursor: n-resize; }
        .resizer-e { top: 0; right: -5px; bottom: 0; width: 10px; cursor: e-resize; }
        .resizer-s { bottom: -5px; left: 0; right: 0; height: 10px; cursor: s-resize; }
        .resizer-w { top: 0; left: -5px; bottom: 0; width: 10px; cursor: w-resize; }
        .resizer-ne { top: -5px; right: -5px; width: 10px; height: 10px; cursor: ne-resize; }
        .resizer-se { bottom: -5px; right: -5px; width: 10px; height: 10px; cursor: se-resize; }
        .resizer-sw { bottom: -5px; left: -5px; width: 10px; height: 10px; cursor: sw-resize; }
        .resizer-nw { top: -5px; left: -5px; width: 10px; height: 10px; cursor: nw-resize; }

        /* コンテキストメニューのスタイル */
        .context-menu {
            position: fixed;
            background: var(--window-bg);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 200px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
        }

        .context-menu-item {
            padding: 8px 16px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .context-menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .context-menu-item .icon {
            margin-right: 8px;
        }

        /* ショートカット通知のスタイル */
        .shortcut-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--window-bg);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 12px 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
        }

        .shortcut-notification.show {
            transform: translateX(0);
        }

        .shortcut-notification .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .shortcut-notification .shortcut-key {
            font-weight: bold;
            color: var(--accent);
        }

        /* ショートカットヘルプのスタイル */
        .shortcut-help {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--window-bg);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            min-width: 400px;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
        }

        .help-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .help-header h2 {
            margin: 0;
            font-size: 1.5em;
        }

        .close-button {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5em;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .close-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .shortcuts-list {
            display: grid;
            gap: 8px;
        }

        .shortcut-item {
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s;
        }

        .shortcut-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .shortcut-item .key {
            background: rgba(255, 255, 255, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            margin-right: 12px;
            font-family: monospace;
        }
    `;
    
    document.head.appendChild(style);
}

// ヘルプショートカットの登録
function registerHelpShortcut() {
    shortcutManager.registerShortcut('h', () => {
        shortcutManager.showShortcutHelp();
    }, 'ショートカット一覧を表示');
}

// コンテキストメニューのスタイルを追加
function addContextMenuStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .context-menu {
            animation: contextMenuOpen 0.2s ease-out;
        }

        @keyframes contextMenuOpen {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}