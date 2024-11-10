document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const hiraganaOutput = document.getElementById('hiragana');
    const katakanaOutput = document.getElementById('katakana');
    const pasteBtn = document.getElementById('paste');
    const clearBtn = document.getElementById('clear');
    const notification = document.getElementById('notification');

    // 変換関数
    function convertText(text) {
        // シングルクォートで囲まれた部分を一時的に置き換え
        const preserved = [];
        text = text.replace(/'([^']+)'/g, (match, p1) => {
            preserved.push(p1);
            return `\u0000${preserved.length - 1}\u0000`;
        });

        // ローマ字をかなに変換
        let hiragana = wanakana.toHiragana(text);
        let katakana = wanakana.toKatakana(text);

        // 保存しておいたローマ字を戻す
        preserved.forEach((value, index) => {
            const placeholder = `\u0000${index}\u0000`;
            hiragana = hiragana.replace(placeholder, value);
            katakana = katakana.replace(placeholder, value);
        });

        return { hiragana, katakana };
    }

    // 通知表示関数
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // 入力イベント
    input.addEventListener('input', () => {
        const { hiragana, katakana } = convertText(input.value);
        hiraganaOutput.textContent = hiragana;
        katakanaOutput.textContent = katakana;
    });

    // クリップボード貼り付け
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
            const { hiragana, katakana } = convertText(text);
            hiraganaOutput.textContent = hiragana;
            katakanaOutput.textContent = katakana;
            showNotification('📋 テキストを貼り付けました');
        } catch (err) {
            showNotification('❌ クリップボードの読み取りに失敗しました');
        }
    });

    // クリアボタン
    clearBtn.addEventListener('click', () => {
        input.value = '';
        hiraganaOutput.textContent = '';
        katakanaOutput.textContent = '';
        showNotification('🧹 テキストをクリアしました');
    });

    // コピーボタン
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const target = document.getElementById(btn.dataset.target);
            try {
                await navigator.clipboard.writeText(target.textContent);
                btn.classList.add('copy-success');
                setTimeout(() => btn.classList.remove('copy-success'), 300);
                showNotification('📝 テキストをコピーしました');
            } catch (err) {
                showNotification('❌ コピーに失敗しました');
            }
        });
    });
});