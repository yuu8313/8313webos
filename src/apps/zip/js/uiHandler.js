// 通知システム
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    anime({
        targets: notification,
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });

    setTimeout(() => {
        anime({
            targets: notification,
            translateY: [0, 20],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                notification.classList.remove('show');
            }
        });
    }, 3000);
}

// アニメーション
document.addEventListener('DOMContentLoaded', () => {
    anime({
        targets: '.header',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.drop-zone',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
});