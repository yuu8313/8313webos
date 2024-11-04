let editor;
let currentFile = null;
let tabs = [];
let currentTab = null;

// エディターの初期化
function initEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
    });

    // 初期タブを作成
    createNewTab("untitled.js", "");
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
function createNewTab(filename, content) {
    const tab = {
        id: Date.now(),
        filename: filename,
        content: content
    };
    
    tabs.push(tab);
    
    const tabElement = document.createElement("div");
    tabElement.className = "tab";
    tabElement.setAttribute("data-tab-id", tab.id);
    tabElement.innerHTML = `
        <span>${filename}</span>
        <span class="tab-close" onclick="closeTab(${tab.id})">✖️</span>
    `;
    
    document.getElementById("tabs").appendChild(tabElement);
    switchTab(tab.id);
}

// タブの切り替え
function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelector(`[data-tab-id="${tabId}"]`).classList.add("active");
    
    currentTab = tab;
    editor.setValue(tab.content, -1);
    editor.focus();
}

// タブを閉じる
function closeTab(tabId) {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    tabs.splice(tabIndex, 1);
    document.querySelector(`[data-tab-id="${tabId}"]`).remove();

    if (tabs.length === 0) {
        createNewTab("untitled.js", "");
    } else if (currentTab.id === tabId) {
        switchTab(tabs[tabs.length - 1].id);
    }
}

// 新規ファイル
function newFile() {
    createNewTab("untitled.js", "");
    showNotification("新規ファイルを作成しました");
}

// ファイルを開く
function openFile() {
    const input = document.getElementById("fileInput");
    input.click();
    
    input.onchange = function() {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            createNewTab(file.name, e.target.result);
            showNotification(`${file.name} を開きました`);
        };
        reader.readAsText(file);
        input.value = "";
    };
}

// ファイルの保存
function saveFile() {
    if (!currentTab) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = currentTab.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${currentTab.filename} を保存しました`);
}

// 元に戻す
function undo() {
    editor.undo();
    showNotification("操作を元に戻しました");
}

// やり直し
function redo() {
    editor.redo();
    showNotification("操作をやり直しました");
}

// コードの整形
function formatCode() {
    try {
        const session = editor.getSession();
        const value = session.getValue();
        const formatted = js_beautify(value);
        session.setValue(formatted);
        showNotification("コードを整形しました");
    } catch (e) {
        showNotification("コードの整形に失敗しました");
    }
}

// 検索パネルの表示/非表示
function toggleSearch() {
    const panel = document.getElementById("searchPanel");
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
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

// ショートカットキーの設定
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

// エディターの初期化
document.addEventListener("DOMContentLoaded", initEditor);