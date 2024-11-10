let editor;
let currentFile = null;
let tabs = [];

// エディターの初期化
window.onload = function() {
    ace.require("ace/ext/language_tools");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
        useSoftTabs: true,
        tabSize: 2
    });
    
    newFile();
};

// 通知表示
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('.notification-message').textContent = message;
    notification.classList.add('visible');
    setTimeout(() => {
        notification.classList.remove('visible');
    }, 3000);
}

// ファイル操作
function newFile() {
    const fileName = `untitled-${tabs.length + 1}.html`;
    tabs.push({
        name: fileName,
        content: ''
    });
    editor.setValue('');
    currentFile = fileName;
    updateTabs();
    showNotification('新規ファイルを作成しました');
}

function openFile() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        tabs.push({
            name: file.name,
            content: e.target.result
        });
        editor.setValue(e.target.result);
        currentFile = file.name;
        updateTabs();
        showNotification(`${file.name} を開きました`);
    };
    reader.readAsText(file);
});

function saveFile() {
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = currentFile;
    a.click();
    showNotification(`${currentFile} を保存しました`);
}

// タブ管理
function updateTabs() {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.name === currentFile ? 'active' : ''}`;
        tabElement.innerHTML = `
            <span onclick="switchTab('${tab.name}')">${tab.name}</span>
            <span class="tab-close" onclick="closeTab('${tab.name}')">✖️</span>
        `;
        tabsContainer.appendChild(tabElement);
    });
}

function switchTab(fileName) {
    const tab = tabs.find(t => t.name === fileName);
    if (tab) {
        editor.setValue(tab.content);
        currentFile = fileName;
        updateTabs();
    }
}

function closeTab(fileName) {
    const index = tabs.findIndex(t => t.name === fileName);
    if (index > -1) {
        tabs.splice(index, 1);
        if (fileName === currentFile) {
            if (tabs.length > 0) {
                switchTab(tabs[tabs.length - 1].name);
            } else {
                newFile();
            }
        }
        updateTabs();
        showNotification(`${fileName} を閉じました`);
    }
}

// 編集操作
function undo() {
    editor.undo();
    showNotification('操作を元に戻しました');
}

function redo() {
    editor.redo();
    showNotification('操作をやり直しました');
}

function formatCode() {
    try {
        const session = editor.getSession();
        const value = session.getValue();
        const formatted = html_beautify(value, {
            indent_size: 2,
            wrap_line_length: 80
        });
        session.setValue(formatted);
        showNotification('コードを整形しました');
    } catch (e) {
        showNotification('コードの整形に失敗しました');
    }
}

// 検索パネル
function toggleSearch() {
    const searchPanel = document.getElementById('searchPanel');
    searchPanel.classList.toggle('visible');
    if (searchPanel.classList.contains('visible')) {
        document.getElementById('searchInput').focus();
    }
}

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

function replace() {
    const needle = document.getElementById('searchInput').value;
    const replacement = document.getElementById('replaceInput').value;
    editor.replace(replacement);
    showNotification('テキストを置換しました');
}

function replaceAll() {
    const needle = document.getElementById('searchInput').value;
    const replacement = document.getElementById('replaceInput').value;
    editor.replaceAll(replacement);
    showNotification('すべてのテキストを置換しました');
}

// ショートカットキー
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
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
                newFile();
                break;
            case 'f':
                e.preventDefault();
                toggleSearch();
                break;
        }
    }
});