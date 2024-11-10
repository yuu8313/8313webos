class JSCombiner {
    constructor() {
        this.files = new Map();
        this.combinedContent = '';
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.filesContainer = document.getElementById('files-container');
        this.combineBtn = document.getElementById('combine-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.toast = document.getElementById('toast');
    }

    setupEventListeners() {
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', () => this.handleDragLeave());
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.combineBtn.addEventListener('click', () => this.combineFiles());
        this.downloadBtn.addEventListener('click', () => this.downloadCombinedFile());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave() {
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.js'));
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files).filter(file => file.name.endsWith('.js'));
        this.processFiles(files);
    }

    async processFiles(files) {
        for (const file of files) {
            try {
                const content = await this.readFile(file);
                this.files.set(file.name, content);
                this.showToast(`${file.name} を追加しました 📝`);
            } catch (error) {
                this.showToast(`${file.name} の読み込みに失敗しました ❌`);
            }
        }
        this.updateFileList();
        this.updateButtons();
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsText(file);
        });
    }

    updateFileList() {
        this.filesContainer.innerHTML = '';
        for (const [filename] of this.files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${filename}</span>
                <button onclick="jsCombiner.removeFile('${filename}')">❌</button>
            `;
            this.filesContainer.appendChild(fileItem);
        }
    }

    removeFile(filename) {
        this.files.delete(filename);
        this.updateFileList();
        this.updateButtons();
        this.showToast(`${filename} を削除しました 🗑️`);
    }

    updateButtons() {
        const hasFiles = this.files.size > 0;
        this.combineBtn.disabled = !hasFiles;
        this.downloadBtn.disabled = !this.combinedContent;
    }

    combineFiles() {
        this.combinedContent = Array.from(this.files.values()).join('\n\n');
        this.showToast('ファイルを結合しました 🎉');
        this.updateButtons();
    }

    downloadCombinedFile() {
        const blob = new Blob([this.combinedContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'combined.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('ダウンロードを開始しました 💾');
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

const jsCombiner = new JSCombiner();