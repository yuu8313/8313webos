class SystemManager {
    constructor() {
        this.storageKey = '8313-new-husen';
    }

    saveNotes() {
        const notes = window.husenManager.notes.map(note => ({
            content: note.quill.root.innerHTML,
            position: {
                x: parseInt(note.element.style.left),
                y: parseInt(note.element.style.top)
            },
            size: {
                width: parseInt(note.element.style.width),
                height: parseInt(note.element.style.height)
            },
            color: note.element.querySelector('.note-color').value
        }));

        localStorage.setItem(this.storageKey, JSON.stringify(notes));
        
        anime({
            targets: '.control-btn',
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });

        window.husenManager.showNotification('メモを保存しました');
    }

    loadNotes() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const notes = JSON.parse(saved);
            notes.forEach(note => {
                window.husenManager.createNote(note.content, note.position, note.color, note.size);
            });
        }
    }
}