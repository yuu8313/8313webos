class NoteResizeManager {
    static init(note, manager) {
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
                noteData.size = {
                    width: newWidth,
                    height: newHeight
                };
            }
        };

        const endResize = () => {
            if (manager.resizingNote) {
                manager.resizingNote = null;
                window.systemManager.saveNotes();
                NotificationManager.show('メモのサイズを保存しました');
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