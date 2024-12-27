/**
 * bookmark.js - ブックマークの管理を担当
 */
class BookmarkManager {
    constructor() {
        this.shortcuts = [];
        this.draggedShortcut = null;
        this.loadShortcuts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        document.getElementById('desktop').addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedShortcut) {
                return;
            }
            
            const url = e.dataTransfer.getData('text/uri-list');
            const title = e.dataTransfer.getData('text/plain');
            
            if (url && url.startsWith('https://')) {
                this.createShortcut(url, title || url, e.clientX, e.clientY);
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.draggedShortcut) {
                const icon = document.getElementById(this.draggedShortcut.id);
                if (icon) {
                    icon.style.left = `${e.clientX}px`;
                    icon.style.top = `${e.clientY}px`;
                    this.updateShortcutPosition(this.draggedShortcut, e.clientX, e.clientY);
                }
            }
        });
    }

    createShortcut(url, title = 'Bookmark', x, y) {
        const id = `shortcut-${Date.now()}`;
        const shortcut = {
            id,
            url,
            title,
            x,
            y
        };

        const icon = document.createElement('div');
        icon.id = id;
        icon.className = 'desktop-icon shortcut';
        icon.draggable = true;

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
        icon.innerHTML = `
            <img src="${faviconUrl}" class="favicon" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>'"/>
            <span class="name">${title}</span>
        `;
        
        icon.style.position = 'absolute';
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;

        icon.addEventListener('dragstart', (e) => {
            this.draggedShortcut = shortcut;
            icon.classList.add('dragging');
        });

        icon.addEventListener('dragend', () => {
            icon.classList.remove('dragging');
            this.draggedShortcut = null;
            this.saveShortcuts();
        });

        icon.addEventListener('dblclick', () => {
            window.open(url, '_blank');
        });

        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            BookmarkContextMenu.show(shortcut, e.clientX, e.clientY);
        });

        document.getElementById('desktop').appendChild(icon);
        this.shortcuts.push(shortcut);
        this.saveShortcuts();
    }

    renameShortcut(shortcut, newName) {
        shortcut.title = newName;
        const icon = document.getElementById(shortcut.id);
        if (icon) {
            const nameElement = icon.querySelector('.name');
            if (nameElement) {
                nameElement.textContent = newName;
            }
        }
        this.saveShortcuts();
    }

    updateShortcutPosition(shortcut, x, y) {
        shortcut.x = x;
        shortcut.y = y;
        this.saveShortcuts();
    }

    deleteShortcut(shortcut) {
        const icon = document.getElementById(shortcut.id);
        if (icon) {
            icon.remove();
        }
        this.shortcuts = this.shortcuts.filter(s => s.id !== shortcut.id);
        this.saveShortcuts();
    }

    saveShortcuts() {
        localStorage.setItem('desktop-shortcuts', JSON.stringify(this.shortcuts));
    }

    loadShortcuts() {
        const saved = localStorage.getItem('desktop-shortcuts');
        if (saved) {
            const shortcuts = JSON.parse(saved);
            shortcuts.forEach(shortcut => {
                this.createShortcut(shortcut.url, shortcut.title, shortcut.x, shortcut.y);
            });
        }
    }
}

const bookmarkManager = new BookmarkManager();