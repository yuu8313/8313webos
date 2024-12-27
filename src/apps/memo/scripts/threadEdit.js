// タイトル変更
function titleHenko(event) {
    if (!genzaiNoThread) return;
    
    try {
        const newTitle = event.target.value;
        const threads = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'threads') || '[]');
        const threadIndex = threads.findIndex(t => t.id === genzaiNoThread.id);
        
        if (threadIndex !== -1) {
            threads[threadIndex].title = newTitle;
            threads[threadIndex].updatedAt = new Date().toISOString();
            genzaiNoThread.title = newTitle;
            genzaiNoThread.updatedAt = threads[threadIndex].updatedAt;
            localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(threads, null, 2));
            threadsYomikomi();
        }
    } catch (error) {
        console.error('Title change error:', error);
        tsuchiBaru('タイトルの変更中にエラーが発生しました', 'error');
    }
}

let saveTimeout = null;

// 保存
function hozonSuru() {
    if (!genzaiNoThread) return;
    
    try {
        const content = quillEditor.root.innerHTML;
        const threads = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'threads') || '[]');
        const threadIndex = threads.findIndex(t => t.id === genzaiNoThread.id);
        
        if (threadIndex !== -1) {
            threads[threadIndex].content = content;
            threads[threadIndex].updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(threads, null, 2));
        }
    } catch (error) {
        console.error('Save error:', error);
        tsuchiBaru('保存中にエラーが発生しました', 'error');
    }
}

// 即時保存
function sokujiHozon() {
    if (!genzaiNoThread) return;
    
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    saveTimeout = setTimeout(() => {
        hozonSuru();
        tsuchiBaru('メモを保存しました');
        saveTimeout = null;
    }, 500);
}