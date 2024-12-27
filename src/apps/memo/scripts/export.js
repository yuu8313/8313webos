// すべてのデータのエクスポート
function allDataExport() {
    try {
        const threads = localStorage.getItem(STORAGE_PREFIX + 'threads');
        const parsedThreads = JSON.parse(threads || '[]');
        
        // タイムスタンプの検証と修正
        parsedThreads.forEach(thread => {
            if (!thread.updatedAt) {
                thread.updatedAt = new Date().toISOString();
            }
            if (!thread.createdAt) {
                thread.createdAt = thread.updatedAt;
            }
        });
        
        const formattedData = JSON.stringify(parsedThreads, null, 2);
        const blob = new Blob([formattedData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memo-data-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        tsuchiBaru('すべてのデータをエクスポートしました');
    } catch (error) {
        console.error('Export error:', error);
        tsuchiBaru('エクスポート中にエラーが発生しました', 'error');
    }
}

// 現在のスレッドをテキストファイルとしてエクスポート
function txtExport() {
    if (!genzaiNoThread) return;
    
    try {
        const content = quillEditor.root.innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `${genzaiNoThread.title}-${timestamp}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        tsuchiBaru('メモをテキストファイルとしてエクスポートしました');
    } catch (error) {
        console.error('Text export error:', error);
        tsuchiBaru('テキストエクスポート中にエラーが発生しました', 'error');
    }
}