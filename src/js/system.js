// system.js - システム全体の管理を担当


class SystemManager {
    constructor() {
        this.initializeSystem();
    }

    // システムの初期化
    initializeSystem() {
        this.setupEventListeners();
        this.setupContextMenu();
        this.setupDragAndDrop();
    }

    // イベントリスナーの設定
    setupEventListeners() {
        // ウィンドウのリサイズイベント
        window.addEventListener('resize', () => {
            this.handleSystemResize();
        });

        // キーボードイベント
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // システムのリサイズ処理
    handleSystemResize() {
        // デスクトップのグリッドを更新
        this.updateDesktopGrid();
        
        // 最大化されているウィンドウを調整
        windowManager.handleWindowResize();
    }

    // デスクトップグリッドの更新
    updateDesktopGrid() {
        const desktop = document.getElementById('desktop');
        const iconSize = 100; // アイコンのサイズ + マージン
        const columns = Math.floor(desktop.clientWidth / iconSize);
        
        desktop.style.gridTemplateColumns = `repeat(${columns}, ${iconSize}px)`;
    }

    // キーボードショートカットの処理
    handleKeyboardShortcuts(e) {
        // Alt + Tab でウィンドウ切り替え
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.switchToNextWindow();
        }

        // Windows + D でデスクトップ表示
        if (e.metaKey && e.key === 'd') {
            e.preventDefault();
            this.toggleShowDesktop();
        }
    }

    // 次のウィンドウに切り替え
    switchToNextWindow() {
        const windows = Array.from(windowManager.windows.values())
            .filter(w => w.style.display !== 'none');
        
        if (windows.length < 2) return;

        const currentIndex = windows.findIndex(w => w === windowManager.activeWindow);
        const nextIndex = (currentIndex + 1) % windows.length;
        
        windowManager.setActiveWindow(windows[nextIndex]);
    }

    // デスクトップ表示の切り替え
    toggleShowDesktop() {
        const windows = Array.from(windowManager.windows.values());
        const allMinimized = windows.every(w => w.style.display === 'none');

        if (allMinimized) {
            // すべてのウィンドウを復元
            windows.forEach(w => {
                w.style.display = 'block';
                const windowId = w.id;
                taskbarManager.activateTaskbarItem(windowId);
            });
        } else {
            // すべてのウィンドウを最小化
            windows.forEach(w => {
                windowManager.minimizeWindow(w.id);
            });
        }
    }

    // コンテキストメニューの設定
    setupContextMenu() {
        const desktop = document.getElementById('desktop');
        
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });
    }

        // コンテキストメニューの表示
    showContextMenu(x, y) {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        const menuItems = [
            { 
                label: '複合検索を開く', 
                icon: '🔍',
                action: () => {
                    const notepadApp = applicationManager.apps.find(app => app.id === 'kensaku');
                    if (notepadApp) applicationManager.launchApplication(notepadApp);
                }
            },
            { 
                label: '電卓を開く', 
                icon: '🔢',
                action: () => {
                    const calcApp = applicationManager.apps.find(app => app.id === 'dentaku');
                    if (calcApp) applicationManager.launchApplication(calcApp);
                }
            },
            { 
                label: 'メモを開く', 
                icon: '📝',
                action: () => {
                    const calendarApp = applicationManager.apps.find(app => app.id === 'memotyou');
                    if (calendarApp) applicationManager.launchApplication(calendarApp);
                }
            },
            { 
                label: 'テキストエディタを開く', 
                icon: '<>',
                action: () => {
                    const calendarApp = applicationManager.apps.find(app => app.id === 'txtEditor');
                    if (calendarApp) applicationManager.launchApplication(calendarApp);
                }
            },
            { 
                label: 'ブックマーク保存を開く', 
                icon: '📑',
                action: () => {
                    const calendarApp = applicationManager.apps.find(app => app.id === 'bookmark');
                    if (calendarApp) applicationManager.launchApplication(calendarApp);
                }
            },
            { 
                label: 'privacyOSを開く', 
                icon: '🤫',
                action: () => {
                    const calendarApp = applicationManager.apps.find(app => app.id === 'privacyOS');
                    if (calendarApp) applicationManager.launchApplication(calendarApp);
                }
            },
            { type: 'separator' },
            { 
                label: '更新', 
                icon: '🔄',
                action: () => {
                    window.location.reload();
                }
            },

        ];

        menuItems.forEach(item => {
            if (item.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                menu.appendChild(separator);
                return;
            }

            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span class="label">${item.label}</span>
            `;

            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // メニュー以外をクリックしたら閉じる
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        document.addEventListener('click', closeMenu);
    }

    // ドラッグ＆ドロップの設定
    setupDragAndDrop() {
        const desktop = document.getElementById('desktop');
        
        desktop.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        desktop.addEventListener('drop', (e) => {
            e.preventDefault();
            // ファイルのドロップ処理を実装可能
        });
    }
}

// グローバルなシステムマネージャーのインスタンスを作成
const systemManager = new SystemManager();