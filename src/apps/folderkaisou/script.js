document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const resultArea = document.getElementById('resultArea');
    const structureOutput = document.getElementById('structureOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const notification = document.getElementById('notification');
    const browseBtn = document.getElementById('browseBtn');

    // Initially hide the result area
    resultArea.style.display = 'none';

    // ブラウズボタンのクリックイベントを追加
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // ドラッグ&ドロップイベントの処理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('drag-over');
        });
    });

    // ファイルドロップの処理
    dropArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    function handleDrop(e) {
        const items = e.dataTransfer.items;
        handleItems(items);
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }

    async function handleItems(items) {
        const files = [];
        for (let item of items) {
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    await traverseFileSystem(entry, '', files);
                }
            }
        }
        processFiles(files);
    }

    async function traverseFileSystem(entry, path, files) {
        if (entry.isFile) {
            const file = await new Promise(resolve => entry.file(resolve));
            file.relativePath = path + file.name;
            files.push(file);
        } else if (entry.isDirectory) {
            const dirReader = entry.createReader();
            const entries = await new Promise(resolve => {
                const results = [];
                function readEntries() {
                    dirReader.readEntries((entries) => {
                        if (entries.length) {
                            results.push(...entries);
                            readEntries();
                        } else {
                            resolve(results);
                        }
                    });
                }
                readEntries();
            });
            
            for (let entry of entries) {
                await traverseFileSystem(entry, path + entry.name + '/', files);
            }
        }
    }

    function processFiles(files) {
        if (files.length === 0) {
            resultArea.style.display = 'none';
            return;
        }

        const structure = generateStructure(files);
        displayStructure(structure);
        showNotification('ファイル構造を生成しました', 'success');
        
        anime({
            targets: resultArea,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
            begin: () => {
                resultArea.style.display = 'block';
                resultArea.classList.add('visible');
            }
        });
    }

    function generateStructure(files) {
        const structure = {};
        
        files.forEach(file => {
            const path = file.relativePath || file.webkitRelativePath || file.name;
            const parts = path.split('/');
            let current = structure;
            
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = null;
                } else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            });
        });
        
        return structure;
    }

    function displayStructure(structure) {
        const output = formatStructureForDisplay(structure);
        structureOutput.innerHTML = output;
    }

    // 表示用のフォーマット（SVGアイコン）
    function formatStructureForDisplay(structure, prefix = '', isLast = true) {
        let output = '';
        const entries = Object.entries(structure);
        
        entries.forEach(([key, value], index) => {
            const isLastEntry = index === entries.length - 1;
            const isDirectory = value !== null;
            const icon = isDirectory ? '<i class="fas fa-folder"></i>' : '<i class="fas fa-file"></i>';
            const line = prefix + (isLast ? '└─ ' : '├─ ') + key + ' ' + icon + '\n';
            output += line;
            
            if (value !== null) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                output += formatStructureForDisplay(value, newPrefix, isLastEntry);
            }
        });
        
        return output;
    }

    // エクスポート用のフォーマット（絵文字）
    function formatStructureForExport(structure, prefix = '', isLast = true) {
        let output = '';
        const entries = Object.entries(structure);
        
        entries.forEach(([key, value], index) => {
            const isLastEntry = index === entries.length - 1;
            const isDirectory = value !== null;
            const icon = isDirectory ? '📁' : '📄';
            const line = prefix + (isLast ? '└─ ' : '├─ ') + key + ' ' + icon + '\n';
            output += line;
            
            if (value !== null) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                output += formatStructureForExport(value, newPrefix, isLastEntry);
            }
        });
        
        return output;
    }

    // コピー機能
    copyBtn.addEventListener('click', async () => {
        try {
            const files = Array.from(fileInput.files);
            if (files.length === 0) {
                showNotification('ファイルが選択されていません', 'error');
                return;
            }
            const structure = generateStructure(files);
            const exportText = formatStructureForExport(structure);
            await navigator.clipboard.writeText(exportText);
            showNotification('クリップボードにコピーしました', 'success');
        } catch (err) {
            showNotification('コピーに失敗しました', 'error');
        }
    });

    // ダウンロード機能
    downloadBtn.addEventListener('click', () => {
        const files = Array.from(fileInput.files);
        if (files.length === 0) {
            showNotification('ファイルが選択されていません', 'error');
            return;
        }
        const structure = generateStructure(files);
        const exportText = formatStructureForExport(structure);
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file-structure.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('ファイルをダウンロードしました', 'success');
    });

    // 通知機能
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        anime({
            targets: notification,
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 500,
            easing: 'easeOutCubic',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        opacity: 0,
                        translateX: 20,
                        duration: 500,
                        easing: 'easeInCubic',
                        complete: () => {
                            notification.style.display = 'none';
                        }
                    });
                }, 3000);
            }
        });
    }

    // リセット機能の強化
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        structureOutput.innerHTML = '';
        resultArea.classList.remove('visible');
        resultArea.style.display = 'none';
        showNotification('フォルダ構造をリセットしました', 'success');
    });
});
