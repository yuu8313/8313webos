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