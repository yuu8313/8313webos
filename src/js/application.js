/**
 * application.js - アプリケーションの管理を担当
 */

class ApplicationManager {
    constructor() {
        this.apps = [
            { id: 'kensaku', name: '8313複合検索エンジン', path: 'src/apps/8313kensaku/index.html', icon: 'src/image/icon1.png', iconType: 'image' },
            { id: 'dentaku', name: '計算機', path: 'src/apps/keisan/index.html', icon: 'src/image/icon3.png', iconType: 'image' },
            { id: 'memotyou', name: 'メモ帳', path: 'src/apps/memo/index.html', icon: 'src/image/icon27.png', iconType: 'image' },
            { id: 'husen', name: '付箋メモ', path: 'src/apps/husen/index.html', icon: '🔖', iconType: 'emoji' },
            { id: 'ToDo', name: 'ToDoメモ', path: 'src/apps/todo/index.html', icon: '✔', iconType: 'emoji' },
            { id: 'Chat', name: 'チャットメモ', path: 'src/apps/chat/index.html', icon: '💭', iconType: 'emoji' },
            { id: 'txtEditor', name: 'エディター', path: 'src/apps/Editor/index.html', icon: 'src/image/icon12.png', iconType: 'image' },
            { id: 'forudakaisou', name: 'フォルダー階層メモ', path: 'src/apps/folderkaisou/index.html', icon: '📁', iconType: 'emoji' },
            { id: 'mozisuukauntoandmozitikan', name: 'カウント&置換', path: 'src/apps/mozikaunntoandmozitikan/index.html', icon: 'A', iconType: 'emoji' },
            { id: 'video', name: 'videoplayer', path: 'src/apps/video/index.html', icon: 'src/image/icon30.png', iconType: 'image' },
            { id: 'qrsakusei', name: 'QRコード作成', path: 'src/apps/QR1/index.html', icon: '📱', iconType: 'emoji' },
            { id: 'qrsayomikomi', name: 'QRコード読み込み', path: 'src/apps/QR2/index.html', icon: '📱', iconType: 'emoji' },
            { id: 'zip', name: 'ZIP解凍', path: 'src/apps/zip/index.html', icon: '📦', iconType: 'emoji' },

            { id: 'perplexity', name: 'Perplexity', path: 'https://www.perplexity.ai/', icon: 'src/linkicon/perplexity.png', iconType: 'image', directRedirect: true }
        ];
        
        this.initializeApplications();
    }

    // アプリケーションの初期化
    initializeApplications() {
        this.createDesktopIcons();
        this.populateStartMenu();
        this.setupDragAndDrop();
    }

    // デスクトップアイコンの作成
    createDesktopIcons() {
        const desktopIcons = document.getElementById('desktop-icons');
        
        this.apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.draggable = true;
            icon.setAttribute('data-app-id', app.id);
            
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

    // ドラッグ＆ドロップの設定
    setupDragAndDrop() {
        const desktop = document.getElementById('desktop');
        const icons = document.querySelectorAll('.desktop-icon');

        icons.forEach(icon => {
            icon.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', '');
                icon.classList.add('dragging');
            });

            icon.addEventListener('dragend', () => {
                icon.classList.remove('dragging');
            });
        });

        desktop.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingIcon = document.querySelector('.desktop-icon.dragging');
            if (draggingIcon) {
                const rect = desktop.getBoundingClientRect();
                const x = e.clientX - rect.left - (draggingIcon.offsetWidth / 2);
                const y = e.clientY - rect.top - (draggingIcon.offsetHeight / 2);
                
                // デスクトップの範囲内に収まるように位置を調整
                const maxX = desktop.offsetWidth - draggingIcon.offsetWidth;
                const maxY = desktop.offsetHeight - draggingIcon.offsetHeight;
                
                draggingIcon.style.position = 'absolute';
                draggingIcon.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
                draggingIcon.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
            }
        });

        desktop.addEventListener('drop', (e) => {
            e.preventDefault();
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
