class ImageCropper {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentImage = null;
        this.cropData = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.sourceCanvas = document.getElementById('sourceCanvas');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.editorArea = document.getElementById('editorArea');
        this.previewArea = document.getElementById('previewArea');
        this.cropArea = document.getElementById('cropArea');
        this.cropBtn = document.getElementById('cropBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.zoomRange = document.getElementById('zoomRange');
        
        // 数値入力フィールド
        this.cropXInput = document.getElementById('cropX');
        this.cropYInput = document.getElementById('cropY');
        this.cropWidthInput = document.getElementById('cropWidth');
        this.cropHeightInput = document.getElementById('cropHeight');
    }

    setupEventListeners() {
        // ファイルドロップイベント
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            } else {
                this.showNotification('画像ファイルのみ対応しています', 'error');
            }
        });

        // ファイル選択イベント
        this.fileInput.addEventListener('change', () => {
            const file = this.fileInput.files[0];
            if (file) {
                this.loadImage(file);
            }
        });

        // 切り抜き領域のドラッグイベント
        this.cropArea.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = {
                x: e.clientX - this.cropArea.offsetLeft,
                y: e.clientY - this.cropArea.offsetTop
            };
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const x = e.clientX - this.dragStart.x;
                const y = e.clientY - this.dragStart.y;
                this.updateCropPosition(x, y);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // ボタンイベント
        this.cropBtn.addEventListener('click', () => this.cropImage());
        this.resetBtn.addEventListener('click', () => this.resetCrop());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        
        // 数値入力イベント
        this.cropXInput.addEventListener('change', () => this.updateCropFromInputs());
        this.cropYInput.addEventListener('change', () => this.updateCropFromInputs());
        this.cropWidthInput.addEventListener('change', () => this.updateCropFromInputs());
        this.cropHeightInput.addEventListener('change', () => this.updateCropFromInputs());
        
        // ズームイベント
        this.zoomRange.addEventListener('input', () => this.updateZoom());
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.initializeCanvas();
                this.showEditor();
                this.showNotification('画像を読み込みました', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    initializeCanvas() {
        const ctx = this.sourceCanvas.getContext('2d');
        const containerWidth = this.sourceCanvas.parentElement.clientWidth;
        const containerHeight = this.sourceCanvas.parentElement.clientHeight;
        
        // アスペクト比を維持しながらキャンバスサイズを設定
        const scale = Math.min(
            containerWidth / this.currentImage.width,
            containerHeight / this.currentImage.height
        );
        
        this.sourceCanvas.width = this.currentImage.width * scale;
        this.sourceCanvas.height = this.currentImage.height * scale;
        
        ctx.drawImage(this.currentImage, 0, 0, this.sourceCanvas.width, this.sourceCanvas.height);
        
        // 初期の切り抜き領域を設定
        this.cropData = {
            x: this.sourceCanvas.width * 0.1,
            y: this.sourceCanvas.height * 0.1,
            width: this.sourceCanvas.width * 0.8,
            height: this.sourceCanvas.height * 0.8
        };
        
        this.updateCropAreaPosition();
        this.updateInputValues();
    }

    updateCropPosition(x, y) {
        const maxX = this.sourceCanvas.width - this.cropData.width;
        const maxY = this.sourceCanvas.height - this.cropData.height;
        
        this.cropData.x = Math.max(0, Math.min(x, maxX));
        this.cropData.y = Math.max(0, Math.min(y, maxY));
        
        this.updateCropAreaPosition();
        this.updateInputValues();
    }

    updateCropAreaPosition() {
        this.cropArea.style.left = `${this.cropData.x}px`;
        this.cropArea.style.top = `${this.cropData.y}px`;
        this.cropArea.style.width = `${this.cropData.width}px`;
        this.cropArea.style.height = `${this.cropData.height}px`;
    }

    updateInputValues() {
        this.cropXInput.value = Math.round(this.cropData.x);
        this.cropYInput.value = Math.round(this.cropData.y);
        this.cropWidthInput.value = Math.round(this.cropData.width);
        this.cropHeightInput.value = Math.round(this.cropData.height);
    }

    updateCropFromInputs() {
        this.cropData = {
            x: Number(this.cropXInput.value),
            y: Number(this.cropYInput.value),
            width: Number(this.cropWidthInput.value),
            height: Number(this.cropHeightInput.value)
        };
        this.updateCropAreaPosition();
    }

    updateZoom() {
        const scale = this.zoomRange.value / 100;
        const ctx = this.sourceCanvas.getContext('2d');
        
        ctx.clearRect(0, 0, this.sourceCanvas.width, this.sourceCanvas.height);
        ctx.save();
        ctx.scale(scale, scale);
        ctx.drawImage(
            this.currentImage,
            0, 0,
            this.currentImage.width,
            this.currentImage.height
        );
        ctx.restore();
    }

    cropImage() {
        const ctx = this.previewCanvas.getContext('2d');
        this.previewCanvas.width = this.cropData.width;
        this.previewCanvas.height = this.cropData.height;
        
        ctx.drawImage(
            this.sourceCanvas,
            this.cropData.x, this.cropData.y,
            this.cropData.width, this.cropData.height,
            0, 0,
            this.cropData.width, this.cropData.height
        );
        
        this.previewArea.classList.remove('hidden');
        this.showNotification('画像を切り抜きました', 'success');
    }

    resetCrop() {
        this.initializeCanvas();
        this.previewArea.classList.add('hidden');
        this.showNotification('リセットしました', 'success');
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'cropped-image.png';
        link.href = this.previewCanvas.toDataURL();
        link.click();
        this.showNotification('画像をダウンロードしました', 'success');
    }

    showEditor() {
        this.dropZone.classList.add('hidden');
        this.editorArea.classList.remove('hidden');
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// アプリケーションの初期化
new ImageCropper();
