document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const previewPane = document.getElementById('preview-pane');
    const downloadBtn = document.getElementById('download-btn');
    const downloadFormat = document.getElementById('download-format');
    const copyBtn = document.getElementById('copy-btn'); 
    const clearBtn = document.getElementById('clear-btn'); 

    function updatePreview() {
        const markdown = markdownInput.value;
        const html = marked(markdown);
        previewPane.innerHTML = html;
        
        previewPane.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    markdownInput.addEventListener('input', updatePreview);

    downloadBtn.addEventListener('click', () => {
        const format = downloadFormat.value;
        const content = markdownInput.value;
        let blob, filename, mimeType;

        switch (format) {
            case 'md':
                blob = new Blob([content], {type: 'text/markdown'});
                filename = 'document.md';
                break;
            case 'html':
                blob = new Blob([marked(content)], {type: 'text/html'});
                filename = 'document.html';
                break;
            case 'plain-html':
                blob = new Blob([content], {type: 'text/html'});  
                filename = 'document.html';
                break;

            case 'svg':
                blob = new Blob([content], { type: 'image/svg+xml' });
                filename = 'document.svg';
                break;
            case 'txt':
                blob = new Blob([content], {type: 'text/plain'});
                filename = 'document.txt';
                break;
            case 'csv':
                const csv = content.split('\n').map(line => line.split(',').join(',')).join('\n');
                blob = new Blob([csv], {type: 'text/csv'});
                filename = 'document.csv';
                break;
            case 'pdf':
                const element = document.createElement('div');
                element.innerHTML = marked(content);
                html2pdf().from(element).save('document.pdf');
                return;
        }


        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    copyBtn.addEventListener('click', () => {
        markdownInput.select();
        document.execCommand('copy');
        alert('テキストがクリップボードにコピーされました。');
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('本当にテキストをクリアしますか？')) {
            markdownInput.value = '';
            updatePreview();
        }
    });

    // 初期プレビューの更新
    updatePreview();
});
