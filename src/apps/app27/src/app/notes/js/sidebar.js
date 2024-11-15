// DOMの読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebarListeners();
    console.log('サイドバーリスナーを初期化しました');
});

// サイドバーのイベントリスナー初期化
function initializeSidebarListeners() {
    document.getElementById('new-note').addEventListener('click', createNewNote);
    document.getElementById('save-note').addEventListener('click', saveCurrentNote);
    document.getElementById('delete-note').addEventListener('click', deleteCurrentNote);
    console.log('サイドバーのボタンイベントを設定しました');
}

// 新規ノートの作成
function createNewNote() {
    const notes = JSON.parse(localStorage.getItem('8313-new-note') || '[]');
    const newNote = {
        id: Date.now().toString(),
        title: '新規メモ',
        content: JSON.stringify(quill.getContents()),
        createdAt: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    localStorage.setItem('8313-new-note', JSON.stringify(notes));
    
    loadNotes();
    loadNote(newNote.id);
    showNotification('新規メモを作成しました');
    console.log('新規ノートを作成:', newNote.id);
}

// 現在のノートの保存
function saveCurrentNote() {
    if (!currentNoteId) {
        showNotification('保存するメモを選択してください');
        return;
    }

    const notes = JSON.parse(localStorage.getItem('8313-new-note') || '[]');
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    
    if (noteIndex !== -1) {
        const title = document.getElementById('note-title').value || '無題のメモ';
        notes[noteIndex].title = title;
        notes[noteIndex].content = JSON.stringify(quill.getContents());
        notes[noteIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('8313-new-note', JSON.stringify(notes));
        loadNotes(); // タイトルの更新を反映
        showNotification('メモを保存しました');
        console.log('ノートを保存:', currentNoteId);
    }
}

// 現在のノートの削除
function deleteCurrentNote() {
    if (!currentNoteId) {
        showNotification('削除するメモを選択してください');
        return;
    }

    if (confirm('このメモを削除してもよろしいですか？')) {
        const notes = JSON.parse(localStorage.getItem('8313-new-note') || '[]');
        const filteredNotes = notes.filter(n => n.id !== currentNoteId);
        localStorage.setItem('8313-new-note', JSON.stringify(filteredNotes));
        
        currentNoteId = null;
        quill.setContents([]);
        document.getElementById('note-title').value = '';
        loadNotes();
        showNotification('メモを削除しました');
        console.log('ノートを削除:', currentNoteId);
    }
}