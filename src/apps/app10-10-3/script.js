document.addEventListener('DOMContentLoaded', () => {
    const barcodeText = document.getElementById('barcodeText');
    const barcodeHeight = document.getElementById('barcodeHeight');
    const barcodeColor = document.getElementById('barcodeColor');
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function generateBarcode() {
        try {
            JsBarcode("#barcode", barcodeText.value || " ", {
                format: "CODE128",
                height: parseInt(barcodeHeight.value),
                lineColor: barcodeColor.value,
                margin: 10,
                fontSize: 16,
            });
        } catch (e) {
            showToast('⚠️ バーコードの生成に失敗しました');
        }
    }

    function downloadBarcode() {
        const svg = document.getElementById('barcode');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'barcode.png';
            downloadLink.href = pngFile;
            downloadLink.click();
            
            showToast('✅ バーコードをダウンロードしました');
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    // イベントリスナーの設定
    barcodeText.addEventListener('input', generateBarcode);
    barcodeHeight.addEventListener('input', generateBarcode);
    barcodeColor.addEventListener('input', generateBarcode);
    downloadBtn.addEventListener('click', downloadBarcode);

    // 初期バーコードの生成
    generateBarcode();
});