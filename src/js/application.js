// application.js - アプリケーションの管理を担当
class ApplicationManager {
    constructor() {
        this.apps = [
            { id: 'kensaku', name: '8313複合検索エンジン', path: 'src/apps/app1/index.html', icon: 'src/image/icon1.png', iconType: 'image' },
            { id: 'dentaku', name: '8313電卓', path: 'src/apps/app3/index.html', icon: 'src/image/icon3.png', iconType: 'image' },
            { id: 'memotyou', name: '8313メモ', path: 'src/apps/app27/src/index.html', icon: 'src/image/icon27.png', iconType: 'image' },
            { id: 'txtEditor', name: '8313テキストエディター', path: 'src/apps/app37/index.html', icon: 'src/image/icon37.png', iconType: 'image' },
            { id: 'bookmark', name: '8313ブックマーク保存', path: 'src/apps/app28/index.html', icon: 'src/image/icon28.png', iconType: 'image' },
            { id: 'privacyOS', name: '8313privacyOS', path: 'src/apps/app29/index.html', icon: 'src/image/icon29.png', iconType: 'image' },
            { id: 'gazouresize', name: '8313画像リサイズアプリ', path: 'src/apps/app33/index.html', icon: 'src/image/icon23.png', iconType: 'image' },
            { id: 'gazoutorimingu', name: '8313画像トリミングアプリ', path: 'src/apps/app34/index.html', icon: 'src/image/icon23.png', iconType: 'image' },

        ];

        /*
{

    id: 'アプリAIをセット',

    name: 'アプリ名',

    path: 'src/apps/アプリファイル/index.html',

    icon: 'src/image/icon1.png',　or icon: '📝',

    iconType: 'image'  // 画像アイコンを使用する場合は'image'を指定 そうでなければemoji

}

*/
        
        this.initializeApplications();
    }

    // アプリケーションの初期化
    initializeApplications() {
        this.createDesktopIcons();
        this.populateStartMenu();
    }

    // デスクトップアイコンの作成
    createDesktopIcons() {
        const desktopIcons = document.getElementById('desktop-icons');
        
        this.apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            
            // アイコンの表示方法を判定
            const iconContent = app.iconType === 'image' 
                ? `<img src="${app.icon}" class="icon-image" alt="${app.name}">` 
                : `<span class="icon">${app.icon}</span>`;
            
            icon.innerHTML = `
                ${iconContent}
                <span class="name">${app.name}</span>
            `;

            // ダブルクリックでアプリを起動
            icon.addEventListener('dblclick', () => {
                this.launchApplication(app);
            });

            desktopIcons.appendChild(icon);
        });
    }

    // スタートメニューの作成
    populateStartMenu() {
        const appsList = document.querySelector('#start-menu .apps-list');
        
        this.apps.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            
            // アイコンの表示方法を判定
            const iconContent = app.iconType === 'image' 
                ? `<img src="${app.icon}" class="icon-image" alt="${app.name}">` 
                : `<span class="icon">${app.icon}</span>`;
            
            appItem.innerHTML = `
                ${iconContent}
                <span class="name">${app.name}</span>
            `;

            appItem.addEventListener('click', () => {
                this.launchApplication(app);
                taskbarManager.hideStartMenu();
            });

            appsList.appendChild(appItem);
        });
    }

    // アプリケーションの起動
    launchApplication(app) {
        // ウィンドウを作成
        const windowId = windowManager.createWindow(app);
        
        // タスクバーにアイテムを追加（アプリ名のみ表示）
        taskbarManager.addTaskbarItem(windowId, {
            ...app,
            icon: app.name // アイコンの代わりにアプリ名を使用
        });
    }

    // アプリケーションの終了
    closeApplication(windowId) {
        windowManager.closeWindow(windowId);
        taskbarManager.removeTaskbarItem(windowId);
    }

    // アプリケーションの検索
    searchApplications(query) {
        return this.apps.filter(app => 
            app.name.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// グローバルなアプリケーションマネージャーのインスタンスを作成
const applicationManager = new ApplicationManager();
