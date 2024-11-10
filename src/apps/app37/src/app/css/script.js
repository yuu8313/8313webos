let editor;
let currentFile = null;
let tabs = [];
let activeTab = null;

// エディターの初期化
function initEditor() {
    ace.require("ace/ext/language_tools");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/css");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
        useSoftTabs: true,
        tabSize: 2
        
    });

    // 初期タブを作成
    newFile();
}

// 通知を表示
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageEl = notification.querySelector('.notification-message');
    messageEl.textContent = message;
    
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// タブの作成
function createTab(name = 'untitled.css') {
    const tab = {
        id: Date.now(),
        name: name,
        content: ''
    };
    
    tabs.push(tab);
    renderTabs();
    switchTab(tab.id);
    return tab;
}

// タブの描画
function renderTabs() {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === activeTab?.id ? 'active' : ''}`;
        tabEl.innerHTML = `
            <span>${tab.name}</span>
            <span class="tab-close" onclick="closeTab(${tab.id})">×</span>
        `;
        tabEl.onclick = (e) => {
            if (!e.target.classList.contains('tab-close')) {
                switchTab(tab.id);
            }
        };
        tabsContainer.appendChild(tabEl);
    });
}

// タブの切り替え
function switchTab(id) {
    if (activeTab) {
        activeTab.content = editor.getValue();
    }
    
    activeTab = tabs.find(tab => tab.id === id);
    if (activeTab) {
        editor.setValue(activeTab.content, -1);
        editor.focus();
        renderTabs();
    }
}

// タブを閉じる
function closeTab(id) {
    const index = tabs.findIndex(tab => tab.id === id);
    if (index === -1) return;
    
    tabs.splice(index, 1);
    
    if (activeTab?.id === id) {
        activeTab = tabs[Math.max(0, index - 1)];
        if (activeTab) {
            switchTab(activeTab.id);
        } else {
            newFile();
        }
    } else {
        renderTabs();
    }
}

// 新規ファイル
function newFile() {
    createTab();
    showNotification('新規ファイルを作成しました 📄');
}

// ファイルを開く
function openFile() {
    const input = document.getElementById('fileInput');
    input.click();
    
    input.onchange = function() {
        const file = this.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const tab = createTab(file.name);
            tab.content = e.target.result;
            editor.setValue(tab.content, -1);
            showNotification(`${file.name} を開きました 📂`);
        };
        reader.readAsText(file);
        input.value = '';
    };
}

// ファイルの保存
function saveFile() {
    if (!activeTab) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('ファイルを保存しました 💾');
}

// 元に戻す
function undo() {
    editor.undo();
    showNotification('操作を元に戻しました ↩️');
}

// やり直し
function redo() {
    editor.redo();
    showNotification('操作をやり直しました ↪️');
}

// コードの整形
function formatCode() {
    try {
        const content = editor.getValue();
        const formatted = content
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, ' {\n    ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/;\s*/g, ';\n    ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        
        editor.setValue(formatted, -1);
        showNotification('コードを整形しました 🎨');
    } catch (error) {
        showNotification('コードの整形に失敗しました ⚠️', 'error');
    }
}

// 検索パネルの表示切り替え
function toggleSearch() {
    const panel = document.getElementById('searchPanel');
    panel.classList.toggle('visible');
    if (panel.classList.contains('visible')) {
        document.getElementById('searchInput').focus();
    }
}

// 次を検索
function findNext() {
    const needle = document.getElementById('searchInput').value;
    editor.find(needle, {
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    });
}

// 置換
function replace() {
    const needle = document.getElementById('searchInput').value;
    const replacement = document.getElementById('replaceInput').value;
    editor.replace(replacement, {
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    });
}

// すべて置換
function replaceAll() {
    const needle = document.getElementById('searchInput').value;
    const replacement = document.getElementById('replaceInput').value;
    editor.replaceAll(replacement, {
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    });
}

// 通知を閉じる
document.querySelector('.notification-close').onclick = function() {
    document.getElementById('notification').className = 'notification';
};

// エディターの初期化
document.addEventListener('DOMContentLoaded', initEditor);