       document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('newThreadBtn').addEventListener('click', showNewThreadModal);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('cancelBtn').addEventListener('click', hideNewThreadModal);
    document.getElementById('createBtn').addEventListener('click', createNewThread);
});

function showNewThreadModal() {
    document.getElementById('newThreadModal').style.display = 'block';
}

function hideNewThreadModal() {
    document.getElementById('newThreadModal').style.display = 'none';
}

function createNewThread() {
    const threadName = document.getElementById('threadNameInput').value;
    if (threadName) {
        const threadList = document.getElementById('threadList');
        const newThread = document.createElement('div');
        newThread.textContent = threadName;
        threadList.appendChild(newThread);
        hideNewThreadModal();
        document.getElementById('threadNameInput').value = ''; // 入力フィールドのクリア
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    if (messageText) {
        const chatMessages = document.getElementById('chatMessages');
        const newMessage = document.createElement('div');
        newMessage.textContent = messageText;
        chatMessages.appendChild(newMessage);
        messageInput.value = ''; // 入力フィールドのクリア
    }
}


       let currentThreadId = null;
        const storage = {
            threads: JSON.parse(localStorage.getItem('chatThreads') || '[]'),
            messages: JSON.parse(localStorage.getItem('chatMessages') || '{}')
        };

        function saveToStorage() {
            localStorage.setItem('chatThreads', JSON.stringify(storage.threads));
            localStorage.setItem('chatMessages', JSON.stringify(storage.messages));
        }

        function showNewThreadModal() {
            document.getElementById('newThreadModal').style.display = 'flex';
            document.getElementById('threadNameInput').focus();
        }

        function hideNewThreadModal() {
            document.getElementById('newThreadModal').style.display = 'none';
            document.getElementById('threadNameInput').value = '';
        }

        function createNewThread() {
            const threadName = document.getElementById('threadNameInput').value.trim();
            if (threadName) {
                const threadId = Date.now().toString();
                storage.threads.push({ id: threadId, name: threadName });
                storage.messages[threadId] = [];
                saveToStorage();
                hideNewThreadModal();
                renderThreadList();
                selectThread(threadId);
            }
        }

        function deleteThread(threadId, event) {
            event.stopPropagation();
            if (confirm('このスレッドを削除してもよろしいですか？')) {
                storage.threads = storage.threads.filter(thread => thread.id !== threadId);
                delete storage.messages[threadId];
                saveToStorage();
                if (currentThreadId === threadId) {
                    currentThreadId = null;
                }
                renderThreadList();
                renderMessages();
            }
        }

        function renderThreadList() {
            const threadList = document.getElementById('threadList');
            threadList.innerHTML = storage.threads.map(thread => `
                <div class="thread-item ${thread.id === currentThreadId ? 'active' : ''}"
                     onclick="selectThread('${thread.id}')">
                    ${thread.name}
                    <button class="thread-delete-btn" onclick="deleteThread('${thread.id}', event)">×</button>
                </div>
            `).join('');
        }

        function selectThread(threadId) {
            currentThreadId = threadId;
            renderThreadList();
            renderMessages();
        }

        function formatDate(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            
            const timeStr = date.toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            if (isToday) {
                return `今日 ${timeStr}`;
            }
            
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${timeStr}`;
        }

        function renderMessages() {
            const messagesDiv = document.getElementById('chatMessages');
            if (!currentThreadId) {
                messagesDiv.innerHTML = '<p style="text-align: center; color: #999;">スレッドを選択してください</p>';
                return;
            }

            const messages = storage.messages[currentThreadId] || [];
            messagesDiv.innerHTML = messages.map((msg, index) => `
                <div class="message">
                    ${msg.text}
                    <div class="message-time">${formatDate(msg.timestamp)}</div>
                    <button class="delete-btn" onclick="deleteMessage(${index})">×</button>
                </div>
            `).join('');
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function sendMessage() {
            const input = document.getElementById('messageInput');
            const messageText = input.value.trim();
            
            if (messageText && currentThreadId) {
                if (!storage.messages[currentThreadId]) {
                    storage.messages[currentThreadId] = [];
                }
                const message = {
                    text: messageText,
                    timestamp: Date.now()
                };
                storage.messages[currentThreadId].push(message);
                saveToStorage();
                input.value = '';
                renderMessages();
            }
        }

        function deleteMessage(index) {
            if (currentThreadId && storage.messages[currentThreadId]) {
                storage.messages[currentThreadId].splice(index, 1);
                saveToStorage();
                renderMessages();
            }
        }

        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        renderThreadList();
        renderMessages();

