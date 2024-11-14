// application.js - アプリケーションの管理を担当
class ApplicationManager {
    constructor() {
        this.apps = [
            { id: 'kensaku', name: '8313複合検索エンジン', path: 'src/apps/app1/index.html', icon: 'src/image/icon1.png', iconType: 'image' },
            { id: 'dentaku', name: '8313電卓', path: 'src/apps/app3/index.html', icon: 'src/image/icon3.png', iconType: 'image' },
            { id: 'memotyou', name: '8313メモ', path: 'src/apps/app27/src/OS.html', icon: 'src/image/icon27.png', iconType: 'image' },
            { id: 'txtEditor', name: '8313テキストエディター', path: 'src/apps/app37/index.html', icon: 'src/image/icon37.png', iconType: 'image' },
            { id: 'bookmark', name: '8313ブックマーク保存', path: 'src/apps/app28/index.html', icon: 'src/image/icon28.png', iconType: 'image' },
            { id: 'privacyOS', name: '8313privacyOS', path: 'src/apps/app29/index.html', icon: 'src/image/icon29.png', iconType: 'image' },
            { id: 'gazouresize', name: '8313画像リサイズアプリ', path: 'src/apps/app33/index.html', icon: 'src/image/icon23.png', iconType: 'image' },
            { id: 'gazoutorimingu', name: '8313画像トリミングアプリ', path: 'src/apps/app34/index.html', icon: 'src/image/icon23.png', iconType: 'image' },
            { id: 'dougaplayer', name: '8313新ビデオプレイヤー', path: 'src/apps/app30/index.html', icon: 'src/image/icon30.png', iconType: 'image' },
            { id: 'audioplayer', name: '8313新音楽プレイヤー', path: 'src/apps/app20/index.html', icon: 'src/image/icon20.png', iconType: 'image' },
            { id: 'PDF', name: '8313PDFプレビュー', path: 'src/apps/app21/index.html', icon: 'src/image/icon21.png', iconType: 'image' },
            { id: '2048', name: '2048ゲーム', path: 'src/apps/app22/index.html', icon: '2048', iconType: 'emoji' },
            { id: 'iroiro', name: 'いろいろ', path: 'src/apps/app7/index.html', icon: '🔧', iconType: 'emoji' },

            { id: 'perplexity', name: 'Perplexity', path: 'https://www.perplexity.ai/', icon: 'src/linkicon/perplexity.png', iconType: 'image',directRedirect: true },




        ];

        /*
{

    id: 'アプリAIをセット',

    name: 'アプリ名',

    path: 'src/apps/アプリファイル/index.html',

    icon: 'src/image/icon1.png',　or icon: '📝',

    iconType: 'image'  // 画像アイコンを使用する場合は'image'を指定 そうでなければemoji

}


{ id: 'fishing', name: '8313フィッシング詐欺体験', path: 'src/apps/fishing/index.html', icon: '⚠️', iconType: 'emoji' },


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
        if (app.directRedirect) {
            // 直接リダイレクトする場合
            window.location.href = app.path;
            return;
        }

        // 通常のアプリケーション起動処理
        const windowId = windowManager.createWindow(app);
        taskbarManager.addTaskbarItem(windowId, {
            ...app,
            icon: app.name
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