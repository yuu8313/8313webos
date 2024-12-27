/**
 * system.js - システム全体の管理を担当
 */
class SystemManager {
    constructor() {
        this.initializeSystem();
    }

    initializeSystem() {
        this.setupEventListeners();
        this.setupContextMenu();
        this.setupDragAndDrop();
        console.log('System initialized');
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.handleSystemResize();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (shortcutManager.draggedShortcut) {
                const icon = document.getElementById(shortcutManager.draggedShortcut.id);
                if (icon) {
                    icon.style.left = `${e.clientX}px`;
                    icon.style.top = `${e.clientY}px`;
                    shortcutManager.updateShortcutPosition(shortcutManager.draggedShortcut, e.clientX, e.clientY);
                }
            }
        });
    }

    handleSystemResize() {
        this.updateDesktopGrid();
        windowManager.handleWindowResize();
    }

    updateDesktopGrid() {
        const desktop = document.getElementById('desktop');
        const iconSize = 100;
        const columns = Math.floor(desktop.clientWidth / iconSize);
        desktop.style.gridTemplateColumns = `repeat(${columns}, ${iconSize}px)`;
    }

    handleKeyboardShortcuts(e) {
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.switchToNextWindow();
        }

        if (e.metaKey && e.key === 'd') {
            e.preventDefault();
            this.toggleShowDesktop();
        }
    }

    switchToNextWindow() {
        const windows = Array.from(windowManager.windows.values())
            .filter(w => w.style.display !== 'none');
        
        if (windows.length < 2) return;

        const currentIndex = windows.findIndex(w => w === windowManager.activeWindow);
        const nextIndex = (currentIndex + 1) % windows.length;
        
        windowManager.setActiveWindow(windows[nextIndex]);
    }

    toggleShowDesktop() {
        const windows = Array.from(windowManager.windows.values());
        const allMinimized = windows.every(w => w.style.display === 'none');

        if (allMinimized) {
            windows.forEach(w => {
                w.style.display = 'block';
                taskbarManager.activateTaskbarItem(w.id);
            });
        } else {
            windows.forEach(w => {
                windowManager.minimizeWindow(w.id);
            });
        }
    }

    setupContextMenu() {
        const desktop = document.getElementById('desktop');
        
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if (e.target.closest('.desktop-icon.shortcut')) {
                return;
            }
            
            const appIcon = e.target.closest('.desktop-icon[data-app-name]');
            if (appIcon) {
                const appName = appIcon.dataset.appName;
                const appData = appLoader.installedApps.get(appName);
                if (appData) {
                    contextMenuManager.showAppContextMenu(e.clientX, e.clientY, appData);
                    return;
                }
            }
            
            contextMenuManager.showDefaultContextMenu(e.clientX, e.clientY);
        });
    }

    setupDragAndDrop() {
        const desktop = document.getElementById('desktop');
        
        desktop.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        desktop.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            for (const file of files) {
                if (file.name.endsWith('.8313osapp')) {
                    const appData = await appInstaller.installApp(file);
                    if (appData) {
                        appLoader.registerApp(appData);
                    }
                }
            }
        });
    }
}

const systemManager = new SystemManager();