let currentFiles = new Map();
let isFolderMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const singleFileInput = document.getElementById('singleFileInput');
    const resetButton = document.getElementById('resetButton');
    const compressAllButton = document.getElementById('compressAllButton');
    
    if (compressAllButton) {
        compressAllButton.style.display = 'none';
    }

    // シフトキーの監視
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift' && !isFolderMode) {
            isFolderMode = true;
            updateDropZoneUI();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift' && isFolderMode) {
            isFolderMode = false;
            updateDropZoneUI();
        }
    });

    function updateDropZoneUI() {
        if (isFolderMode) {
            dropZone.innerHTML = `
                <i class="fas fa-folder-open"></i>
                <p>フォルダーを選択してください<br>または<br>フォルダーをドラッグ＆ドロップ</p>
            `;
        } else {
            dropZone.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>ファイルまたはフォルダーをドラッグ＆ドロップ<br>または<br>クリックしてファイルを選択</p>
            `;
        }
    }

    // リセットボタンの処理
    resetButton.addEventListener('click', () => {
        currentFiles.clear();
        const fileList = document.getElementById('fileList');
        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }
        if (compressAllButton) {
            fileList.appendChild(compressAllButton);
            compressAllButton.style.display = 'none';
        }
        showNotification('ファイルリストをリセットしました', 'success');
    });

    // クリックでファイル選択
    dropZone.addEventListener('click', () => {
        if (isFolderMode) {
            fileInput.click();
        } else {
            singleFileInput.click();
        }
    });

    // ドラッグ&ドロップイベント
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        
        const items = e.dataTransfer.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry();
                if (item) {
                    if (item.isDirectory) {
                        handleFolderEntry(item);
                    } else {
                        handleFiles([e.dataTransfer.files[i]]);
                    }
                }
            }
        } else {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        handleFolderFiles(e.target.files);
    });

    singleFileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
});

function updateCompressAllButtonVisibility() {
    const hasNonZipFiles = Array.from(currentFiles.values()).some(file => !file.name.endsWith('.zip'));
    if (compressAllButton) {
        compressAllButton.style.display = hasNonZipFiles ? 'flex' : 'none';
    }
}

async function handleFolderEntry(entry, parentFolderId = null) {
    const folderFiles = [];
    const subFolders = new Map();
    
    async function readEntries(entry, currentPath = '') {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
            reader.readEntries(resolve);
        });
        
        for (const entry of entries) {
            if (entry.isFile) {
                const file = await new Promise((resolve) => {
                    entry.file(resolve);
                });
                folderFiles.push({
                    file,
                    path: currentPath
                });
            } else if (entry.isDirectory) {
                const subFolderId = Date.now() + Math.random().toString(36).substr(2, 9);
                subFolders.set(currentPath + '/' + entry.name, subFolderId);
                await readEntries(entry, currentPath + '/' + entry.name);
            }
        }
    }
    
    await readEntries(entry);
    
    if (folderFiles.length > 0 || subFolders.size > 0) {
        const folderId = Date.now() + Math.random().toString(36).substr(2, 9);
        const folderElement = createFolderElement(entry.name, folderId, parentFolderId);
        
        if (parentFolderId) {
            const parentFolder = document.querySelector(`[data-folder-id="${parentFolderId}"] .folder-files`);
            if (parentFolder) {
                parentFolder.appendChild(folderElement);
            }
        } else {
            document.getElementById('fileList').appendChild(folderElement);
        }
        
        // サブフォルダーを作成
        for (const [path, subFolderId] of subFolders) {
            const folderName = path.split('/').pop();
            await handleFolderEntry({
                name: folderName,
                isDirectory: true,
                createReader: () => entry.createReader()
            }, folderId);
        }
        
        // ファイルを追加
        folderFiles.forEach(({file, path}) => {
            const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
            currentFiles.set(fileId, file);
            createFileElement(file, fileId, false, folderId);
        });
        
        showNotification(`フォルダー "${entry.name}" をアップロードしました`, 'success');
        updateCompressAllButtonVisibility();
    }
}

function handleFolderFiles(files) {
    if (files.length > 0) {
        const folderPath = files[0].webkitRelativePath.split('/')[0];
        const folderId = Date.now() + Math.random().toString(36).substr(2, 9);
        const folderElement = createFolderElement(folderPath, folderId);
        document.getElementById('fileList').appendChild(folderElement);
        
        const filesByFolder = new Map();
        
        Array.from(files).forEach(file => {
            const pathParts = file.webkitRelativePath.split('/');
            const currentPath = pathParts.slice(0, -1).join('/');
            
            if (!filesByFolder.has(currentPath)) {
                filesByFolder.set(currentPath, []);
            }
            filesByFolder.get(currentPath).push(file);
        });
        
        filesByFolder.forEach((files, path) => {
            if (path !== folderPath) {
                const subFolderId = Date.now() + Math.random().toString(36).substr(2, 9);
                const subFolderElement = createFolderElement(path.split('/').pop(), subFolderId, folderId);
                const parentFolder = document.querySelector(`[data-folder-id="${folderId}"] .folder-files`);
                if (parentFolder) {
                    parentFolder.appendChild(subFolderElement);
                }
                
                files.forEach(file => {
                    const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
                    currentFiles.set(fileId, file);
                    createFileElement(file, fileId, false, subFolderId);
                });
            } else {
                files.forEach(file => {
                    const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
                    currentFiles.set(fileId, file);
                    createFileElement(file, fileId, false, folderId);
                });
            }
        });
        
        showNotification(`フォルダー "${folderPath}" をアップロードしました`, 'success');
        updateCompressAllButtonVisibility();
    }
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
        currentFiles.set(fileId, file);
        
        if (file.name.endsWith('.zip')) {
            createFileElement(file, fileId, true);
        } else {
            createFileElement(file, fileId, false);
        }
    });
    updateCompressAllButtonVisibility();
}

function createFolderElement(folderName, folderId, parentFolderId = null) {
    const folderElement = document.createElement('div');
    folderElement.className = 'folder-item scale-in';
    folderElement.dataset.folderId = folderId;
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-folder';
    
    const name = document.createElement('span');
    name.className = 'folder-name';
    name.textContent = folderName;
    
    const compressButton = document.createElement('button');
    compressButton.className = 'compress-button';
    compressButton.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> 圧縮';
    compressButton.onclick = () => compressFolder(folderId);
    
    const filesContainer = document.createElement('div');
    filesContainer.className = 'folder-files';
    filesContainer.style.display = 'none';
    
    folderElement.appendChild(icon);
    folderElement.appendChild(name);
    folderElement.appendChild(compressButton);
    folderElement.appendChild(filesContainer);
    
    // フォルダーのクリックイベント
    folderElement.addEventListener('click', (e) => {
        if (e.target === icon || e.target === name) {
            filesContainer.style.display = filesContainer.style.display === 'none' ? 'block' : 'none';
            icon.className = filesContainer.style.display === 'none' ? 'fas fa-folder' : 'fas fa-folder-open';
        }
    });
    
    return folderElement;
}

function createFileElement(file, fileId, isZip, folderId = null) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item scale-in';
    fileItem.dataset.fileId = fileId;

    const icon = document.createElement('i');
    icon.className = isZip ? 'fas fa-file-archive' : 'fas fa-file';
    
    const fileName = document.createElement('span');
    fileName.className = 'file-name';
    fileName.textContent = file.name;

    const actionButton = document.createElement('button');
    actionButton.className = 'action-button';
    actionButton.innerHTML = isZip ? 
        '<i class="fas fa-expand-arrows-alt"></i> 展開' : 
        '<i class="fas fa-compress-arrows-alt"></i> 圧縮';
    actionButton.onclick = () => {
        if (isZip) {
            extractZip(fileId);
        } else {
            compressFile(fileId);
        }
    };

    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.appendChild(actionButton);

    if (folderId) {
        const folderElement = document.querySelector(`[data-folder-id="${folderId}"]`);
        if (folderElement) {
            folderElement.querySelector('.folder-files').appendChild(fileItem);
        }
    } else {
        document.getElementById('fileList').appendChild(fileItem);
    }
}

// 一括圧縮ボタンを追加
function addCompressAllButton() {
    const fileList = document.getElementById('fileList');
    if (!document.getElementById('compressAllButton')) {
        const compressAllButton = document.createElement('button');
        compressAllButton.id = 'compressAllButton';
        compressAllButton.className = 'compress-all-button';
        compressAllButton.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> すべて圧縮';
        compressAllButton.onclick = compressAll;
        fileList.appendChild(compressAllButton);
    }
}

document.addEventListener('DOMContentLoaded', addCompressAllButton);
