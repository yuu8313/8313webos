class NoteControls {
    static initNoteControls(note, quill, manager) {
        const colorPicker = note.querySelector('.note-color');
        const deleteBtn = note.querySelector('.note-delete');

        colorPicker.addEventListener('input', (e) => {
            note.style.backgroundColor = HusenManager.hexToRGBA(e.target.value, 0.2);
        });

        deleteBtn.addEventListener('click', () => {
            anime({
                targets: note,
                scale: 0,
                opacity: 0,
                duration: 300,
                easing: 'easeInCubic',
                complete: () => {
                    note.remove();
                    manager.notes = manager.notes.filter(n => n.element !== note);
                }
            });
        });
    }

    static hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

window.NoteControls = NoteControls;