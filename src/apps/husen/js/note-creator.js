class NoteCreator {
    static createNoteElement(content = '', position = { x: 50, y: 50 }, color = '#ffd700', size = { width: 200, height: 200 }) {
        const note = document.createElement('div');
        note.className = 'note dragging-mode';
        note.style.left = `${position.x}px`;
        note.style.top = `${position.y}px`;
        note.style.width = `${size.width}px`;
        note.style.height = `${size.height}px`;
        note.style.backgroundColor = HusenManager.hexToRGBA(color, 0.2);

        note.innerHTML = `
            <div class="note-header">
                <div class="note-timestamp">${new Date().toLocaleString('ja-JP')}</div>
                <div class="note-controls">
                    <input type="color" class="note-color" value="${color}">
                    <button class="note-control note-delete">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="note-content"></div>
            <div class="resize-handle"></div>
        `;

        return note;
    }

    static initQuill(noteElement, content = '') {
        const quill = new Quill(noteElement.querySelector('.note-content'), {
            theme: 'snow',
            placeholder: 'メモを入力...',
            modules: {
                toolbar: [
                    
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    
                    [{ 'align': [] }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    
                    [{ 'color': [] }, { 'background': [] }],
                    
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        if (content) {
            quill.root.innerHTML = content;
        }

        return quill;
    }
}

window.NoteCreator = NoteCreator;