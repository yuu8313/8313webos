// Quillエディターの設定
function initializeQuillEditor() {
    const dateIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    `;

    const icons = Quill.import('ui/icons');
    icons['date'] = dateIcon;

    quillEditor = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'font': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link', 'image', 'video', 'formula', 'date'],
                    ['clean']
                ],
                handlers: {
                    'formula': handleFormulaInsert,
                    'video': handleVideoInsert,
                    'link': handleLinkInsert,
                    'date': handleDateInsert
                }
            }
        }
    });
}