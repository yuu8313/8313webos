document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const jsxInput = document.getElementById('jsxInput');
    const jsOutput = document.getElementById('jsOutput').querySelector('code');
    const fileInput = document.getElementById('fileInput');
    const notification = document.getElementById('notification');
    const modal = document.getElementById('helpModal');

    // Buttons
    const uploadBtn = document.getElementById('uploadBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const helpBtn = document.getElementById('helpBtn');
    const closeHelpBtn = document.getElementById('closeHelpBtn');

    // Transpile JSX to JavaScript
    const transpileJSX = (code) => {
        try {
            const result = Babel.transform(code, {
                presets: ['react'],
                filename: 'jsx-file.js'
            }).code;
            jsOutput.textContent = result;
            return true;
        } catch (error) {
            showNotification(error.message, 'error');
            return false;
        }
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.className = 'notification';
        }, 3000);
    };

    // Event Listeners
    jsxInput.addEventListener('input', () => {
        transpileJSX(jsxInput.value);
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                jsxInput.value = e.target.result;
                transpileJSX(jsxInput.value);
                showNotification('ファイルを読み込みました 📄');
            };
            reader.readAsText(file);
        }
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            jsxInput.value = text;
            transpileJSX(text);
            showNotification('コードを貼り付けました 📋');
        } catch (err) {
            showNotification('クリップボードからの読み取りに失敗しました', 'error');
        }
    });

    clearBtn.addEventListener('click', () => {
        jsxInput.value = '';
        jsOutput.textContent = '';
        showNotification('入力をクリアしました 🗑️');
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(jsOutput.textContent);
            showNotification('コードをコピーしました 📝');
        } catch (err) {
            showNotification('コピーに失敗しました', 'error');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([jsOutput.textContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transpiled-code.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('ファイルをダウンロードしました 💾');
    });

    helpBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeHelpBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add example code on startup
    const exampleCode = `const App = () => {
  return (
    <div className="container">
      <h1>こんにちは！</h1>
      <p>JSXトランスパイラーへようこそ！</p>
    </div>
  );
};`;
    jsxInput.value = exampleCode;
    transpileJSX(exampleCode);
});