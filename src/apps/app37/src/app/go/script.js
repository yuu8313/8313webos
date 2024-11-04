// エディターの初期化
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/golang");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "14px",
    showPrintMargin: false,
    useSoftTabs: true,
    tabSize: 4
});

// 現在のタブ管理
let tabs = [];
let currentTab = null;

// 通知システム
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notificationContainer');
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// タブ管理
function createTab(name = '無題') {
    const tab = {
        id: Date.now(),
        name: name,
        content: editor.getValue()
    };
    
    tabs.push(tab);
    renderTabs();
    switchTab(tab.id);
}

function renderTabs() {
    const container = document.getElementById('tabContainer');
    container.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${currentTab === tab.id ? 'active' : ''}`;
        tabElement.innerHTML = `
            <span>${tab.name}</span>
            <span class="close-tab" onclick="closeTab(${tab.id})">×</span>
        `;
        tabElement.onclick = (e) => {
            if (!e.target.classList.contains('close-tab')) {
                switchTab(tab.id);
            }
        };
        container.appendChild(tabElement);
    });
}

function switchTab(id) {
    if (currentTab) {
        const currentTabData = tabs.find(t => t.id === currentTab);
        if (currentTabData) {
            currentTabData.content = editor.getValue();
        }
    }
    
    currentTab = id;
    const tab = tabs.find(t => t.id === id);
    if (tab) {
        editor.setValue(tab.content, -1);
        renderTabs();
    }
}

function closeTab(id) {
    const index = tabs.findIndex(t => t.id === id);
    if (index > -1) {
        tabs.splice(index, 1);
        if (currentTab === id) {
            currentTab = tabs.length > 0 ? tabs[tabs.length - 1].id : null;
            if (currentTab) {
                switchTab(currentTab);
            } else {
                editor.setValue('');
            }
        }
        renderTabs();
    }
}

// ファイル操作
document.getElementById('newFile').onclick = () => {
    createTab();
    showNotification('新規ファイルを作成しました');
};

document.getElementById('openFile').onclick = () => {
    document.getElementById('fileInput').click();
};

document.getElementById('fileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            createTab(file.name);
            editor.setValue(e.target.result, -1);
            showNotification(`${file.name}を開きました`);
        };
        reader.readAsText(file);
    }
};

document.getElementById('saveFile').onclick = () => {
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentTab ? tabs.find(t => t.id === currentTab)?.name || 'untitled.go' : 'untitled.go';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('ファイルを保存しました');
};

// コード整形
document.getElementById('formatCode').onclick = () => {
    try {
        const content = editor.getValue();
        // 簡易的な整形（実際のプロジェクトではより高度な整形ロジックを実装）
        const formatted = content
            .split('\n')
            .map(line => line.trim())
            .join('\n');
        editor.setValue(formatted, -1);
        showNotification('コードを整形しました');
    } catch (error) {
        showNotification('整形に失敗しました', 'error');
    }
};

// カーソル位置の更新
editor.selection.on('changeCursor', () => {
    const pos = editor.getCursorPosition();
    document.getElementById('cursorPosition').textContent = 
        `行: ${pos.row + 1}, 列: ${pos.column + 1}`;
});

// テーマ切り替え
let isDarkMode = true;
document.getElementById('themeToggle').onclick = () => {
    isDarkMode = !isDarkMode;
    editor.setTheme(isDarkMode ? "ace/theme/monokai" : "ace/theme/chrome");
    document.getElementById('themeToggle').textContent = isDarkMode ? '🌙' : '☀️';
    showNotification(`${isDarkMode ? 'ダーク' : 'ライト'}モードに切り替えました`);
};

// 初期タブの作成
createTab();