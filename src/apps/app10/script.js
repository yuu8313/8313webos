document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const container = document.querySelector('.container');
    const generateBtn = document.getElementById('generate');
    const regenerateBtn = document.getElementById('regenerate');
    const downloadBtn = document.getElementById('download');
    const loading = document.getElementById('loading');
    const qrcodeDiv = document.getElementById('qrcode');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.querySelector('.size-value');
    let qrcode = null;

    // サイズ表示の更新
    sizeInput.addEventListener('input', () => {
        sizeValue.textContent = `${sizeInput.value} x ${sizeInput.value}`;
    });

    // 通知を表示する関数
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        notification.querySelector('.notification-text').textContent = message;
        notification.style.backgroundColor = isError ? 'var(--error)' : 'var(--success)';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // QRコード生成関数
    function generateQRCode() {
        const text = document.getElementById('text').value;
        const size = parseInt(document.getElementById('size').value);
        const errorLevel = document.getElementById('errorLevel').value;
        const foreground = document.getElementById('foreground').value;
        const background = document.getElementById('background').value;

        if (!text) {
            showNotification('テキストを入力してください！', true);
            return;
        }

        // 既存のQRコードをクリア
        qrcodeDiv.innerHTML = '';
        loading.style.display = 'flex';
        qrcodeDiv.style.display = 'none';
        downloadBtn.style.display = 'none';

        // 生成中のアニメーションを表示
        setTimeout(() => {
            // QRコード生成
            qrcode = new QRCode(qrcodeDiv, {
                text: text,
                width: size,
                height: size,
                colorDark: foreground,
                colorLight: background,
                correctLevel: QRCode.CorrectLevel[errorLevel]
            });

            loading.style.display = 'none';
            qrcodeDiv.style.display = 'inline-block';
            downloadBtn.style.display = 'block';
            
            // 結果セクションまでスクロール
            const resultSection = document.getElementById('resultSection');
            resultSection.scrollIntoView({ behavior: 'smooth' });

            showNotification('QRコードを生成しました！');
        }, 10);
    }

    // ダウンロード機能
    function downloadQRCode() {
        const img = qrcodeDiv.querySelector('img');
        if (!img) return;

        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = img.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('QRコードをダウンロードしました！');
    }

    // イベントリスナーの設定
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    regenerateBtn.addEventListener('click', () => {
        const generatorSection = document.getElementById('generatorSection');
        generatorSection.scrollIntoView({ behavior: 'smooth' });
    });

    // スクロール制御（手動スクロール防止）
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // 初期表示時に生成画面までスクロール
    const generatorSection = document.getElementById('generatorSection');
    generatorSection.scrollIntoView({ behavior: 'smooth' });
});