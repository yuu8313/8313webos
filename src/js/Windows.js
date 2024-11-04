// Windows.js - Windows風の動作を実現するための機能を提供

class WindowsSystem {
    constructor() {
        // Windowsシステムの初期設定
        this.activeWindow = null;
        this.windowZIndex = 1000;
    }

    // ウィンドウのフォーカス管理
    setActiveWindow(window) {
        if (this.activeWindow) {
            this.activeWindow.classList.remove('active');
        }
        window.style.zIndex = ++this.windowZIndex;
        window.classList.add('active');
        this.activeWindow = window;
    }

    // ウィンドウのスナップ機能
    handleWindowSnap(window, x, y) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // 画面端でのスナップ判定
        if (x < 10) { // 左端
            this.snapWindowToLeft(window);
        } else if (x > screenWidth - 10) { // 右端
            this.snapWindowToRight(window);
        } else if (y < 10) { // 上端
            this.maximizeWindow(window);
        }
    }

    // 左半分にスナップ
    snapWindowToLeft(window) {
        window.style.left = '0';
        window.style.top = '0';
        window.style.width = '50%';
        window.style.height = '100%';
    }

    // 右半分にスナップ
    snapWindowToRight(window) {
        window.style.left = '50%';
        window.style.top = '0';
        window.style.width = '50%';
        window.style.height = '100%';
    }

    // ウィンドウの最大化
    maximizeWindow(window) {
        if (!window.dataset.isMaximized) {
            // 現在の位置とサイズを保存
            window.dataset.originalStyle = JSON.stringify({
                top: window.style.top,
                left: window.style.left,
                width: window.style.width,
                height: window.style.height
            });

            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';
            window.dataset.isMaximized = 'true';
        } else {
            // 保存した位置とサイズに戻す
            const originalStyle = JSON.parse(window.dataset.originalStyle);
            Object.assign(window.style, originalStyle);
            delete window.dataset.isMaximized;
        }
    }

    // ウィンドウの最小化
    minimizeWindow(window) {
        window.style.display = 'none';
        // タスクバーのアイテムを更新
        const taskbarItem = document.querySelector(`[data-window-id="${window.id}"]`);
        if (taskbarItem) {
            taskbarItem.classList.remove('active');
        }
    }

    // ウィンドウの復元
    restoreWindow(window) {
        window.style.display = 'block';
        this.setActiveWindow(window);
        const taskbarItem = document.querySelector(`[data-window-id="${window.id}"]`);
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }
    }
}

// グローバルなWindowsシステムのインスタンスを作成
const windowsSystem = new WindowsSystem();