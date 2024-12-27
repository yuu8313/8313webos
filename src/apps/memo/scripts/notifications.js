// 通知表示
function tsuchiBaru(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show';
    
    if (type === 'error') {
        notification.style.background = 'rgba(255, 68, 68, 0.9)';
    } else {
        notification.style.background = 'rgba(155, 135, 245, 0.9)';
    }
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}