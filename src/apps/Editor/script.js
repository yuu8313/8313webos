// エディターの初期化
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

// ローカルストレージキー
const STORAGE_KEYS = {
    TABS: "8313_tabs",
    CURRENT_TAB: "8313_current_tab",
    EDITOR_CONTENT: "8313_editor_content",
    EDITOR_SETTINGS: "8313_editor_settings",
    RECENT_FILES: "8313_recent_files"
};

// 通知を表示する関数
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 言語選択の変更を処理
document.getElementById('languageSelect').addEventListener('change', (e) => {
    const mode = `ace/mode/${e.target.value}`;
    editor.session.setMode(mode);
    showNotification(`言語を${e.target.value}に変更しました`);
});

// ファイル操作
document.getElementById('newFile').addEventListener('click', () => {
    editor.setValue('');
    showNotification('ファイルをリセットしました');
});

document.getElementById('openFile').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.css,.js,.ts,.jsx,.tsx,.py,.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            editor.setValue(e.target.result);
            showNotification(`${file.name}を開きました`);
        };
        
        reader.readAsText(file);
    };
    
    input.click();
});

document.getElementById('saveFile').addEventListener('click', () => {
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'code.txt';
    a.click();
    
    window.URL.revokeObjectURL(url);
    showNotification('ファイルを保存しました');
});

// 編集操作
document.getElementById('undo').addEventListener('click', () => {
    editor.undo();
    showNotification('操作を元に戻しました');
});

document.getElementById('redo').addEventListener('click', () => {
    editor.redo();
    showNotification('操作をやり直しました');
});

document.getElementById('search').addEventListener('click', () => {
    editor.execCommand('find');
    showNotification('検索モードを開始しました');
});

// エディターの内容を自動保存
editor.on('change', () => {
    localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT, editor.getValue());
});

// 保存された内容を復元
const savedContent = localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT);
if (savedContent) {
    editor.setValue(savedContent);
}

// アニメーション効果
anime({
    targets: '.editor-container',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutExpo'
});

// エラー表示用マーカーの設定
editor.getSession().on("changeAnnotation", function () {
    const annotations = editor.getSession().getAnnotations();
    const errorAnnotations = annotations.filter(anno => anno.type === "error");
    if (errorAnnotations.length > 0) {
        showNotification("エラーが検出されました");
    }
});

// 自動補完機能の設定
editor.setOptions({
    enableBasicAutocompletion: true, // 基本補完
    enableSnippets: true,           // スニペット補完
    enableLiveAutocompletion: true  // リアルタイム補完
});

// キーバインドで補完を起動（Ctrl + Space）
editor.commands.addCommand({
    name: "showAutocomplete",
    bindKey: { win: "Ctrl-Space", mac: "Ctrl-Space" },
    exec: function (editor) {
        editor.execCommand("startAutocomplete");
    }
});
document.getElementById("beautify").addEventListener("click", () => {
    const beautify = ace.require("ace/ext/beautify");
    beautify.beautify(editor.session);
    showNotification("コードを整形しました");
});
const ThemeList = ace.require("ace/ext/themelist");
const themeSelect = document.getElementById("themeSelect");

ThemeList.themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.name;
    option.textContent = theme.caption;
    themeSelect.appendChild(option);
});

themeSelect.addEventListener("change", (e) => {
    editor.setTheme(`ace/theme/${e.target.value}`);
    showNotification(`テーマを ${e.target.value} に変更しました`);
});

editor.commands.addCommand({
    name: "showSettingsMenu",
    bindKey: { win: "Ctrl-,", mac: "Command-," },
    exec: function (editor) {
        editor.showSettingsMenu();
    }
});
