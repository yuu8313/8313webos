class PaintApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.history = [];
        this.redoHistory = [];
        this.currentStep = -1;
        this.tool = 'pen';
        
        this.initializeCanvas();
        this.setupEventListeners();
    }

    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.saveState();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupEventListeners() {
        // ツール選択
        document.getElementById('pen').addEventListener('click', () => this.setTool('pen'));
        document.getElementById('eraser').addEventListener('click', () => this.setTool('eraser'));
        
        // 色とサイズの設定
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.ctx.strokeStyle = e.target.value;
            this.showNotification('色を変更しました 🎨');
        });
        
        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            this.ctx.lineWidth = e.target.value;
            this.showNotification(`ブラシサイズ: ${e.target.value}px 📏`);
        });

        // Undo/Redo
        document.getElementById('undo').addEventListener('click', () => this.undo());
        document.getElementById('redo').addEventListener('click', () => this.redo());

        // 描画イベント
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // タッチデバイス対応
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    }

    setTool(newTool) {
        this.tool = newTool;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(newTool).classList.add('active');
        
        if (newTool === 'pen') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.showNotification('ペンツールを選択 ✏️');
        } else {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.showNotification('消しゴムツールを選択 🧹');
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    }

    draw(e) {
        if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
        this.ctx.stroke();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveState();
        }
    }

    saveState() {
        this.currentStep++;
        this.history = this.history.slice(0, this.currentStep);
        this.history.push(this.canvas.toDataURL());
        this.redoHistory = [];
    }

    undo() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.loadState(this.history[this.currentStep]);
            this.showNotification('元に戻しました ↩️');
        }
    }

    redo() {
        if (this.currentStep < this.history.length - 1) {
            this.currentStep++;
            this.loadState(this.history[this.currentStep]);
            this.showNotification('やり直しました ↪️');
        }
    }

    loadState(state) {
        const img = new Image();
        img.src = state;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// アプリケーションの初期化
window.addEventListener('load', () => {
    new PaintApp();
});