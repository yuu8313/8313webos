/**
 * taskbar.js - タスクバーの管理を担当
 */

class TaskbarManager {
    constructor() {
        this.taskbar = document.getElementById('taskbar');
        this.runningApps = document.getElementById('running-apps');
        this.startButton = document.getElementById('start-button');
        this.startMenu = document.getElementById('start-menu');
        this.systemTray = document.getElementById('system-tray');
        
        this.initializeTaskbar();
    }

    // タスクバーの初期化
    initializeTaskbar() {
        this.setupStartButton();
        this.setupSystemTray();
        this.updateClock();
        
        // 時計の更新を開始
        setInterval(() => this.updateClock(), 1000);
    }

    // スタートボタンの設定
    setupStartButton() {
        this.startButton.addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // スタートメニュー以外をクリックした時に閉じる
        document.addEventListener('click', (e) => {
            if (!this.startButton.contains(e.target) && 
                !this.startMenu.contains(e.target)) {
                this.hideStartMenu();
            }
        });
    }

    // システムトレイの設定
    setupSystemTray() {
        const timeElement = document.createElement('div');
        timeElement.className = 'time';
        this.systemTray.appendChild(timeElement);
    }

    // 時計の更新
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
        this.systemTray.querySelector('.time').textContent = timeString;
    }

    // スタートメニューの表示/非表示を切り替え
    toggleStartMenu() {
        const isHidden = this.startMenu.classList.contains('hidden');
        if (isHidden) {
            this.showStartMenu();
        } else {
            this.hideStartMenu();
        }
    }

    // スタートメニューを表示
    showStartMenu() {
        macSystem.animateStartMenu(this.startMenu, true);
        this.startButton.classList.add('active');
    }

    // スタートメニューを非表示
    hideStartMenu() {
        macSystem.animateStartMenu(this.startMenu, false);
        this.startButton.classList.remove('active');
    }

    // タスクバーにアプリを追加
    addTaskbarItem(windowId, app) {
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item active';
        taskbarItem.dataset.windowId = windowId;
        
        taskbarItem.innerHTML = `
            <span class="icon">${app.icon}</span>
            <button class="close-button">×</button>
        `;

        // アプリアイテムのクリック処理
        taskbarItem.addEventListener('click', (e) => {
            // クローズボタンがクリックされた場合
            if (e.target.classList.contains('close-button')) {
                e.stopPropagation(); // 親要素のクリックイベントを停止
                applicationManager.closeApplication(windowId);
                return;
            }
            this.handleTaskbarItemClick(windowId);
        });

        this.runningApps.appendChild(taskbarItem);
        macSystem.styleTaskbarItems();
    }

    // タスクバーアイテムのクリック処理
    handleTaskbarItemClick(windowId) {
        const window = windowManager.windows.get(windowId);
        if (!window) return;

        if (window.style.display === 'none') {
            // 最小化されているウィンドウを復元
            window.style.display = 'block';
            windowManager.setActiveWindow(window);
            this.activateTaskbarItem(windowId);
        } else if (window.classList.contains('active')) {
            // アクティブなウィンドウを最小化
            windowManager.minimizeWindow(windowId);
            this.deactivateTaskbarItem(windowId);
        } else {
            // 非アクティブなウィンドウをアクティブに
            windowManager.setActiveWindow(window);
            this.activateTaskbarItem(windowId);
        }
    }

    // タスクバーアイテムをアクティブに
    activateTaskbarItem(windowId) {
        const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }
    }

    // タスクバーアイテムを非アクティブに
    deactivateTaskbarItem(windowId) {
        const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarItem) {
            taskbarItem.classList.remove('active');
        }
    }

    // タスクバーアイテムを削除
    removeTaskbarItem(windowId) {
        const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }
}

// グローバルなタスクバーマネージャーのインスタンスを作成
const taskbarManager = new TaskbarManager();
