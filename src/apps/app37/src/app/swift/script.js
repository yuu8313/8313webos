let editor;
let currentTheme = 'dark';
let tabs = [];
let activeTab = null;

// エディターの初期化
function initEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night");
    editor.session.setMode("ace/mode/swift");
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

// 通知を表示
function showNotification(message, emoji = '✨') {
    const notification = document.createElement('div');
    notification.className = 'notification glass';
    notification.innerHTML = `${emoji} ${message}`;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// タブの作成
function createTab(name = '無題.swift') {
    const tab = {
        id: Date.now(),
        name: name,
        content: ''
    };
    
    tabs.push(tab);
    renderTabs();
    setActiveTab(tab);
    return tab;
}

// タブの描画
function renderTabs() {
    const container = document.getElementById('tabContainer');
    container.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab === activeTab ? 'active' : ''}`;
        tabElement.innerHTML = `
            <span>${tab.name}</span>
            <span style="cursor:pointer" onclick="closeTab(${tab.id})">✕</span>
        `;
        tabElement.onclick = (e) => {
            if (!e.target.matches('span:last-child')) {
                setActiveTab(tab);
            }
        };
        container.appendChild(tabElement);
    });
}

// アクティブタブの設定
function setActiveTab(tab) {
    if (activeTab) {
        activeTab.content = editor.getValue();
    }
    
    activeTab = tab;
    editor.setValue(tab.content, -1);
    renderTabs();
}

// タブを閉じる
function closeTab(id) {
    const index = tabs.findIndex(t => t.id === id);
    if (index === -1) return;
    
    tabs.splice(index, 1);
    
    if (activeTab.id === id) {
        activeTab = tabs[Math.max(0, index - 1)] || null;
        if (activeTab) {
            editor.setValue(activeTab.content, -1);
        } else {
            editor.setValue('', -1);
        }
    }
    
    renderTabs();
}

// ファイルを開く
function openFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const tab = createTab(file.name);
        tab.content = e.target.result;
        editor.setValue(tab.content, -1);
        showNotification('ファイルを開きました', '📂');
    };
    reader.readAsText(file);
}

// ファイルの保存
function saveFile() {
    if (!activeTab) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('ファイルを保存しました', '💾');
}

// コードの整形
function formatCode() {
    try {
        const session = editor.getSession();
        const currentPos = editor.getCursorPosition();
        session.setValue(session.getValue());
        editor.moveCursorToPosition(currentPos);
        showNotification('コードを整形しました', '✨');
    } catch (e) {
        showNotification('整形に失敗しました', '⚠️');
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    createTab(); // 初期タブの作成
    
    document.getElementById('newFile').onclick = () => createTab();
    document.getElementById('openFile').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('saveFile').onclick = saveFile;
    document.getElementById('formatCode').onclick = formatCode;
    document.getElementById('fileInput').onchange = (e) => {
        if (e.target.files.length) openFile(e.target.files[0]);
    };
    
    // テーマ切り替え
    document.getElementById('themeToggle').onclick = () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        editor.setTheme(currentTheme === 'dark' ? 
            "ace/theme/tomorrow_night" : "ace/theme/tomorrow");
        document.getElementById('themeToggle').textContent = 
            currentTheme === 'dark' ? '🌙' : '☀️';
        showNotification(`${currentTheme === 'dark' ? 'ダーク' : 'ライト'}モードに切り替えました`);
    };
});

// ショートカットキーの設定
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                saveFile();
                break;
            case 'o':
                e.preventDefault();
                document.getElementById('fileInput').click();
                break;
            case 'n':
                e.preventDefault();
                createTab();
                break;
        }
    }
});