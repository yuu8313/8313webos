document.addEventListener('DOMContentLoaded', function() {
    const latexInput = document.getElementById('latex-input');
    const preview = document.getElementById('preview');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadTexBtn = document.getElementById('download-tex-btn');
    const downloadHtmlBtn = document.getElementById('download-html-btn');
    const downloadTxtBtn = document.getElementById('download-txt-btn');
    const draggables = document.querySelectorAll('.draggable');

    function renderLatex() {
        const latex = latexInput.value;
        katex.render(latex, preview, {
            throwOnError: false,
            displayMode: true
        });
    }

    latexInput.addEventListener('input', renderLatex);

    clearBtn.addEventListener('click', function() {
        latexInput.value = '';
        renderLatex();
    });

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(latexInput.value).then(function() {
            alert('LaTeX数式をクリップボードにコピーしました。');
        });
    });

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadTexBtn.addEventListener('click', function() {
        downloadFile(latexInput.value, 'equation.tex', 'text/plain');
    });

    downloadHtmlBtn.addEventListener('click', function() {
        const html = `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
</head>
<body>
    <div id="formula"></div>
    <script>
        katex.render("${latexInput.value.replace(/"/g, '\\"')}", document.getElementById('formula'), {
            throwOnError: false,
            displayMode: true
        });
    </script>
</body>
</html>`;
        downloadFile(html, 'equation.html', 'text/html');
    });

    downloadTxtBtn.addEventListener('click', function() {
        downloadFile(latexInput.value, 'equation.txt', 'text/plain');
    });

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-latex'));
        });
    });

    latexInput.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    latexInput.addEventListener('drop', function(e) {
        e.preventDefault();
        const latex = e.dataTransfer.getData('text/plain');
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const current = this.value;
        this.value = current.slice(0, start) + latex + current.slice(end);
        this.selectionStart = this.selectionEnd = start + latex.length;
        renderLatex();
    });

    renderLatex();
});