// エディターの初期化
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/csharp");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "14px",
    showPrintMargin: false,
    useSoftTabs: true,
    tabSize: 4
});

// 通知システム
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => container.removeChild(notification), 300);
    }, 3000);
}

// タブ管理
let tabs = [];
let currentTab = null;

function createTab(name = '無題', content = '') {
    const tab = {
        id: Date.now(),
        name,
        content,
        isModified: false
    };
    
    tabs.push(tab);
    renderTabs();
    switchToTab(tab.id);
    return tab;
}

function renderTabs() {
    const container = document.getElementById('tabContainer');
    container.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('button');
        tabElement.className = `tab ${currentTab === tab.id ? 'active' : ''}`;
        tabElement.innerHTML = `
            ${tab.name} ${tab.isModified ? '●' : ''}
            <span class="close-tab" onclick="closeTab(${tab.id})">✕</span>
        `;
        tabElement.onclick = (e) => {
            if (!e.target.classList.contains('close-tab')) {
                switchToTab(tab.id);
            }
        };
        container.appendChild(tabElement);
    });
}

function switchToTab(id) {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    
    if (currentTab !== null) {
        const currentTabData = tabs.find(t => t.id === currentTab);
        if (currentTabData) {
            currentTabData.content = editor.getValue();
        }
    }
    
    currentTab = id;
    editor.setValue(tab.content, -1);
    renderTabs();
}

function closeTab(id) {
    const index = tabs.findIndex(t => t.id === id);
    if (index === -1) return;
    
    if (tabs[index].isModified) {
        if (!confirm('変更を保存せずに閉じますか？')) {
            return;
        }
    }
    
    tabs.splice(index, 1);
    
    if (currentTab === id) {
        currentTab = tabs.length > 0 ? tabs[tabs.length - 1].id : null;
        if (currentTab !== null) {
            editor.setValue(tabs[tabs.length - 1].content, -1);
        } else {
            editor.setValue('', -1);
        }
    }
    
    renderTabs();
}

// ファイル操作
document.getElementById('newFile').onclick = () => {
    createTab();
    showNotification('新規ファイルを作成しました', 'success');
};

document.getElementById('openFile').onclick = () => {
    document.getElementById('fileInput').click();
};

document.getElementById('fileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        createTab(file.name, e.target.result);
        showNotification(`${file.name} を開きました`, 'success');
    };
    reader.readAsText(file);
};

document.getElementById('saveFile').onclick = () => {
    if (currentTab === null) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tabs.find(t => t.id === currentTab)?.name || 'untitled.cs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('ファイルを保存しました', 'success');
};

// テーマ切り替え
let isDarkTheme = true;
document.getElementById('themeToggle').onclick = () => {
    isDarkTheme = !isDarkTheme;
    document.getElementById('themeToggle').textContent = isDarkTheme ? '🌙' : '☀️';
    editor.setTheme(isDarkTheme ? 'ace/theme/monokai' : 'ace/theme/chrome');
    showNotification(`${isDarkTheme ? 'ダーク' : 'ライト'}テーマに切り替えました`);
};

// カーソル位置の表示
editor.selection.on('changeCursor', () => {
    const pos = editor.getCursorPosition();
    document.getElementById('cursorPosition').textContent = 
        `行: ${pos.row + 1}, 列: ${pos.column + 1}`;
});

// 初期タブの作成
createTab();

// コード整形
document.getElementById('formatCode').onclick = () => {
    try {
        const session = editor.getSession();
        const beautify = ace.require("ace/ext/beautify");
        beautify.beautify(session);
        showNotification('コードを整形しました', 'success');
    } catch (error) {
        showNotification('コードの整形に失敗しました', 'error');
    }
};

// 検索機能


// ショートカットキー
editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: () => document.getElementById('saveFile').click()
});

editor.commands.addCommand({
    name: 'new',
    bindKey: {win: 'Ctrl-N', mac: 'Command-N'},
    exec: () => document.getElementById('newFile').click()
});

// 変更検知
editor.on('change', () => {
    if (currentTab === null) return;
    
    const tab = tabs.find(t => t.id === currentTab);
    if (!tab) return;
    
    if (!tab.isModified) {
        tab.isModified = true;
        renderTabs();
    }
});