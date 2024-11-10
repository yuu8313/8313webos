class DockManager {
    static addIcon(app) {
        const dock = document.getElementById('dock');
        // 既存のアイコンをチェック
        const existingIcon = Array.from(dock.children).find(icon => 
            icon.querySelector('img').alt === app.name
        );
        
        // 既存のアイコンがある場合は新しく作成しない
        if (existingIcon) {
            return;
        }

        const icon = document.createElement('div');
        icon.className = 'desktop-icon dock-icon';
        icon.innerHTML = `<img src="${app.icon}" alt="${app.name}">`;
        icon.onclick = () => {
            const windows = Array.from(WindowManager.windows);
            const appWindow = windows.find(w => 
                w.querySelector('.window-title').textContent === app.name
            );
            if (appWindow) {
                appWindow.style.display = 'block';
                appWindow.style.zIndex = ++WindowManager.zIndex;
            }
        };
        dock.appendChild(icon);
        
        // Dockのサイズを更新
        this.updateDockSize();
    }

    static removeIcon(app) {
        const dock = document.getElementById('dock');
        const icons = dock.getElementsByClassName('dock-icon');
        for (let icon of icons) {
            if (icon.querySelector('img').alt === app.name) {
                icon.remove();
                break;
            }
        }
        // アイコンを削除した後にDockのサイズを更新
        this.updateDockSize();
    }

    static updateDockSize() {
        const dock = document.getElementById('dock');
        const iconCount = dock.children.length;
        // アイコンの数に基づいてDockの幅を計算
        // 各アイコンの幅(48px) + パディング(10px * 2) + アイコン間のギャップ(10px)
        const dockWidth = (iconCount * 68) + 20; // 20はDock自体のパディング
        dock.style.width = `${dockWidth}px`;
    }
}