// Ace Editorの初期化と設定
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/ruby");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "14px",
    showPrintMargin: false,
    useSoftTabs: true,
    tabSize: 2
});

// 通知システム
function showNotification(message, emoji = "💡") {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `${emoji} ${message}`;
    document.getElementById("notificationContainer").appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// タブ管理
let tabs = [];
let currentTab = null;

function createTab(name = "無題", content = "") {
    const tab = {
        id: Date.now(),
        name: name,
        content: content
    };
    
    tabs.push(tab);
    renderTabs();
    switchTab(tab.id);
    return tab;
}

function renderTabs() {
    const container = document.getElementById("tabContainer");
    container.innerHTML = tabs.map(tab => `
        <div class="tab ${currentTab === tab.id ? 'active' : ''}" onclick="switchTab(${tab.id})">
            <span>${tab.name}</span>
            <span class="tab-close" onclick="closeTab(${tab.id}, event)">✕</span>
        </div>
    `).join("");
}

function switchTab(id) {
    const tab = tabs.find(t => t.id === id);
    if (tab) {
        if (currentTab) {
            const currentTabData = tabs.find(t => t.id === currentTab);
            if (currentTabData) {
                currentTabData.content = editor.getValue();
            }
        }
        currentTab = id;
        editor.setValue(tab.content, -1);
        renderTabs();
    }
}

function closeTab(id, event) {
    event.stopPropagation();
    const index = tabs.findIndex(t => t.id === id);
    if (index > -1) {
        tabs.splice(index, 1);
        if (currentTab === id) {
            currentTab = tabs[Math.min(index, tabs.length - 1)]?.id;
            if (currentTab) {
                editor.setValue(tabs.find(t => t.id === currentTab).content, -1);
            } else {
                editor.setValue("", -1);
            }
        }
        renderTabs();
    }
}

// ファイル操作
document.getElementById("newFile").addEventListener("click", () => {
    createTab();
    showNotification("新規ファイルを作成しました", "📄");
});

document.getElementById("openFile").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            createTab(file.name, e.target.result);
            showNotification(`${file.name}を開きました`, "📂");
        };
        reader.readAsText(file);
    }
});

document.getElementById("saveFile").addEventListener("click", () => {
    if (!currentTab) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tabs.find(t => t.id === currentTab)?.name || "code.rb";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification("ファイルを保存しました", "💾");
});

// コード整形
document.getElementById("formatCode").addEventListener("click", () => {
    try {
        const content = editor.getValue();
        // 簡易的な整形（実際のプロジェクトではより高度な整形ロジックを実装）
        const formatted = content
            .split("\n")
            .map(line => line.trim())
            .join("\n");
        editor.setValue(formatted, -1);
        showNotification("コードを整形しました", "✨");
    } catch (error) {
        showNotification("整形に失敗しました", "⚠️");
    }
});

// カーソル位置の表示
editor.selection.on("changeCursor", () => {
    const pos = editor.getCursorPosition();
    document.getElementById("cursorPosition").textContent = 
        `行: ${pos.row + 1}, 列: ${pos.column + 1}`;
});

// 初期タブの作成
createTab();