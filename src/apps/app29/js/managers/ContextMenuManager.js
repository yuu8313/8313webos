class ContextMenuManager {
    static init() {
        const desktop = document.getElementById('desktop');
        const contextMenu = document.getElementById('context-menu');
        const changePasswordItem = document.getElementById('change-password');

        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextMenu.style.display = 'block';
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
        });

        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });

        changePasswordItem.addEventListener('click', () => {
            const newPassword = prompt('新しいパスワードを入力してください');
            if (newPassword) {
                PasswordManager.setPassword(newPassword);
                alert('パスワードが変更されました');
            }
        });
    }
}