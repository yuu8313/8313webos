function setupContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    const threadList = document.getElementById('threadList');

    // 右クリックイベントの処理
    threadList.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const threadItem = e.target.closest('.thread-item');
        if (threadItem) {
            contextMenu.style.display = 'block';
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.dataset.threadId = threadItem.dataset.id;
        }
    });

    // 削除ボタンのクリックイベント
    document.getElementById('deleteThreadBtn').addEventListener('click', () => {
        const threadId = contextMenu.dataset.threadId;
        if (threadId) {
            threadSakujo(threadId);
        }
        contextMenu.style.display = 'none';
    });

    // 閉じる
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });
}