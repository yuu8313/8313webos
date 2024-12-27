// スレッド一覧の読み込み
function threadsYomikomi() {
    try {
        const threads = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'threads') || '[]');
        const threadList = document.getElementById('threadList');
        threadList.innerHTML = '';
        
        // 更新日時で降順ソート
        threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        threads.forEach(thread => {
            const threadEl = document.createElement('div');
            threadEl.className = 'thread-item';
            threadEl.dataset.id = thread.id;
            threadEl.textContent = thread.title;
            
            // モバイル用のサイドバーを閉じる処理を追加
            threadEl.addEventListener('click', () => {
                threadHyoji(thread);
                const sidebar = document.querySelector('.sidebar');
                const appContainer = document.querySelector('.app-container');
                const menuToggle = document.getElementById('menuToggle');
                
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('visible');
                    appContainer.classList.remove('sidebar-open');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            });
            
            threadList.appendChild(threadEl);
        });
    } catch (error) {
        console.error('Thread list loading error:', error);
        tsuchiBaru('メモ一覧の読み込み中にエラーが発生しました', 'error');
    }
}