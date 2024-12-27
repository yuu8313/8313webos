/**
 * BookmarkContextMenu.js - ブックマークの右クリックメニューを管理
 */
class BookmarkContextMenu {
    static show(shortcut, x, y) {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        const menuItems = [
            { 
                label: '名前変更', 
                icon: '✏️',
                action: () => {
                    this.handleRename(shortcut);
                    menu.remove();
                }
            },
            { 
                label: '削除', 
                icon: '🗑️',
                action: () => {
                    this.handleDelete(shortcut);
                    menu.remove();
                }
            }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span class="label">${item.label}</span>
            `;
            menuItem.addEventListener('click', item.action);
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        document.addEventListener('click', closeMenu);
    }

    static handleRename(shortcut) {
        const newName = prompt('新しい名前を入力してください:', shortcut.title);
        if (newName !== null && newName.trim() !== '') {
            bookmarkManager.renameShortcut(shortcut, newName.trim());
            AppNotification.show('成功', 'ブックマークの名前を変更しました', 'success');
        }
    }

    static handleDelete(shortcut) {
        if (confirm(`${shortcut.title}を削除してもよろしいですか？`)) {
            bookmarkManager.deleteShortcut(shortcut);
            AppNotification.show('成功', 'ブックマークを削除しました', 'success');
        }
    }
}