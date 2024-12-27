class HusenManager {
    constructor() {
        this.notes = [];
        this.draggedNote = null;
        this.resizingNote = null;
        this.initialX = 0;
        this.initialY = 0;
        this.initialWidth = 0;
        this.initialHeight = 0;
    }

    createNote(content = '', position = { x: 50, y: 50 }, color = '#ffd700', size = { width: 200, height: 200 }) {
        const note = NoteCreator.createNoteElement(content, position, color, size);
        document.getElementById('notes-container').appendChild(note);

        const quill = NoteCreator.initQuill(note, content);

        NoteInteractions.initNoteDrag(note, this);
        NoteInteractions.initNoteResize(note, this);
        NoteControls.initNoteControls(note, quill, this);
        
        this.showNotification('新しいメモを作成しました');
        
        anime({
            targets: note,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });

        this.notes.push({ 
            element: note, 
            quill,
            size: {
                width: size.width,
                height: size.height
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        anime({
            targets: notification,
            translateX: [100, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutCubic',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        translateX: [0, 100],
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInCubic',
                        complete: () => {
                            notification.remove();
                        }
                    });
                }, 2000);
            }
        });
    }

    static hexToRGBA(hex, alpha) {
        return NoteControls.hexToRGBA(hex, alpha);
    }
}