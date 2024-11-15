// システム全体のキーボードショートカット管理
document.addEventListener('DOMContentLoaded', () => {
    initializeKeyboardShortcuts();
    console.log('システムのキーボードショートカットを初期化しました');
});

// キーボードショートカットの初期化
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Command/Ctrl + S: 保存
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentNote();
            console.log('ショートカット: 保存を実行');
        }
        
        // Command/Ctrl + N: 新規作成
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            createNewNote();
            console.log('ショートカット: 新規作成を実行');
        }
    });

    console.log('キーボードショートカットを設定しました');
}