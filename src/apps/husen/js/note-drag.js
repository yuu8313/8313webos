class NoteDragManager {
    static init(note, manager) {
        const header = note.querySelector('.note-header');

        const startDrag = (e) => {
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
            
            note.style.zIndex = 1000;
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
                manager.draggedNote = null;
            }
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
}