// スレッド表示
function threadHyoji(thread) {
    genzaiNoThread = thread;
    document.getElementById('threadTitle').value = thread.title;
    quillEditor.root.innerHTML = thread.content;
    
    // アクティブなスレッドのハイライト
    document.querySelectorAll('.thread-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === thread.id) {
            item.classList.add('active');
        }
    });

    // スレッドの内容をローカルストレージに保存
    localStorage.setItem(STORAGE_PREFIX + 'current-thread', JSON.stringify(thread));
}