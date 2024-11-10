class Console {
    constructor() {
        this.commandInput = document.getElementById('commandInput');
        this.output = document.getElementById('output');
        this.clearBtn = document.getElementById('clearBtn');
        this.notification = document.getElementById('notification');
        this.commandHistory = [];
        this.historyIndex = -1;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.commandInput.addEventListener('keydown', this.handleInput.bind(this));
        this.clearBtn.addEventListener('click', this.clearOutput.bind(this));
    }

    handleInput(event) {
        if (event.key === 'Enter' && this.commandInput.value.trim()) {
            this.executeCommand(this.commandInput.value);
            this.commandHistory.push(this.commandInput.value);
            this.historyIndex = this.commandHistory.length;
            this.commandInput.value = '';
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.navigateHistory('up');
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.navigateHistory('down');
        }
    }

    executeCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.innerHTML = `<span class="prompt">> </span>${command}`;
        
        try {
            const result = eval(command);
            if (result !== undefined) {
                const resultLine = document.createElement('div');
                resultLine.className = 'output-line success';
                resultLine.textContent = `${result}`;
                this.output.appendChild(outputLine);
                this.output.appendChild(resultLine);
            }
            this.showNotification('コマンドが実行されました ✨', 'success');
        } catch (error) {
            const errorLine = document.createElement('div');
            errorLine.className = 'output-line error';
            errorLine.textContent = `${error}`;
            this.output.appendChild(outputLine);
            this.output.appendChild(errorLine);
            this.showNotification('エラーが発生しました ❌', 'error');
        }

        this.output.scrollTop = this.output.scrollHeight;
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down') {
            this.historyIndex = this.commandHistory.length;
            this.commandInput.value = '';
        }
    }

    clearOutput() {
        this.output.innerHTML = '';
        this.showNotification('コンソールがクリアされました 🧹', 'success');
    }

    showNotification(message, type) {
        this.notification.textContent = message;
        this.notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
}

// コンソールのインスタンスを作成
const console = new Console();

// 初期メッセージを表示
const welcomeMessage = `
JSリアルタイムコンソールへようこそ! 🎉
使い方:
- JavaScriptコードを入力して Enter キーを押すと実行されます
- ↑↓ キーで履歴を表示できます
- クリアボタンで出力をクリアできます
`;

const outputLine = document.createElement('div');
outputLine.className = 'output-line';
outputLine.textContent = welcomeMessage;
document.getElementById('output').appendChild(outputLine);