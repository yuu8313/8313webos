// window.js - ウィンドウの作成と管理を担当

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.initializeEventListeners();
    }

    // イベントリスナーの初期化
    initializeEventListeners() {
        document.addEventListener('mousedown', this.handleWindowFocus.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    // 新しいウィンドウを作成
    createWindow(app) {
        const windowId = `window-${Date.now()}`;
        const window = document.createElement('div');
        window.id = windowId;
        window.className = 'window';
        window.dataset.appId = app.id;

        // ウィンドウの初期位置とサイズを設定
        const { width, height } = this.calculateInitialWindowSize();
        const { left, top } = this.calculateInitialWindowPosition(width, height);
        
        Object.assign(window.style, {
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`
        });

        // ウィンドウの内容を構築
        window.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <button class="window-control window-close"></button>
                    <button class="window-control window-minimize"></button>
                    <button class="window-control window-maximize"></button>
                </div>
                <div class="window-title">${app.name}</div>
            </div>
            <div class="window-content">
                <iframe src="${app.path}" frameborder="0" style="width: 100%; height: 100%;"></iframe>
            </div>
        `;

        // コントロールボタンのイベントを設定
        this.setupWindowControls(window);
        
        // ドラッグ＆リサイズの機能を追加
        this.makeWindowDraggable(window);
        this.makeWindowResizable(window);

        // ウィンドウを表示
        document.getElementById('windows-container').appendChild(window);
        this.windows.set(windowId, window);
        this.setActiveWindow(window);

        // MacOS風のアニメーションを適用
        macSystem.animateWindowOpen(window);

        return windowId;
    }

    // ウィンドウの初期サイズを計算
    calculateInitialWindowSize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        return {
            width: Math.min(800, screenWidth * 0.8),
            height: Math.min(600, screenHeight * 0.8)
        };
    }

    // ウィンドウの初期位置を計算
    calculateInitialWindowPosition(width, height) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        return {
            left: (screenWidth - width) / 2,
            top: (screenHeight - height) / 2
        };
    }

    // ウィンドウコントロールの設定
    setupWindowControls(window) {
        const controls = window.querySelector('.window-controls');
        
        controls.querySelector('.window-close').addEventListener('click', () => {
            this.closeWindow(window.id);
        });

        controls.querySelector('.window-minimize').addEventListener('click', () => {
            this.minimizeWindow(window.id);
        });

        controls.querySelector('.window-maximize').addEventListener('click', () => {
            this.maximizeWindow(window.id);
        });
    }

    // ウィンドウをドラッグ可能にする
    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = window.offsetLeft;
            initialY = window.offsetTop;

            const mouseMoveHandler = (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                window.style.left = `${initialX + dx}px`;
                window.style.top = `${initialY + dy}px`;

                // スナップ機能の判定
                windowsSystem.handleWindowSnap(window, e.clientX, e.clientY);
            };

            const mouseUpHandler = () => {
                isDragging = false;
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }

    // ウィンドウをリサイズ可能にする
    makeWindowResizable(window) {
        const minWidth = 300;
        const minHeight = 200;
        const edges = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];

        edges.forEach(edge => {
            const resizer = document.createElement('div');
            resizer.className = `resizer resizer-${edge}`;
            window.appendChild(resizer);

            let startX, startY, startWidth, startHeight, startLeft, startTop;

            resizer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(window.offsetWidth, 10);
                startHeight = parseInt(window.offsetHeight, 10);
                startLeft = window.offsetLeft;
                startTop = window.offsetTop;

                const mouseMoveHandler = (e) => {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    if (edge.includes('e')) {
                        const newWidth = Math.max(startWidth + dx, minWidth);
                        window.style.width = `${newWidth}px`;
                    }
                    if (edge.includes('s')) {
                        const newHeight = Math.max(startHeight + dy, minHeight);
                        window.style.height = `${newHeight}px`;
                    }
                    if (edge.includes('w')) {
                        const newWidth = Math.max(startWidth - dx, minWidth);
                        if (newWidth !== startWidth) {
                            window.style.width = `${newWidth}px`;
                            window.style.left = `${startLeft + startWidth - newWidth}px`;
                        }
                    }
                    if (edge.includes('n')) {
                        const newHeight = Math.max(startHeight - dy, minHeight);
                        if (newHeight !== startHeight) {
                            window.style.height = `${newHeight}px`;
                            window.style.top = `${startTop + startHeight - newHeight}px`;
                        }
                    }
                };

                const mouseUpHandler = () => {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
        });
    }

    // ウィンドウのフォーカス処理
    handleWindowFocus(e) {
        const window = e.target.closest('.window');
        if (window) {
            this.setActiveWindow(window);
        }
    }

    // アクティブウィンドウの設定
    setActiveWindow(window) {
        if (this.activeWindow === window) return;
        
        if (this.activeWindow) {
            this.activeWindow.classList.remove('active');
        }
        
        window.classList.add('active');
        window.style.zIndex = this.getTopZIndex() + 1;
        this.activeWindow = window;
    }

    // 最上位のZ-indexを取得
    getTopZIndex() {
        let maxZ = 1000;
        this.windows.forEach(window => {
            const z = parseInt(window.style.zIndex || 0);
            maxZ = Math.max(maxZ, z);
        });
        return maxZ;
    }

    // ウィンドウを閉じる
    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        macSystem.animateWindowClose(window);
        this.windows.delete(windowId);
        
        // タスクバーからも削除
        const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }

    // ウィンドウを最小化
    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        window.classList.add('minimizing');
        setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('minimizing');
        }, 300);

        // タスクバーのアイテムを更新
        const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarItem) {
            taskbarItem.classList.remove('active');
        }
    }

    // ウィンドウを最大化
    maximizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        if (!window.dataset.isMaximized) {
            // 現在の状態を保存
            window.dataset.originalStyle = JSON.stringify({
                top: window.style.top,
                left: window.style.left,
                width: window.style.width,
                height: window.style.height
            });

            // 最大化
            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';
            window.dataset.isMaximized = 'true';
        } else {
            // 元のサイズに戻す
            const originalStyle = JSON.parse(window.dataset.originalStyle);
            Object.assign(window.style, originalStyle);
            delete window.dataset.isMaximized;
        }

        window.classList.add('maximizing');
        setTimeout(() => {
            window.classList.remove('maximizing');
        }, 300);
    }

    // ウィンドウのリサイズ処理
    handleWindowResize() {
        this.windows.forEach(window => {
            if (window.dataset.isMaximized) {
                window.style.width = '100%';
                window.style.height = '100%';
            }
        });
    }
}

// グローバルなウィンドウマネージャーのインスタンスを作成
const windowManager = new WindowManager();