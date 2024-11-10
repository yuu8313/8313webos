// アプリケーション設定
const apps = [
    { name: '旧8313LaTeXエディター', path: 'app/LaTeX/index.html', icon: '🧮' },
    { name: '8313JSX to JS', path: 'app/jsxtojs/index.html', icon: '🛠️' },
    { name: '8313TS to JS', path: 'app/TStoJS/index.html', icon: '🔄' },
    { name: '8313JSまとめツール', path: 'app/Webpack/index.html', icon: '📦' },
    { name: '8313HTMLコンバータ', path: 'app/htmlkonba-ta/index.html', icon: '🧩' },
    { name: '8313ローマ字からひらがな', path: 'app/roumazihenkan/index.html', icon: 'あ' },
    { name: '8313文字カウント', path: 'app/mozikaunto/index.html', icon: '✍️' },
    { name: '8313ペイント', path: 'app/paint/index.html', icon: '🎨' },
    { name: 'QRコード作成', path: 'app/QR1/index.html', icon: '🔳' },
    { name: 'QRコード読み取り', path: 'app/QR2/index.html', icon: '📷' },
    { name: 'Code128生成', path: 'app/Code128/index.html', icon: '||| ||' },
    { name: '8313暗号作成', path: 'app/angou/index.html', icon: '👁' },
    { name: '8313PW', path: 'app/PW/index.html', icon: '🔑' },
    { name: '暗号化ステガノグラフィ', path: 'app/suteganogurafi/index.html', icon: '🖼️' },
    { name: 'Youtube埋め込み', path: 'app/Youtubeumekomi/index.html', icon: '▶️' },
    { name: 'サイト埋め込み表示', path: 'app/umekomi/index.html', icon: '🔗' },
    { name: 'スロット式乱数メーカー', path: 'app/surottoransuu/index.html', icon: '🎰' },
    { name: 'バトルアリーナ', path: 'app/batoruari-na/index.html', icon: 'RPG' },
    { name: 'ブラックジャック', path: 'app/blackjack/index.html', icon: '♤' },
    { name: 'テトリス', path: 'app/tetorisu/index.html', icon: '🕹' },
    { name: 'オセロ', path: 'app/osero/index.html', icon: '●' },



];

// デスクトップアイコンの生成
function createDesktopIcons() {
    const desktop = document.getElementById('desktop');
    apps.forEach(app => {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.innerHTML = `
            <div class="icon">${app.icon}</div>
            <div class="name">${app.name}</div>
        `;
        icon.addEventListener('dblclick', () => createWindow(app));
        desktop.appendChild(icon);
    });
}

// ウィンドウ管理
let activeWindow = null;
let windows = new Set();
let zIndex = 1000;

function createWindow(app) {
    const windowsContainer = document.getElementById('windows-container');
    const window = document.createElement('div');
    window.className = 'window';
    window.style.top = '50px';
    window.style.left = '50px';
    window.style.width = '600px';
    window.style.height = '400px';
    window.style.zIndex = zIndex++;

    window.innerHTML = `
        <div class="window-titlebar">
            <span class="window-title">${app.name}</span>
            <div class="window-controls">
                <button class="window-button minimize">─</button>
                <button class="window-button maximize">□</button>
                <button class="window-button close">×</button>
            </div>
        </div>
        <div class="window-content">
            <iframe src="${app.path}"></iframe>
        </div>
        <div class="window-resize"></div>
    `;

    windowsContainer.appendChild(window);
    windows.add(window);
    makeWindowActive(window);
    addWindowToTaskbar(window, app);
    setupWindowControls(window);
    setupWindowDrag(window);
    setupWindowResize(window);
}

// ウィンドウのドラッグ機能
function setupWindowDrag(window) {
    const titlebar = window.querySelector('.window-titlebar');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    titlebar.addEventListener('mousedown', e => {
        if (e.target !== titlebar) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = window.offsetLeft;
        initialY = window.offsetTop;
        makeWindowActive(window);
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        window.style.left = `${initialX + dx}px`;
        window.style.top = `${initialY + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// ウィンドウのリサイズ機能
function setupWindowResize(window) {
    const resizer = window.querySelector('.window-resize');
    let isResizing = false;
    let startX, startY, initialWidth, initialHeight;

    resizer.addEventListener('mousedown', e => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        initialWidth = window.offsetWidth;
        initialHeight = window.offsetHeight;
        makeWindowActive(window);
    });

    document.addEventListener('mousemove', e => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        window.style.width = `${initialWidth + dx}px`;
        window.style.height = `${initialHeight + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// ウィンドウコントロール（最小化、最大化、閉じる）
function setupWindowControls(window) {
    const minimize = window.querySelector('.minimize');
    const maximize = window.querySelector('.maximize');
    const close = window.querySelector('.close');

    minimize.addEventListener('click', () => {
        window.classList.add('minimized');
        updateTaskbarItem(window);
    });

    maximize.addEventListener('click', () => {
        window.classList.toggle('maximized');
    });

    close.addEventListener('click', () => {
        window.remove();
        windows.delete(window);
        removeFromTaskbar(window);
    });
}

// タスクバー管理
function addWindowToTaskbar(window, app) {
    const runningApps = document.getElementById('running-apps');
    const taskbarItem = document.createElement('button');
    taskbarItem.className = 'taskbar-item active';
    taskbarItem.innerHTML = `
        <span>${app.icon}</span>
        <span>${app.name}</span>
    `;
    
    taskbarItem.addEventListener('click', () => {
        if (window.classList.contains('minimized')) {
            window.classList.remove('minimized');
            makeWindowActive(window);
        } else if (window === activeWindow) {
            window.classList.add('minimized');
        } else {
            makeWindowActive(window);
        }
        updateTaskbarItem(window);
    });

    window.taskbarItem = taskbarItem;
    runningApps.appendChild(taskbarItem);
}

function removeFromTaskbar(window) {
    if (window.taskbarItem) {
        window.taskbarItem.remove();
    }
}

function updateTaskbarItem(window) {
    const taskbarItem = window.taskbarItem;
    if (!taskbarItem) return;

    if (window.classList.contains('minimized')) {
        taskbarItem.classList.remove('active');
    } else {
        taskbarItem.classList.add('active');
    }
}

// ウィンドウのアクティブ化
function makeWindowActive(window) {
    if (activeWindow) {
        activeWindow.style.zIndex = 1000;
        activeWindow.taskbarItem?.classList.remove('active');
    }
    window.style.zIndex = zIndex++;
    window.classList.remove('minimized');
    window.taskbarItem?.classList.add('active');
    activeWindow = window;
}

// スタートメニュー
function setupStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const appsGrid = startMenu.querySelector('.apps-grid');

    // スタートメニューにアプリを追加
    apps.forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = 'desktop-icon';
        appItem.innerHTML = `
            <div class="icon">${app.icon}</div>
            <div class="name">${app.name}</div>
        `;
        appItem.addEventListener('click', () => {
            createWindow(app);
            startMenu.classList.add('hidden');
        });
        appsGrid.appendChild(appItem);
    });

    // スタートボタンのクリックイベント
    startButton.addEventListener('click', () => {
        startMenu.classList.toggle('hidden');
    });

    // 外側をクリックしたら閉じる
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
    });
}

// 時計
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    clock.textContent = time;
}

// 初期化
function init() {
    createDesktopIcons();
    setupStartMenu();
    setInterval(updateClock, 1000);
    updateClock();
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', init);