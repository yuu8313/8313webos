// スレッド作成
function threadSakusei() {
    try {
        const threads = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'threads') || '[]');
        const newThread = {
            id: Date.now().toString(),
            title: '新規メモ',
            content: '',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        threads.push(newThread);
        localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(threads, null, 2));
        
        threadsYomikomi();
        threadHyoji(newThread);
        tsuchiBaru('新規メモを作成しました');
    } catch (error) {
        console.error('Thread creation error:', error);
        tsuchiBaru('メモの作成中にエラーが発生しました', 'error');
    }
}