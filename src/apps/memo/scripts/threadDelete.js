// スレッド削除
function threadSakujo(threadId) {
    if (confirm('このメモを削除してもよろしいですか？')) {
        const threads = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'threads') || '[]');
        const newThreads = threads.filter(t => t.id !== threadId);
        localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(newThreads));
        
        if (genzaiNoThread && genzaiNoThread.id === threadId) {
            genzaiNoThread = null;
            quillEditor.root.innerHTML = '';
            document.getElementById('threadTitle').value = '';
        }
        
        threadsYomikomi();
        tsuchiBaru('メモを削除しました');
    }
}