document.addEventListener('DOMContentLoaded', () => {
    // タブ切り替え
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
            
            // タブ切り替えアニメーション
            anime({
                targets: `#${tab.dataset.tab}Tab`,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutCubic'
            });
        });
    });

    // 文字置換フィールドの追加
    const addFieldBtn = document.getElementById('addFieldBtn');
    const replaceFields = document.getElementById('replaceFields');
    let fieldCount = 1;

    addFieldBtn.addEventListener('click', () => {
        if (fieldCount >= 12) {
            showNotification('最大12個までしか追加できません');
            return;
        }

        const field = document.createElement('div');
        field.className = 'replace-field';
        field.innerHTML = `
            <input type="text" placeholder="検索文字" class="search-text">
            <span class="arrow"><i class="fas fa-arrow-right"></i></span>
            <input type="text" placeholder="置換文字" class="replace-text">
            <button class="delete-field icon-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        replaceFields.appendChild(field);
        fieldCount++;

        // フィールド追加アニメーション
        anime({
            targets: field,
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 500,
            easing: 'easeOutCubic'
        });
    });

    // フィールドの削除
    replaceFields.addEventListener('click', (e) => {
        if (e.target.closest('.delete-field')) {
            const field = e.target.closest('.replace-field');
            
            // 削除アニメーション
            anime({
                targets: field,
                opacity: 0,
                translateX: 20,
                duration: 300,
                easing: 'easeOutCubic',
                complete: () => {
                    field.remove();
                    fieldCount--;
                }
            });
        }
    });

    // テキストのコピー
    const copyBtn = document.getElementById('copyBtn');
    const sourceText = document.getElementById('sourceText');

    copyBtn.addEventListener('click', () => {
        sourceText.select();
        document.execCommand('copy');
        showNotification('テキストをコピーしました');
    });

    // 置換の実行
    const replaceBtn = document.getElementById('replaceBtn');
    
    replaceBtn.addEventListener('click', () => {
        let text = sourceText.value;
        const fields = document.querySelectorAll('.replace-field');
        let replacementCount = 0;

        fields.forEach(field => {
            const searchText = field.querySelector('.search-text').value;
            const replaceText = field.querySelector('.replace-text').value;
            
            if (searchText && text.includes(searchText)) {
                const regex = new RegExp(searchText, 'g');
                text = text.replace(regex, replaceText);
                replacementCount++;
            }
        });

        sourceText.value = text;
        showNotification(`${replacementCount}箇所の置換を完了しました`);
    });

    // 文字数カウント
    sourceText.addEventListener('input', updateCounts);

    function updateCounts() {
        const text = sourceText.value;
        
        // 通常の文字数
        document.getElementById('normalCount').textContent = text.length;
        
        // 全角換算文字数
        const fullWidthCount = [...text].reduce((acc, char) => {
            return acc + (char.match(/[^\x01-\x7E\xA1-\xDF]/) ? 2 : 1);
        }, 0);
        document.getElementById('fullWidthCount').textContent = fullWidthCount;
        
        // 空白除外
        document.getElementById('noSpaceCount').textContent = 
            text.replace(/\s/g, '').length;
        
        // 改行除外
        document.getElementById('noLineBreakCount').textContent = 
            text.replace(/\n/g, '').length;
        
        // 空白・改行除外
        document.getElementById('noSpaceLineCount').textContent = 
            text.replace(/[\s\n]/g, '').length;
        
        // 全角換算（空白除外）
        const fullWidthNoSpace = [...text.replace(/\s/g, '')].reduce((acc, char) => {
            return acc + (char.match(/[^\x01-\x7E\xA1-\xDF]/) ? 2 : 1);
        }, 0);
        document.getElementById('fullWidthNoSpaceCount').textContent = fullWidthNoSpace;
        
        // 行数
        document.getElementById('lineCount').textContent = 
            text.split('\n').length;
        
        // 原稿用紙（400字）
        document.getElementById('manuscriptCount').textContent = 
            Math.ceil(fullWidthCount / 400);
        
        // バイト数計算
        const encoder = new TextEncoder();
        document.getElementById('utf8Count').textContent = 
            encoder.encode(text).length;
        
        document.getElementById('utf16Count').textContent = 
            text.length * 2;
        
        // 概算のバイト数（正確な変換は複雑なため簡易計算）
        const sjisCount = [...text].reduce((acc, char) => {
            return acc + (char.match(/[^\x01-\x7E\xA1-\xDF]/) ? 2 : 1);
        }, 0);
        document.getElementById('sjisCount').textContent = sjisCount;
        
        document.getElementById('eucjpCount').textContent = sjisCount;
        document.getElementById('jisCount').textContent = sjisCount;
    }
});

// 通知表示
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    anime({
        targets: notification,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 500,
        easing: 'easeOutCubic'
    });

    setTimeout(() => {
        anime({
            targets: notification,
            opacity: 0,
            translateX: 100,
            duration: 500,
            easing: 'easeOutCubic',
            complete: () => {
                notification.classList.remove('show');
            }
        });
    }, 3000);
}