// PDF.js の設定
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// グローバル変数
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;

// DOM要素
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const pdfContainer = document.getElementById('pdfContainer');
const canvas = document.getElementById('pdfViewer');
const ctx = canvas.getContext('2d');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const mainContent = document.getElementById('mainContent');

// 通知システム
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    messageElement.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 通知を閉じるボタンの設定
document.querySelector('.notification-close').addEventListener('click', () => {
    document.getElementById('notification').classList.remove('show');
});

// サイドバーの切り替え
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
    
    // トグルボタンのアニメーション
    gsap.to(toggleSidebarBtn, {
        left: sidebar.classList.contains('open') ? '320px' : '0px',
        duration: 0.3,
        ease: 'power2.out'
    });
});

// PDFのレンダリング
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            pageRendering = false;
            
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });

        document.getElementById('pageInfo').textContent = `${num} / ${pdfDoc.numPages}`;
    });
}

// ページ移動
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// 前のページへ
document.getElementById('prevPage').addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
});

// 次のページへ
document.getElementById('nextPage').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
});

// ズーム機能のイベント
document.getElementById('zoomIn').addEventListener('click', () => {
    scale = Math.min(scale * 1.2, 3); // 最大倍率を3に設定
    updateZoomLevel();
    queueRenderPage(pageNum);
});

document.getElementById('zoomOut').addEventListener('click', () => {
    scale = Math.max(scale / 1.2, 0.5); // 最小倍率を0.5に設定
    updateZoomLevel();
    queueRenderPage(pageNum);
});

// ズームレベル表示更新関数
function updateZoomLevel() {
    document.getElementById('zoomLevel').textContent = `${Math.round(scale * 100)}%`;
}


// PDFの読み込み
function loadPDF(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);
        
        pdfjsLib.getDocument(typedarray).promise.then((pdf) => {
            pdfDoc = pdf;
            dropZone.style.display = 'none';
            pdfContainer.style.display = 'flex';
            renderPage(pageNum);
            showNotification('PDFを読み込みました 📄');
            generateThumbnails();
        }).catch(error => {
            showNotification('PDFの読み込みに失敗しました ❌');
            console.error('Error loading PDF:', error);
        });
    };
    
    reader.readAsArrayBuffer(file);
}

// サムネイル生成
function generateThumbnails() {
    const container = document.querySelector('.thumbnail-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        pdfDoc.getPage(i).then(page => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 0.2 });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.classList.add('thumbnail');
            canvas.dataset.page = i;
            
            page.render({
                canvasContext: context,
                viewport: viewport
            });
            
            canvas.addEventListener('click', () => {
                pageNum = i;
                queueRenderPage(pageNum);
            });
            
            container.appendChild(canvas);
        });
    }
}

canvas.addEventListener('click', () => {
    pageNum = i;
    queueRenderPage(pageNum);
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    canvas.classList.add('active');
});


// ドラッグ&ドロップ処理
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        loadPDF(file);
    } else {
        showNotification('PDFファイルのみ対応しています ⚠️');
    }
});

// ファイル選択処理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        loadPDF(file);
    }
});

// 印刷機能
document.getElementById('print').addEventListener('click', () => {
    if (!pdfDoc) return;
    window.print();
    showNotification('印刷ダイアログを開きました 🖨️');
});

// ダウンロード機能
document.getElementById('download').addEventListener('click', () => {
    if (!pdfDoc) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(new Blob([pdfDoc], { type: 'application/pdf' }));
    downloadLink.download = 'document.pdf';
    downloadLink.click();
    showNotification('ダウンロードを開始しました 📥');
});

// 検索機能
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value;
    if (!searchTerm || !pdfDoc) return;
    
    searchResults.innerHTML = '';
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        
        if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
            const result = document.createElement('div');
            result.textContent = `ページ ${i}`;
            result.style.cursor = 'pointer';
            result.addEventListener('click', () => {
                pageNum = i;
                queueRenderPage(pageNum);
            });
            searchResults.appendChild(result);
        }
    }
});

// ピンチズーム対応
let touchDistance = 0;

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        touchDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        
        const newDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
        
        if (Math.abs(newDistance - touchDistance) > 10) {
            if (newDistance > touchDistance) {
                scale = Math.min(scale * 1.02, 3); // ピンチズーム時も最大倍率を3に設定
            } else {
                scale = Math.max(scale / 1.02, 0.5); // ピンチズーム時も最小倍率を0.5に設定
            }
            
            document.getElementById('zoomLevel').textContent = `${Math.round(scale * 100)}%`;
            queueRenderPage(pageNum);
            touchDistance = newDistance;
        }
    }
});

// キーボードイベントによるページ移動
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        // 左矢印キーで前のページへ
        if (pageNum > 1) {
            pageNum--;
            queueRenderPage(pageNum);
        }
    } else if (e.key === 'ArrowRight') {
        // 右矢印キーで次のページへ
        if (pageNum < pdfDoc.numPages) {
            pageNum++;
            queueRenderPage(pageNum);
        }
    }
});



// 初期通知
setTimeout(() => {
    showNotification('PDFファイルをドラッグ&ドロップするか選択してください 📄');
}, 1000);
