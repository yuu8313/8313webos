let zip = new JSZip();

// 圧縮レベルの取得
function getCompressionLevel() {
    const select = document.getElementById('compressionLevel');
    return parseInt(select.value);
}

// ZIPの初期化
function resetZip() {
    zip = new JSZip();
}

// ファイルのダウンロード処理を追加
function downloadFile(blob, filename) {
    console.log(`ファイル "${filename}" のダウンロードを開始します`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`ファイル "${filename}" のダウンロードが完了しました`);
}

async function addFileToZip(file) {
    const response = await fetch(file.fullPath);
    const blob = await response.blob();
    zip.file(file.name, blob);
}

// フォルダーのZIPへの追加
async function addFolderToZip(folderPath, files) {
    const folder = zip.folder(folderPath);
    for (const file of files) {
        if (file.isDirectory) {
            await addFolderToZip(file.fullPath, file.files);
        } else {
            await addFileToZip(file);
        }
    }
}

// ファイルの圧縮処理
async function compressFiles(files) {
    const compressionLevel = getCompressionLevel();
    console.log(`Compressing with level: ${compressionLevel}`);

    try {
        for (const file of files) {
            if (file.isDirectory) {
                await addFolderToZip(file.fullPath, file.files);
            } else {
                await addFileToZip(file);
            }
        }

        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: compressionLevel
            }
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const zipFileName = `compressed-${timestamp}.zip`;
        
        downloadFile(content, zipFileName);
        showNotification('ZIPファイルの作成が完了しました！', 'success');
        resetZip();
    } catch (error) {
        console.error('Compression error:', error);
        showNotification('圧縮中にエラーが発生しました。', 'error');
    }
}

// 単一ファイルの圧縮
async function compressFile(fileId) {
    const file = currentFiles.get(fileId);
    if (!file) return;

    try {
        const compressionLevel = getCompressionLevel();
        const zip = new JSZip();
        zip.file(file.name, file);
        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: compressionLevel
            }
        });
        
        const downloadButton = document.createElement('button');
        downloadButton.className = 'action-button';
        downloadButton.innerHTML = '<i class="fas fa-download"></i> ダウンロード';
        downloadButton.onclick = () => downloadFile(zipBlob, `${file.name}.zip`);
        
        const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
        const existingButton = fileItem.querySelector('button');
        fileItem.replaceChild(downloadButton, existingButton);
        
        showNotification('ファイルを圧縮しました', 'success');
    } catch (error) {
        showNotification('圧縮中にエラーが発生しました', 'error');
        console.error('Error compressing file:', error);
    }
}

// フォルダーの圧縮
async function compressFolder(folderId) {
    const folderElement = document.querySelector(`[data-folder-id="${folderId}"]`);
    if (!folderElement) return;

    try {
        const compressionLevel = getCompressionLevel();
        const zip = new JSZip();
        const folderName = folderElement.querySelector('.folder-name').textContent;
        const files = Array.from(folderElement.querySelectorAll('[data-file-id]')).map(el => ({
            file: currentFiles.get(el.dataset.fileId),
            path: getFolderPath(el)
        }));

        for (const {file, path} of files) {
            if (file) {
                zip.file(`${path}/${file.name}`, file);
            }
        }

        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: compressionLevel
            }
        });

        const downloadButton = document.createElement('button');
        downloadButton.className = 'action-button';
        downloadButton.innerHTML = '<i class="fas fa-download"></i> ダウンロード';
        downloadButton.onclick = () => downloadFile(zipBlob, `${folderName}.zip`);
        
        const compressButton = folderElement.querySelector('.compress-button');
        folderElement.replaceChild(downloadButton, compressButton);
        
        showNotification(`フォルダー "${folderName}" を圧縮しました`, 'success');
    } catch (error) {
        showNotification('圧縮中にエラーが発生しました', 'error');
        console.error('Error compressing folder:', error);
    }
}

// すべてのファイルの圧縮
async function compressAll() {
    try {
        const compressionLevel = getCompressionLevel();
        const zip = new JSZip();
        const fileList = document.getElementById('fileList');
        
        const items = Array.from(fileList.children).filter(el => 
            el.classList.contains('file-item') || el.classList.contains('folder-item')
        );

        for (const item of items) {
            if (item.classList.contains('folder-item')) {
                const folderName = item.querySelector('.folder-name').textContent;
                const files = Array.from(item.querySelectorAll('[data-file-id]')).map(el => ({
                    file: currentFiles.get(el.dataset.fileId),
                    path: getFolderPath(el)
                }));
                
                for (const {file, path} of files) {
                    if (file) {
                        zip.file(`${path}/${file.name}`, file);
                    }
                }
            } else {
                const fileId = item.dataset.fileId;
                const file = currentFiles.get(fileId);
                if (file) {
                    zip.file(file.name, file);
                }
            }
        }

        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: compressionLevel
            }
        });
        downloadFile(zipBlob, 'all_files.zip');
        showNotification('すべてのファイルを圧縮しました', 'success');
    } catch (error) {
        showNotification('圧縮中にエラーが発生しました', 'error');
        console.error('Error compressing all files:', error);
    }
}

