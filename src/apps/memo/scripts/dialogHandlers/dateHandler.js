// 日付と時刻の挿入ダイアログを処理する関数
function handleDateInsert() {
    // ダイアログを作成
    const dialog = document.createElement('div');
    dialog.className = 'ql-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3 class="text-lg font-semibold mb-4">日付と時刻の挿入</h3>
            <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2">
                    <input type="checkbox" id="includeDate" checked>
                    <span>日付を含める</span>
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" id="includeTime" checked>
                    <span>時刻を含める</span>
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" id="includeSeconds">
                    <span>秒を含める</span>
                </label>
            </div>
            <div class="ql-dialog-buttons">
                <button class="ql-dialog-button secondary" onclick="closeDateDialog(this.parentElement.parentElement.parentElement)">キャンセル</button>
                <button class="ql-dialog-button primary" onclick="insertCurrentDateTime(this.parentElement.parentElement.parentElement)">挿入</button>
            </div>
        </div>
    `;

    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'ql-dialog-overlay';
    overlay.onclick = () => closeDateDialog(dialog);

    // ダイアログとオーバーレイを表示
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

// ダイアログを閉じる関数
function closeDateDialog(dialog) {
    const overlay = document.querySelector('.ql-dialog-overlay');
    if (overlay) overlay.remove();
    if (dialog) dialog.remove();
}

// 日付と時刻を挿入する関数
function insertCurrentDateTime(dialog) {
    const includeDate = document.getElementById('includeDate').checked;
    const includeTime = document.getElementById('includeTime').checked;
    const includeSeconds = document.getElementById('includeSeconds').checked;

    let format = '';
    if (includeDate) {
        format += 'YYYY年MM月DD日';
    }
    if (includeTime) {
        if (includeDate) format += ' ';
        format += 'HH:mm';
        if (includeSeconds) format += ':ss';
    }

    const currentDateTime = dayjs().format(format);
    const range = quillEditor.getSelection(true);
    quillEditor.insertText(range.index, currentDateTime, 'user');
    
    closeDateDialog(dialog);
}