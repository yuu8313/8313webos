class NoteInteractions {
    static initNoteDrag(note, manager) {
        const header = note.querySelector('.note-header');

        const startDrag = (e) => {
            if (!note.classList.contains('dragging-mode')) return;
            if (e.target.closest('.note-controls')) return;
            
            manager.draggedNote = note;
            const rect = note.getBoundingClientRect();
            
            if (e.type === 'mousedown') {
                manager.initialX = e.clientX - rect.left;
                manager.initialY = e.clientY - rect.top;
            } else {
                manager.initialX = e.touches[0].clientX - rect.left;
                manager.initialY = e.touches[0].clientY - rect.top;
            }
            
            note.style.zIndex = '1000';
            header.style.cursor = 'grabbing';
        };

        const drag = (e) => {
            if (!manager.draggedNote) return;
            
            e.preventDefault();
            
            const x = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - manager.initialX;
            const y = (e.type === 'mousemove' ? e.clientY : e.touches[0].clientY) - manager.initialY;
            
            manager.draggedNote.style.left = `${x}px`;
            manager.draggedNote.style.top = `${y}px`;
        };

        const endDrag = () => {
            if (manager.draggedNote) {
                manager.draggedNote.style.zIndex = '';
                header.style.cursor = 'move';
                manager.draggedNote = null;
                window.systemManager.saveNotes();
                manager.showNotification('メモの位置を保存しました');
            }
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        note.addEventListener('click', () => {
            document.querySelectorAll('.note').forEach(otherNote => {
                otherNote.style.zIndex = '1';
            });
            note.style.zIndex = '1000';
        });

        const editor = note.querySelector('.ql-editor');
        if (editor) {
            editor.addEventListener('input', () => {
                document.querySelectorAll('.note').forEach(otherNote => {
                    otherNote.style.zIndex = '1';
                });
                note.style.zIndex = '1000';
            });
        }
    }

    static initNoteResize(note, manager) {
        const handle = note.querySelector('.resize-handle');
        
        const startResize = (e) => {
            if (manager.draggedNote) return;
            
            manager.resizingNote = note;
            const rect = note.getBoundingClientRect();
            
            manager.initialWidth = rect.width;
            manager.initialHeight = rect.height;
            
            if (e.type === 'mousedown') {
                manager.initialX = e.clientX;
                manager.initialY = e.clientY;
            } else {
                manager.initialX = e.touches[0].clientX;
                manager.initialY = e.touches[0].clientY;
            }
            
            e.stopPropagation();
        };

        const resize = (e) => {
            if (!manager.resizingNote) return;
            
            e.preventDefault();
            
            const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            
            const deltaX = currentX - manager.initialX;
            const deltaY = currentY - manager.initialY;
            
            const newWidth = Math.max(200, manager.initialWidth + deltaX);
            const newHeight = Math.max(200, manager.initialHeight + deltaY);
            
            manager.resizingNote.style.width = `${newWidth}px`;
            manager.resizingNote.style.height = `${newHeight}px`;
            
            const noteData = manager.notes.find(n => n.element === manager.resizingNote);
            if (noteData) {
                noteData.size = { width: newWidth, height: newHeight };
            }
        };

        const endResize = () => {
            if (manager.resizingNote) {
                manager.resizingNote = null;
                window.systemManager.saveNotes();
                manager.showNotification('メモのサイズを保存しました');
            }
        };

        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('touchmove', resize);
        document.addEventListener('mouseup', endResize);
        document.addEventListener('touchend', endResize);
    }
}

window.NoteInteractions = NoteInteractions;