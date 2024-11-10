class SidebarManager {
    static init() {
        const startButton = document.getElementById('start-button');
        const sidebar = document.getElementById('sidebar');

        startButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && 
                !startButton.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.style.position = 'relative';
            icon.style.margin = '10px 0';
            icon.innerHTML = `
                <img src="${app.icon}" alt="${app.name}">
                <span>${app.name}</span>
            `;
            icon.addEventListener('click', () => {
                WindowManager.createWindow(app);
                sidebar.classList.remove('active');
            });
            sidebar.appendChild(icon);
        });
    }
}