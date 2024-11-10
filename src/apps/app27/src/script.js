    const apps = [
        { name: 'メモ帳', icon: '📝', path: 'app/notes/notes.html' },
        { name: '付箋メモ帳', icon: '🔖', path: 'app/husen/husen.html' },
        { name: 'チャットメモ帳', icon: '💬', path: 'app/chat/chat.html' },
        { name: 'TODOメモ帳', icon: '✅', path: 'app/todo/todo.html' },
        { name: 'フォルダー階層メモ', icon: '📁', path: 'app/folder/index.html' },
    ];

    let windows = [];
    let activeWindow = null;
    let highestZIndex = 1;

    // デスクトップにアプリアイコンを表示
    function createDesktopIcons() {
        const desktop = document.getElementById('desktop');
        apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'app-icon';
            icon.innerHTML = `
                <div class="app-icon-image">${app.icon}</div>
                <div class="app-icon-label">${app.name}</div>
            `;

            // .app-icon-image にのみクリックイベントをバインド
            icon.querySelector('.app-icon-image').addEventListener('click', () => openApp(app));
            desktop.appendChild(icon);
        });
    }

    function createWindow(app) {
        const window = document.createElement('div');
        window.className = 'window opening';
        window.style.left = '50px';
        window.style.top = '50px';
        window.style.zIndex = ++highestZIndex;

        window.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="control-btn close"></div>
                    <div class="control-btn minimize"></div>
                    <div class="control-btn maximize"></div>
                </div>
                <div class="window-title">${app.name}</div>
            </div>
            <div class="window-content">
                <iframe src="${app.path}"></iframe>
                <div class="resize-handle"></div>
            </div>
        `;

        document.body.appendChild(window);
        windows.push({ element: window, app });

        // ウィンドウのドラッグ機能
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - window.offsetLeft;
            initialY = e.clientY - window.offsetTop;
            window.style.zIndex = ++highestZIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                window.style.left = `${currentX}px`;
                window.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // リサイズ機能
        const resizeHandle = window.querySelector('.resize-handle');
        let isResizing = false;
        let initialWidth;
        let initialHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            initialWidth = window.offsetWidth;
            initialHeight = window.offsetHeight;
            initialX = e.clientX;
            initialY = e.clientY;
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const width = initialWidth + (e.clientX - initialX);
                const height = initialHeight + (e.clientY - initialY);
                window.style.width = `${Math.max(400, width)}px`;
                window.style.height = `${Math.max(300, height)}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });

        // コントロールボタンの機能
        const closeBtn = window.querySelector('.close');
        const minimizeBtn = window.querySelector('.minimize');
        const maximizeBtn = window.querySelector('.maximize');

        closeBtn.addEventListener('click', () => {
            window.remove();
            windows = windows.filter(w => w.element !== window);
            removeDockIcon(app);
        });

        minimizeBtn.addEventListener('click', () => {
            window.style.display = 'none';
            addDockIcon(app);
        });

        maximizeBtn.addEventListener('click', () => {
            if (window.style.width === '100vw') {
                window.style.width = '800px';
                window.style.height = '600px';
                window.style.top = '50px';
                window.style.left = '50px';
            } else {
                window.style.width = '100vw';
                window.style.height = '100vh';
                window.style.top = '0';
                window.style.left = '0';
            }
        });

        return window;
    }

    function addDockIcon(app) {
        const dock = document.getElementById('dock');
        const icon = document.createElement('div');
        icon.className = 'dock-item';
        icon.innerHTML = app.icon;
        icon.addEventListener('click', () => {
            const window = windows.find(w => w.app === app);
            if (window) {
                window.element.style.display = 'flex';
                window.element.style.zIndex = ++highestZIndex;
                icon.remove();
            }
        });
        dock.appendChild(icon);
    }

    function removeDockIcon(app) {
        const dock = document.getElementById('dock');
        const icons = dock.querySelectorAll('.dock-item');
        icons.forEach(icon => {
            if (icon.innerHTML === app.icon) {
                icon.remove();
            }
        });
    }

    function openApp(app) {
        const existingWindow = windows.find(w => w.app === app);
        if (existingWindow) {
            existingWindow.element.style.display = 'flex';
            existingWindow.element.style.zIndex = ++highestZIndex;
            removeDockIcon(app);
        } else {
            createWindow(app);
        }
    }

    // 初期化
    createDesktopIcons();