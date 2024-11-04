/*<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>フォルダー階層構造メモ作成機 📁</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="glass-card">
            <h1>フォルダー階層構造メモ作成機 📁</h1>
            
            <div class="drop-zone" id="dropZone">
                <div class="drop-content">
                    <p>📂 ファイルをドラッグ＆ドロップ</p>
                    <p>または</p>
                    <input type="file" id="folderInput" webkitdirectory directory multiple class="hidden">
                    <button onclick="document.getElementById('folderInput').click()" class="btn">
                        フォルダーを選択 📁
                    </button>
                </div>
            </div>

            <div class="preview-area">
                <h2>プレビュー 👀</h2>
                <pre id="treePreview" class="tree-preview"></pre>
            </div>

            <div class="action-buttons">
                <button onclick="downloadAsTxt()" class="btn">
                    📥 ダウンロード
                </button>
                <button onclick="copyToClipboard()" class="btn">
                    📋 コピー
                </button>
                <button onclick="resetTree()" class="btn danger">
                    🗑️ リセット
                </button>
            </div>
        </div>
    </div>

    <div id="notification" class="notification"></div>
    
    <script src="script.js"></script>
</body>
</html>*/
/*:root {
    --bg-color: #1a1a2e;
    --card-bg: #16213e;
    --accent: #0f3460;
    --highlight: #e94560;
    --text: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.glass-card {
    background: rgba(22, 33, 62, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
}

h2 {
    margin-bottom: 15px;
    font-size: 1.4rem;
}

.drop-zone {
    border: 2px dashed var(--accent);
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    margin-bottom: 30px;
}

.drop-zone.drag-over {
    background: rgba(15, 52, 96, 0.5);
    border-color: var(--highlight);
}

.drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.btn {
    background: var(--accent);
    color: var(--text);
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.btn:hover {
    background: var(--highlight);
    transform: translateY(-2px);
}

.btn.danger {
    background: var(--highlight);
}

.btn.danger:hover {
    background: #c13850;
}

.preview-area {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    max-height: 400px;
    overflow-y: auto;
}

.tree-preview {
    font-family: monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #fff;
    line-height: 1.5;
}

.action-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.hidden {
    display: none;
}

.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    background: var(--accent);
    color: var(--text);
    border-radius: 8px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateY(0);
}

@media (max-width: 600px) {
    .container {
        padding: 10px;
    }
    
    .glass-card {
        padding: 20px;
    }
    
    h1 {
        font-size: 1.5rem;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 10px;
    }
}*/




let treeStructure = '';

// ローカルストレージから読み込み
const savedTree = localStorage.getItem('8313memo-tree');
if (savedTree) {
    treeStructure = savedTree;
    document.getElementById('treePreview').textContent = treeStructure;
}

// ドラッグ&ドロップ処理
const dropZone = document.getElementById('dropZone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('drag-over');
}

function unhighlight(e) {
    dropZone.classList.remove('drag-over');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// ファイル選択処理
document.getElementById('folderInput').addEventListener('change', function(e) {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const paths = Array.from(files).map(file => file.webkitRelativePath || file.name);
    generateTree(paths);
}

function generateTree(paths) {
    const tree = {};
    paths.forEach(path => {
        const parts = path.split('/');
        let current = tree;
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1; // 最後の要素がファイルかどうか
            if (!current[part]) {
                current[part] = isFile ? null : {}; // ファイルならnull、フォルダなら空オブジェクト
            }
            current = current[part];
        });
    });
    
    treeStructure = convertToString(tree);
    document.getElementById('treePreview').textContent = treeStructure;
    localStorage.setItem('8313memo-tree', treeStructure);
    showNotification('✨ ツリー構造を生成しました');
}

function convertToString(tree, prefix = '') {
    let result = '';
    const entries = Object.entries(tree);
    entries.forEach(([key, value], index) => {
        const isLast = index === entries.length - 1;
        const connector = isLast ? '└─ ' : '├─ ';
        const icon = value === null ? '📄' : '📁'; // ファイルなら📄、フォルダーなら📁
        result += prefix + connector + key + ' ' + icon + '\n'; // アイコンを名前の後ろに追加
        if (value !== null) { // サブフォルダがあれば再帰的に処理
            result += convertToString(value, prefix + (isLast ? '    ' : '│   '));
        }
    });
    return result;
}



function downloadAsTxt() {
    if (!treeStructure) {
        showNotification('⚠️ ダウンロードするデータがありません');
        return;
    }
    
    const blob = new Blob([treeStructure], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'folder-structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showNotification('💾 ファイルをダウンロードしました');
}

function copyToClipboard() {
    if (!treeStructure) {
        showNotification('⚠️ コピーするデータがありません');
        return;
    }
    
    navigator.clipboard.writeText(treeStructure).then(() => {
        showNotification('📋 クリップボードにコピーしました');
    });
}

function resetTree() {
    treeStructure = '';
    document.getElementById('treePreview').textContent = '';
    localStorage.removeItem('8313memo-tree');
    showNotification('🗑️ リセットしました');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}