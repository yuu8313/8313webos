class ContextMenuManager {
    constructor() {
        this.contextMenu = null;
        this.targetNote = null;
        this.init();
    }

    init() {
        document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        document.addEventListener('click', this.hideContextMenu.bind(this));
        document.addEventListener('scroll', this.hideContextMenu.bind(this));
        document.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }

    handleContextMenu(event) {
        const noteElement = event.target.closest('.note');
        if (!noteElement) return;

        event.preventDefault();
        this.targetNote = noteElement;
        this.showContextMenu(event.pageX, event.pageY);
    }

    handleDoubleClick(event) {
        const noteElement = event.target.closest('.note');
        if (noteElement && noteElement.classList.contains('dragging-mode')) {
            noteElement.classList.remove('dragging-mode');
            window.husenManager.showNotification('ドラッグを無効にしました');
        }
    }

    showContextMenu(x, y) {
        this.hideContextMenu();

        this.contextMenu = document.createElement('div');
        this.contextMenu.className = 'context-menu';
        
        const menuItems = [
            {
                icon: 'fa-trash',
                text: 'メモを削除',
                className: 'delete',
                action: () => {
                    const note = window.husenManager.notes.find(n => n.element === this.targetNote);
                    if (note) {
                        anime({
                            targets: this.targetNote,
                            scale: 0,
                            opacity: 0,
                            duration: 300,
                            easing: 'easeInCubic',
                            complete: () => {
                                this.targetNote.remove();
                                window.husenManager.notes = window.husenManager.notes.filter(n => n.element !== this.targetNote);
                                window.husenManager.showNotification('メモを削除しました');
                            }
                        });
                    }
                }
            },
            {
                icon: 'fa-arrows-alt',
                text: 'ドラッグを切り替え',
                action: () => {
                    this.targetNote.classList.toggle('dragging-mode');
                    const isDragging = this.targetNote.classList.contains('dragging-mode');
                    window.husenManager.showNotification(
                        isDragging ? 'ドラッグを有効にしました' : 'ドラッグを無効にしました'
                    );
                }
            },
            {
                icon: 'fa-font',
                text: 'メモ名を変更',
                action: () => {
                    const newName = prompt('新しいメモ名を入力してください:', '');
                    if (newName !== null) {
                        const titleElement = this.targetNote.querySelector('.note-title') || 
                            (() => {
                                const title = document.createElement('div');
                                title.className = 'note-title';
                                this.targetNote.querySelector('.note-header').prepend(title);
                                return title;
                            })();
                        titleElement.textContent = newName;
                        window.husenManager.showNotification('メモ名を変更しました');
                    }
                }
            },
            {
                icon: 'fa-clone',
                text: 'メモを複製',
                action: () => {
                    const note = window.husenManager.notes.find(n => n.element === this.targetNote);
                    if (note) {
                        const content = note.quill.root.innerHTML;
                        const rect = this.targetNote.getBoundingClientRect();
                        window.husenManager.createNote(
                            content,
                            { x: rect.left + 20, y: rect.top + 20 },
                            this.targetNote.querySelector('.note-color').value
                        );
                        window.husenManager.showNotification('メモを複製しました');
                    }
                }
            },
            {
                icon: 'fa-lock',
                text: '編集をロック',
                action: () => {
                    const note = window.husenManager.notes.find(n => n.element === this.targetNote);
                    if (note) {
                        note.quill.enable(!note.quill.isEnabled());
                        const isLocked = !note.quill.isEnabled();
                        
                        const lockIcon = this.targetNote.querySelector('.lock-icon');
                        if (isLocked && !lockIcon) {
                            const icon = document.createElement('div');
                            icon.className = 'lock-icon';
                            icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>`;
                            this.targetNote.querySelector('.note-header').appendChild(icon);
                        } else if (!isLocked && lockIcon) {
                            lockIcon.remove();
                        }
                        
                        window.husenManager.showNotification(
                            isLocked ? '編集をロックしました' : '編集を許可しました'
                        );
                    }
                }
            }
        ];

        menuItems.forEach((item, index) => {
            if (index > 0) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                this.contextMenu.appendChild(separator);
            }

            const menuItem = document.createElement('div');
            menuItem.className = `context-menu-item${item.className ? ' ' + item.className : ''}`;
            menuItem.innerHTML = `<i class="fas ${item.icon}"></i>${item.text}`;
            menuItem.addEventListener('click', () => {
                item.action();
                this.hideContextMenu();
            });
            this.contextMenu.appendChild(menuItem);
        });

        document.body.appendChild(this.contextMenu);

        const menuRect = this.contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x + menuRect.width > viewportWidth) {
            x = viewportWidth - menuRect.width;
        }
        if (y + menuRect.height > viewportHeight) {
            y = viewportHeight - menuRect.height;
        }

        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.remove();
            this.contextMenu = null;
        }
    }
}
