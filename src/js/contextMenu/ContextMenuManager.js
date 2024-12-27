/**
 * ContextMenuManager.js - コンテキストメニューの管理を担当
 */
class ContextMenuManager {
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
                label: 'ローカルにピン留めする',
                icon: '📌',
                action: async () => {
                    const success = await this.pinAppToLocal(appData);
                    if (success) {
                        AppNotification.show('成功', 'アプリがローカルにピン留めされました', 'success');
                    } else {
                        AppNotification.show('エラー', 'ピン留めに失敗しました', 'error');
                    }
                }
            },
            {
                label: `${appData.name}を削除`,
                icon: '🗑️',
                action: () => {
                    appLoader.uninstallApp(appData.name);
                }
            }
        ];

        this.renderContextMenu(menu, menuItems);
        return menu;
    }

    async pinAppToLocal(appData) {
        try {
            // FileSystemManager が初期化されていない場合は許可を要求
            if (!fileSystemManager.initialized) {
                const permitted = await fileSystemManager.requestPermission();
                if (!permitted) {
                    return false;
                }
            }

            // アイコンをBlobに変換
            let iconBlob = null;
            if (appData.icon && appData.icon.startsWith('blob:')) {
                const response = await fetch(appData.icon);
                iconBlob = await response.blob();
            }

            // アプリファイルを保存
            const saved = await fileSystemManager.saveAppFiles(appData.name, appData.files, iconBlob);
            if (!saved) {
                return false;
            }

            // ローカルストレージに情報を保存
            const pinnedApps = JSON.parse(localStorage.getItem('8313app-in') || '[]');
            if (!pinnedApps.includes(appData.name)) {
                pinnedApps.push(appData.name);
                localStorage.setItem('8313app-in', JSON.stringify(pinnedApps));
            }

            return true;
        } catch (error) {
            console.error('アプリのピン留めエラー:', error);
            return false;
        }
    }

    showDefaultContextMenu(x, y) {
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
                label: 'ピン留めされたアプリを読み込む', 
                icon: '🔄',
                action: async () => {
                    if (!fileSystemManager.initialized) {
                        const permitted = await fileSystemManager.requestPermission();
                        if (!permitted) {
                            AppNotification.show('エラー', 'フォルダーアクセスの許可が必要です', 'error');
                            return;
                        }
                    }
                    await appLoader.loadPinnedApps();
                    AppNotification.show('成功', 'ピン留めされたアプリを読み込みました', 'success');
                }
            },
            { 
                label: '複合検索を開く', 
                icon: '🔍',
                action: () => {
                    const app = applicationManager.apps.find(app => app.id === 'kensaku');
                    if (app) applicationManager.launchApplication(app);
                }
            },
            { 
                label: '電卓を開く', 
                icon: '🔢',
                action: () => {
                    const app = applicationManager.apps.find(app => app.id === 'dentaku');
                    if (app) applicationManager.launchApplication(app);
                }
            },
            { 
                label: 'メモを開く', 
                icon: '📝',
                action: () => {
                    const app = applicationManager.apps.find(app => app.id === 'memotyou');
                    if (app) applicationManager.launchApplication(app);
                }
            },
            { 
                label: 'テキストエディタを開く', 
                icon: '<>',
                action: () => {
                    const app = applicationManager.apps.find(app => app.id === 'txtEditor');
                    if (app) applicationManager.launchApplication(app);
                }
            },
            { type: 'separator' },
            { 
                label: '更新', 
                icon: '🔄',
                action: () => {
                    window.location.reload();
                }
            }
        ];

        this.renderContextMenu(menu, menuItems);
        return menu;
    }

    renderContextMenu(menu, menuItems) {
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

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        document.addEventListener('click', closeMenu);
    }
}

const contextMenuManager = new ContextMenuManager();