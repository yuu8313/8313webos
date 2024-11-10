document.addEventListener('DOMContentLoaded', () => {
    // Ace Editorの初期化
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/java");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false,
        highlightActiveLine: true,
    });

    // タブ管理
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

    // タブ作成
    function createTab(name = '無題', content = '') {
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

    // タブ描画
    function renderTabs() {
        const container = document.getElementById('tabContainer');
        container.innerHTML = '';
        
        tabs.forEach(tab => {
            const tabElement = document.createElement('button');
            tabElement.className = `tab ${currentTab === tab.id ? 'active' : ''}`;
            tabElement.innerHTML = `
                <span>${tab.name}</span>
                <span class="tab-close">✕</span>
            `;
            
            tabElement.onclick = (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    switchTab(tab.id);
                }
            };
            
            tabElement.querySelector('.tab-close').onclick = (e) => {
                e.stopPropagation();
                closeTab(tab.id);
            };
            
            container.appendChild(tabElement);
        });
    }

    // タブ切り替え
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
            editor.focus();
        }
        
        renderTabs();
    }

    // タブを閉じる
    function closeTab(id) {
        const index = tabs.findIndex(t => t.id === id);
        if (index !== -1) {
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

    // 新規ファイル
    document.getElementById('newFile').onclick = () => {
        createTab();
        showNotification('新規ファイルを作成しました');
    };

    // ファイルを開く
    document.getElementById('openFile').onclick = () => {
        document.getElementById('fileInput').click();
    };

    document.getElementById('fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                createTab(file.name, e.target.result);
                showNotification(`${file.name}を開きました`);
            };
            reader.readAsText(file);
        }
    };

    // ファイル保存
    document.getElementById('saveFile').onclick = () => {
        const content = editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tabs.find(t => t.id === currentTab)?.name || 'untitled.java';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('ファイルを保存しました');
    };

    // コード整形
    document.getElementById('formatCode').onclick = () => {
        try {
            const session = editor.getSession();
            session.setValue(js_beautify(session.getValue(), {
                indent_size: 4,
                space_in_empty_paren: true
            }));
            showNotification('コードを整形しました');
        } catch (error) {
            showNotification('整形に失敗しました', 'error');
        }
    };

    // テーマ切り替え
    document.getElementById('themeToggle').onclick = () => {
        const currentTheme = editor.getTheme();
        if (currentTheme.includes('monokai')) {
            editor.setTheme('ace/theme/tomorrow');
            document.getElementById('themeToggle').textContent = '🌞';
        } else {
            editor.setTheme('ace/theme/monokai');
            document.getElementById('themeToggle').textContent = '🌙';
        }
    };

    // カーソル位置の表示更新
    editor.selection.on('changeCursor', () => {
        const pos = editor.getCursorPosition();
        document.getElementById('cursorPosition').textContent = 
            `行: ${pos.row + 1}, 列: ${pos.column + 1}`;
    });

    // 初期タブ作成
    createTab();
});