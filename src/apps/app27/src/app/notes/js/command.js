// Quillエディタのインスタンス
let quillInstance;

// DOMの読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', () => {
    quillInstance = quill;
    initializeSlashCommands();
    console.log('スラッシュコマンドを初期化しました');
});

// スラッシュコマンドの初期化
function initializeSlashCommands() {
    quillInstance.on('text-change', function(delta, oldDelta, source) {
        if (source === 'user') {
            const text = quillInstance.getText();
            const position = quillInstance.getSelection()?.index;
            
            if (position && text[position - 1] === '/') {
                handleSlashCommand(position);
                console.log('スラッシュコマンドのトリガーを検出');
            }
        }
    });
}

// スラッシュコマンドの処理
function handleSlashCommand(position) {
    const commands = {
        '/h1': () => formatText('header', 1),
        '/h2': () => formatText('header', 2),
        '/bold': () => formatText('bold', true),
        '/italic': () => formatText('italic', true),
        '/quote': () => formatText('blockquote', true),
        '/code': () => formatText('code-block', true)
    };

    quillInstance.on('text-change', function textChangeHandler(delta, oldDelta, source) {
        if (source !== 'user') return;

        const currentText = quillInstance.getText().slice(position - 1, quillInstance.getSelection()?.index);
        
        Object.keys(commands).forEach(cmd => {
            if (currentText === cmd) {
                quillInstance.deleteText(position - 1, cmd.length);
                commands[cmd]();
                quillInstance.off('text-change', textChangeHandler);
                console.log(`スラッシュコマンド実行: ${cmd}`);
            }
        });
    });
}

// テキストのフォーマット適用
function formatText(format, value) {
    const range = quillInstance.getSelection();
    if (range) {
        quillInstance.format(format, value);
        showNotification(`${format}スタイルを適用しました`);
        console.log(`フォーマット適用: ${format}`);
    }
}