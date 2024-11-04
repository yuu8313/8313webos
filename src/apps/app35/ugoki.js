document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const textMode = document.getElementById('textMode');
    const fileMode = document.getElementById('fileMode');
    const dropZone = document.getElementById('dropZone');
    const tsInput = document.getElementById('tsInput');
    const jsOutput = document.getElementById('jsOutput');
    const errorContainer = document.getElementById('errorContainer');
    const errorContent = document.getElementById('errorContent');
    const transpileBtn = document.getElementById('transpileBtn');
    const clearTs = document.getElementById('clearTs');
    const copyJs = document.getElementById('copyJs');
    const downloadJs = document.getElementById('downloadJs');
    const strictMode = document.getElementById('strictMode');
    const removeComments = document.getElementById('removeComments');
    const notification = document.getElementById('notification');

    // モード切り替え
    textMode.addEventListener('click', () => {
        textMode.classList.add('active');
        fileMode.classList.remove('active');
        dropZone.classList.add('hidden');
        tsInput.classList.remove('hidden');
    });

    fileMode.addEventListener('click', () => {
        fileMode.classList.add('active');
        textMode.classList.remove('active');
        dropZone.classList.remove('hidden');
        tsInput.classList.add('hidden');
    });

    // ドラッグ&ドロップ処理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.ts'));
        handleFiles(files);
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        const files = Array.from(e.target.files).filter(file => file.name.endsWith('.ts'));
        handleFiles(files);
    });

    // ファイル処理
    function handleFiles(files) {
        if (files.length === 0) {
            showNotification('TSファイルを選択してください');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            tsInput.value = e.target.result;
            showNotification(`${files.length}個のファイルを読み込みました`);
        };
        reader.readAsText(files[0]);
    }

    // トランスパイル処理
    transpileBtn.addEventListener('click', () => {
        const tsCode = tsInput.value;
        if (!tsCode.trim()) {
            showNotification('コードを入力してください');
            return;
        }

        try {
            const compilerOptions = {
                strict: strictMode.checked,
                removeComments: removeComments.checked,
                target: ts.ScriptTarget.ES2015,
                module: ts.ModuleKind.CommonJS
            };

            const result = ts.transpileModule(tsCode, { compilerOptions });
            jsOutput.value = result.outputText;
            errorContainer.classList.add('hidden');
            showNotification('トランスパイル成功！');
        } catch (error) {
            errorContainer.classList.remove('hidden');
            errorContent.textContent = error.message;
            showNotification('エラーが発生しました', true);
        }
    });

    // ユーティリティ機能
    clearTs.addEventListener('click', () => {
        tsInput.value = '';
        showNotification('入力をクリアしました');
    });

    copyJs.addEventListener('click', async () => {
        if (!jsOutput.value) {
            showNotification('コピーするコードがありません');
            return;
        }
        await navigator.clipboard.writeText(jsOutput.value);
        showNotification('コードをコピーしました');
    });

    downloadJs.addEventListener('click', () => {
        if (!jsOutput.value) {
            showNotification('ダウンロードするコードがありません');
            return;
        }
        const blob = new Blob([jsOutput.value], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.js';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('ファイルをダウンロードしました');
    });

    // 通知表示
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.style.borderColor = isError ? 'var(--error)' : 'var(--accent)';
        notification.classList.remove('hidden');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});