// ZIPファイルの解凍
async function extractZip(fileId) {
    const file = currentFiles.get(fileId);
    if (!file) return;

    try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        const folderStructure = document.createElement('div');
        folderStructure.className = 'folder-structure';
        
        const folders = new Map();
        folders.set('', folderStructure);

        for (const [path, entry] of Object.entries(zipContent.files)) {
            const pathParts = path.split('/');
            const fileName = pathParts.pop();
            const folderPath = pathParts.join('/');

            if (!entry.dir) {
                const parentFolder = getOrCreateFolder(folders, folderPath);
                const blob = await entry.async('blob');
                const fileElement = createExtractedFileElement(fileName, blob);
                parentFolder.appendChild(fileElement);
            }
        }

        // 展開したファイルを元のZIPファイルの下に表示
        const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileItem) {
            // 既存の展開済みコンテンツを削除
            const existingContent = fileItem.querySelector('.folder-structure');
            if (existingContent) {
                existingContent.remove();
            }
            fileItem.appendChild(folderStructure);
        }
        
        showNotification('ZIPファイルを展開しました', 'success');
    } catch (error) {
        showNotification('展開中にエラーが発生しました', 'error');
        console.error('Error extracting ZIP:', error);
    }
}

function getOrCreateFolder(folders, path) {
    if (folders.has(path)) {
        return folders.get(path);
    }

    const pathParts = path.split('/');
    const folderName = pathParts.pop();
    const parentPath = pathParts.join('/');
    const parentFolder = getOrCreateFolder(folders, parentPath);

    const folderElement = document.createElement('div');
    folderElement.className = 'extracted-folder';
    
    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-folder';
    
    const name = document.createElement('span');
    name.textContent = folderName || 'Root';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'action-button';
    downloadButton.innerHTML = '<i class="fas fa-download"></i> ダウンロード';
    downloadButton.onclick = () => downloadFolderContents(folderElement);
    
    const filesContainer = document.createElement('div');
    filesContainer.className = 'folder-files';
    filesContainer.style.display = 'none';

    folderHeader.appendChild(icon);
    folderHeader.appendChild(name);
    folderHeader.appendChild(downloadButton);
    folderElement.appendChild(folderHeader);
    folderElement.appendChild(filesContainer);

    folderHeader.addEventListener('click', (e) => {
        if (e.target !== downloadButton) {
            filesContainer.style.display = filesContainer.style.display === 'none' ? 'block' : 'none';
            icon.className = filesContainer.style.display === 'none' ? 'fas fa-folder' : 'fas fa-folder-open';
        }
    });

    parentFolder.appendChild(folderElement);
    folders.set(path, filesContainer);
    return filesContainer;
}

function downloadFolderContents(folderElement) {
    const files = Array.from(folderElement.querySelectorAll('.extracted-file'));
    const fileCount = files.length;
    
    if (confirm(`このフォルダー内の${fileCount}個のファイルをダウンロードしますか？`)) {
        if (confirm('フォルダー階層は保存されませんがよろしいですか？')) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            files.forEach(fileElement => {
                const downloadButton = fileElement.querySelector('.action-button');
                if (downloadButton) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    downloadButton.dispatchEvent(clickEvent);
                }
            });
            
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }
    }
}

function createExtractedFileElement(filename, blob) {
    const fileElement = document.createElement('div');
    fileElement.className = 'extracted-file fade-in';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-file';
    
    const name = document.createElement('span');
    name.textContent = filename;
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'action-button';
    downloadButton.innerHTML = '<i class="fas fa-download"></i> ダウンロード';
    downloadButton.onclick = () => downloadFile(blob, filename);
    
    fileElement.appendChild(icon);
    fileElement.appendChild(name);
    fileElement.appendChild(downloadButton);
    
    return fileElement;
}

function getFolderPath(element) {
    const path = [];
    let current = element;
    while (current) {
        const folderName = current.closest('.folder-item')?.querySelector('.folder-name')?.textContent;
        if (folderName) {
            path.unshift(folderName);
        }
        current = current.parentElement?.closest('.folder-item');
    }
    return path.join('/');
}

// エクスポート
window.compressFiles = compressFiles;
window.compressFile = compressFile;
window.compressFolder = compressFolder;
window.compressAll = compressAll;
window.extractZip = extractZip;
window.downloadFile = downloadFile;