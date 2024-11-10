document.addEventListener('DOMContentLoaded', () => {
    LoginScreen.init();
    SidebarManager.init();
    ContextMenuManager.init();

    // デスクトップアイコンを配置
    apps.forEach((app, index) => {
        DesktopIconManager.createIcon(app, 20, 20 + (index * 100));
    });
});