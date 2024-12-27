// すべてのデータのインポート
function allDataImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                const parsedContent = JSON.parse(content);
                
                // データの検証
                if (!Array.isArray(parsedContent)) {
                    throw new Error('Invalid data format');
                }
                
                // タイムスタンプの検証と修正
                parsedContent.forEach(thread => {
                    if (!thread.updatedAt) {
                        thread.updatedAt = new Date().toISOString();
                    }
                    if (!thread.createdAt) {
                        thread.createdAt = thread.updatedAt;
                    }
                });
                
                localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(parsedContent, null, 2));
                threadsYomikomi();
                tsuchiBaru('データをインポートしました');
            } catch (err) {
                console.error('Import error:', err);
                tsuchiBaru('無効なJSONファイルです', 'error');
            }
        }
        
        reader.readAsText(file);
    };
    
    input.click();
}