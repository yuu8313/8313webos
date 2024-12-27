class AppLoader {
    constructor() {
        this.installedApps = new Map();
    }

    async loadPinnedApps() {
        try {
            // ピン留めされたアプリの一覧を取得
            const pinnedApps = JSON.parse(localStorage.getItem('8313app-in') || '[]');
            
            // 各アプリのファイルを読み込む
            for (const appName of pinnedApps) {
                const result = await fileSystemManager.loadAppFiles(appName);
                if (result) {
                    // アプリを登録
                    this.registerApp({
                        name: appName,
                        files: result.files,
                        icon: result.iconUrl || '🔲' // アイコンがない場合はデフォルトの絵文字を使用
                    });
                }
            }
        } catch (error) {
            console.error('ピン留めされたアプリの読み込みエラー:', error);
            AppNotification.show('エラー', 'ピン留めされたアプリの読み込みに失敗しました', 'error');
        }
    }

    registerApp(appData) {
        this.installedApps.set(appData.name, appData);
        this.createDesktopIcon(appData);
    }

    createDesktopIcon(appData) {
        const desktopIcons = document.getElementById('desktop-icons');
        const iconElement = document.createElement('div');
        iconElement.className = 'desktop-icon';
        iconElement.dataset.appName = appData.name;
        
        iconElement.innerHTML = `
            <img src="${appData.icon || '🔲'}" class="icon-image" alt="${appData.name}">
            <span class="name">${appData.name}</span>
        `;

        // 通常のダブルクリックイベント
        iconElement.addEventListener('dblclick', () => {
            this.launchApp(appData);
        });

        // 右クリックメニューの設定
        iconElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showAppContextMenu(e.clientX, e.clientY, appData);
        });

        desktopIcons.appendChild(iconElement);
    }

    showAppContextMenu(x, y, appData) {
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
                label: `${appData.name}を削除`, 
                icon: '🗑️',
                action: () => {
                    this.uninstallApp(appData.name);
                }
            }
        ];

        menuItems.forEach(item => {
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

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        document.addEventListener('click', closeMenu);
    }

    uninstallApp(appName) {
        // アプリのアンインストール処理
        const iconElement = document.querySelector(`[data-app-name="${appName}"]`);
        if (iconElement) {
            iconElement.remove();
        }

        this.installedApps.delete(appName);
        AppNotification.show('成功', `${appName}がアンインストールされました。`, 'success');
    }

    launchApp(appData) {
        try {
            // アプリケーションウィンドウの作成
            const windowId = windowManager.createWindow({
                id: `app-${appData.name}`,
                name: appData.name,
                icon: appData.icon,
                path: 'about:blank'
            });

            // ウィンドウ内のiframeにアプリケーションを読み込む
            const window = windowManager.windows.get(windowId);
            if (window) {
                const iframe = window.querySelector('iframe');
                if (iframe) {
                    const blob = new Blob([this.generateAppHTML(appData)], { type: 'text/html' });
                    iframe.src = URL.createObjectURL(blob);
                }
            }
        } catch (error) {
            console.error('アプリ起動エラー:', error);
            AppNotification.show('エラー', 'アプリケーションの起動に失敗しました。', 'error');
        }
    }

    generateAppHTML(appData) {
        const mainFile = appData.files['index.html'];
        if (!mainFile) return '<h1>エラー: メインファイルが見つかりません。</h1>';

        let html = mainFile;
        for (const [fileName, content] of Object.entries(appData.files)) {
            if (fileName === 'index.html') continue;

            if (fileName.endsWith('.css')) {
                html = html.replace(
                    `<link rel="stylesheet" href="${fileName}">`,
                    `<style>${content}</style>`
                );
            } else if (fileName.endsWith('.js')) {
                html = html.replace(
                    `<script src="${fileName}"></script>`,
                    `<script>${content}</script>`
                );
            }
        }

        return html;
    }
}

const appLoader = new AppLoader();