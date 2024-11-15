// グローバル変数の定義
let quill;              // Quillエディタのインスタンス
let currentNoteId = null; // 現在選択されているノートのID

// DOMが読み込まれた後の初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeQuill();
    loadNotes();
    console.log('メインアプリケーションが初期化されました');
});

// Quillエディタの初期化
function initializeQuill() {
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'メモを入力してください...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    });
    console.log('Quillエディタが初期化されました');
}

// ノート一覧の読み込み
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('8313-new-note') || '[]');
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.textContent = note.title || '無題のメモ';
        noteElement.dataset.id = note.id;
        
        noteElement.addEventListener('click', () => loadNote(note.id));
        notesList.appendChild(noteElement);
    });
    console.log(`${notes.length}件のノートを読み込みました`);
}

// 特定のノートの読み込み
function loadNote(id) {
    const notes = JSON.parse(localStorage.getItem('8313-new-note') || '[]');
    const note = notes.find(n => n.id === id);
    
    if (note) {
        currentNoteId = id;
        quill.setContents(JSON.parse(note.content));
        document.getElementById('note-title').value = note.title || '無題のメモ';
        updateActiveNoteStyle(id);
        showNotification('メモを読み込みました');
        console.log(`ノートID: ${id}を読み込みました`);
    }
}

// アクティブなノートのスタイル更新
function updateActiveNoteStyle(id) {
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === id) {
            item.classList.add('active');
        }
    });
}

// 通知の表示
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    anime({
        targets: '#notification',
        right: 20,
        opacity: 1,
        duration: 800,
        easing: 'easeOutElastic',
        complete: () => {
            setTimeout(() => {
                anime({
                    targets: '#notification',
                    right: -300,
                    opacity: 0,
                    duration: 800,
                    easing: 'easeInElastic'
                });
            }, 3000);
        }
    });
    console.log(`通知を表示: ${message}`);
}