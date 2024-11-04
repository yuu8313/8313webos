let editor;
let currentFile = null;
let tabs = [];
let activeTab = null;

// エディターの初期化
function initEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/typescript");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
    });
}

// 通知を表示
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.querySelector(".notification-message").textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// タブの作成
function createTab(name = "無題.ts") {
    const tab = {
        id: Date.now(),
        name: name,
        content: ""
    };
    tabs.push(tab);
    renderTabs();
    switchTab(tab.id);
    return tab;
}

// タブの描画
function renderTabs() {
    const tabsContainer = document.getElementById("tabs");
    tabsContainer.innerHTML = tabs.map(tab => `
        <div class="tab ${tab.id === activeTab?.id ? 'active' : ''}" 
             onclick="switchTab(${tab.id})">
            ${tab.name}
            <span class="tab-close" onclick="closeTab(${tab.id}, event)">✖️</span>
        </div>
    `).join("");
}

// タブの切り替え
function switchTab(tabId) {
    if (activeTab) {
        activeTab.content = editor.getValue();
    }
    activeTab = tabs.find(tab => tab.id === tabId);
    if (activeTab) {
        editor.setValue(activeTab.content, -1);
        editor.focus();
    }
    renderTabs();
}

// タブを閉じる
function closeTab(tabId, event) {
    event.stopPropagation();
    const index = tabs.findIndex(tab => tab.id === tabId);
    if (index > -1) {
        tabs.splice(index, 1);
        if (activeTab?.id === tabId) {
            activeTab = tabs[Math.max(0, index - 1)] || null;
            if (activeTab) {
                editor.setValue(activeTab.content, -1);
            } else {
                editor.setValue("", -1);
            }
        }
        renderTabs();
    }
}

// 新規ファイル
function newFile() {
    createTab();
    showNotification("新規ファイルを作成しました");
}

// ファイルを開く
function openFile() {
    const input = document.getElementById("fileInput");
    input.click();
}

// ファイル選択時の処理
document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const tab = createTab(file.name);
            tab.content = e.target.result;
            editor.setValue(tab.content, -1);
            showNotification(`${file.name}を開きました`);
        };
        reader.readAsText(file);
    }
});

// ファイルの保存
function saveFile() {
    if (!activeTab) return;
    const content = editor.getValue();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`${activeTab.name}を保存しました`);
}

// 検索パネルの表示切り替え
function toggleSearch() {
    const panel = document.getElementById("searchPanel");
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
    if (panel.style.display === "flex") {
        document.getElementById("searchInput").focus();
    }
}

// 次を検索
function findNext() {
    const needle = document.getElementById("searchInput").value;
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
    const needle = document.getElementById("searchInput").value;
    const replacement = document.getElementById("replaceInput").value;
    editor.replace(replacement);
}

// すべて置換
function replaceAll() {
    const needle = document.getElementById("searchInput").value;
    const replacement = document.getElementById("replaceInput").value;
    editor.replaceAll(replacement);
}

// コードの整形
function formatCode() {
    try {
        const session = editor.getSession();
        const value = session.getValue();
        const formatted = js_beautify(value, {
            indent_size: 2,
            space_in_empty_paren: true
        });
        session.setValue(formatted);
        showNotification("コードを整形しました");
    } catch (e) {
        showNotification("整形に失敗しました");
    }
}

// Undo
function undo() {
    editor.undo();
}

// Redo
function redo() {
    editor.redo();
}

// キーボードショートカット
document.addEventListener("keydown", function(e) {
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

// 初期化
window.onload = function() {
    initEditor();
    createTab();
};