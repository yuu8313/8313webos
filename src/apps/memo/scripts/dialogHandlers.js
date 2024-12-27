// 数式挿入ダイアログ
function handleFormulaInsert() {
    const range = this.quill.getSelection(true);
    
    const dialog = document.createElement('div');
    dialog.className = 'ql-dialog';
    
    const overlay = document.createElement('div');
    overlay.className = 'ql-dialog-overlay';
    
    dialog.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">数式の挿入</h3>
        <input type="text" placeholder="LaTeX形式で入力してください" class="w-full p-2 border rounded mb-4">
        <div class="ql-dialog-buttons">
            <button class="ql-dialog-button secondary" data-action="cancel">キャンセル</button>
            <button class="ql-dialog-button primary" data-action="save">保存</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    const input = dialog.querySelector('input');
    input.focus();
    
    const handleSave = () => {
        const value = input.value.trim();
        if (value) {
            this.quill.insertEmbed(range.index, 'formula', value, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }
        cleanup();
    };
    
    const cleanup = () => {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            cleanup();
        }
    };
    
    dialog.querySelector('[data-action="save"]').addEventListener('click', handleSave);
    dialog.querySelector('[data-action="cancel"]').addEventListener('click', cleanup);
    document.addEventListener('keydown', handleKeyDown);
}

// 動画挿入ダイアログ
function handleVideoInsert() {
    const range = this.quill.getSelection(true);
    
    const dialog = document.createElement('div');
    dialog.className = 'ql-dialog';
    
    const overlay = document.createElement('div');
    overlay.className = 'ql-dialog-overlay';
    
    dialog.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">YouTube動画の挿入</h3>
        <input type="text" placeholder="YouTubeのURLを入力してください" class="w-full p-2 border rounded mb-4">
        <p class="text-sm text-gray-600 mb-4">※ YouTubeの動画URLのみ対応しています</p>
        <div class="ql-dialog-buttons">
            <button class="ql-dialog-button secondary" data-action="cancel">キャンセル</button>
            <button class="ql-dialog-button primary" data-action="save">保存</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    const input = dialog.querySelector('input');
    input.focus();
    
    const handleSave = () => {
        let value = input.value.trim();
        if (value) {
            const videoId = extractYouTubeVideoId(value);
            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                this.quill.insertEmbed(range.index, 'video', embedUrl, Quill.sources.USER);
                this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
            } else {
                alert('有効なYouTube URLを入力してください');
                return;
            }
        }
        cleanup();
    };
    
    const cleanup = () => {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            cleanup();
        }
    };
    
    dialog.querySelector('[data-action="save"]').addEventListener('click', handleSave);
    dialog.querySelector('[data-action="cancel"]').addEventListener('click', cleanup);
    document.addEventListener('keydown', handleKeyDown);
}

// リンク挿入ダイアログ
function handleLinkInsert() {
    const range = this.quill.getSelection(true);
    
    const dialog = document.createElement('div');
    dialog.className = 'ql-dialog';
    
    const overlay = document.createElement('div');
    overlay.className = 'ql-dialog-overlay';
    
    dialog.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">リンクの挿入</h3>
        <input type="text" placeholder="URLを入力してください" class="w-full p-2 border rounded mb-4">
        ${range.length === 0 ? `
            <input type="text" placeholder="リンクテキストを入力してください" class="w-full p-2 border rounded mb-4">
        ` : ''}
        <div class="ql-dialog-buttons">
            <button class="ql-dialog-button secondary" data-action="cancel">キャンセル</button>
            <button class="ql-dialog-button primary" data-action="save">保存</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    const urlInput = dialog.querySelector('input');
    const textInput = range.length === 0 ? dialog.querySelectorAll('input')[1] : null;
    urlInput.focus();
    
    const handleSave = () => {
        const url = urlInput.value.trim();
        if (url) {
            if (range.length === 0) {
                const text = textInput.value.trim() || url;
                this.quill.insertText(range.index, text, 'link', url, Quill.sources.USER);
            } else {
                this.quill.format('link', url, Quill.sources.USER);
            }
        }
        cleanup();
    };
    
    const cleanup = () => {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeyDown);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            cleanup();
        }
    };
    
    dialog.querySelector('[data-action="save"]').addEventListener('click', handleSave);
    dialog.querySelector('[data-action="cancel"]').addEventListener('click', cleanup);
    document.addEventListener('keydown', handleKeyDown);
}