// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // エディター初期化
    initializeQuillEditor();

    // ダイアログのスタイルを設定
    setupDialogStyles();

    // イベントリスナーの設定
    document.getElementById('createThreadBtn').addEventListener('click', threadSakusei);
    document.getElementById('exportAllBtn').addEventListener('click', allDataExport);
    document.getElementById('importAllBtn').addEventListener('click', allDataImport);
    document.getElementById('exportTxtBtn').addEventListener('click', txtExport);
    document.getElementById('saveBtn').addEventListener('click', sokujiHozon);
    document.getElementById('threadTitle').addEventListener('change', titleHenko);

    // コンテキストメニューの設定
    setupContextMenu();

    // エディターの変更を監視
    quillEditor.on('text-change', () => {
        if (genzaiNoThread) {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
            
            saveTimeout = setTimeout(() => {
                hozonSuru();
                saveTimeout = null;
            }, 500);
        }
    });

    // 初期データの読み込み
    threadsYomikomi();
});