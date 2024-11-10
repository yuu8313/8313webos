let editor;
let currentTab = null;
const tabs = new Map();

// エディターの初期化
function initEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
    });

    // カーソル位置の監視
    editor.selection.on('changeCursor', () => {
        const pos = editor.selection.getCursor();
        document.getElementById('cursorPosition').textContent = 
            `行: ${pos.row + 1}, 列: ${pos.column + 1}`;
    });
}

// 通知を表示する関数
function showNotification(message, emoji = '✨') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `${emoji} ${message}`;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 新規タブを作成
function createTab(name = 'untitled.py', content = '') {
    const tabContainer = document.getElementById('tabContainer');
    const tabId = 'tab-' + Date.now();
    
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerHTML = `
        <span>${name}</span>
        <span class="tab-close">✕</span>
    `;
    
    tab.querySelector('.tab-close').onclick = (e) => {
        e.stopPropagation();
        closeTab(tabId);
    };
    
    tab.onclick = () => switchTab(tabId);
    tabContainer.appendChild(tab);
    
    tabs.set(tabId, {
        element: tab,
        name: name,
        content: content
    });
    
    switchTab(tabId);
    showNotification('新しいタブを作成しました', '📄');
}

// タブを切り替え
function switchTab(tabId) {
    if (currentTab) {
        tabs.get(currentTab).element.classList.remove('active');
        tabs.get(currentTab).content = editor.getValue();
    }
    
    currentTab = tabId;
    tabs.get(tabId).element.classList.add('active');
    editor.setValue(tabs.get(tabId).content, -1);
}

// タブを閉じる
function closeTab(tabId) {
    const tab = tabs.get(tabId);
    tab.element.remove();
    tabs.delete(tabId);
    
    if (currentTab === tabId) {
        const remainingTabs = Array.from(tabs.keys());
        if (remainingTabs.length > 0) {
            switchTab(remainingTabs[0]);
        } else {
            editor.setValue('');
            currentTab = null;
        }
    }
    
    showNotification('タブを閉じました', '🗑️');
}

// ファイルを開く
function openFile() {
    document.getElementById('fileInput').click();
}

// ファイルを保存
function saveFile() {
    if (!currentTab) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tabs.get(currentTab).name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('ファイルを保存しました', '💾');
}

// コードを整形
function formatCode() {
    try {
        const content = editor.getValue();
        // 簡単な整形（インデントの調整など）
        const formatted = content.split('\n').map(line => line.trim()).join('\n');
        editor.setValue(formatted, -1);
        showNotification('コードを整形しました', '✨');
    } catch (error) {
        showNotification('整形に失敗しました', '❌');
    }
}

// テーマの切り替え
function toggleTheme() {
    const button = document.getElementById('themeToggle');
    if (button.textContent === '🌙') {
        editor.setTheme("ace/theme/dawn");
        button.textContent = '☀️';
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
        document.documentElement.style.setProperty('--text-primary', '#000000');
    } else {
        editor.setTheme("ace/theme/monokai");
        button.textContent = '🌙';
        document.documentElement.style.setProperty('--bg-primary', '#1a1a1a');
        document.documentElement.style.setProperty('--bg-secondary', '#252525');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
    }
    showNotification('テーマを切り替えました', '🎨');
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    createTab(); // 初期タブを作成
    
    document.getElementById('newFile').onclick = () => createTab();
    document.getElementById('openFile').onclick = openFile;
    document.getElementById('saveFile').onclick = saveFile;
    document.getElementById('formatCode').onclick = formatCode;
    document.getElementById('themeToggle').onclick = toggleTheme;
    
    document.getElementById('fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            createTab(file.name, e.target.result);
        };
        reader.readAsText(file);
    };
});

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                saveFile();
                break;
            case 'o':
                e.preventDefault();
                openFile();
                break;
            case 'n':
                e.preventDefault();
                createTab();
                break;
        }
    }
});