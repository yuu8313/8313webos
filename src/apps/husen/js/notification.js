class NotificationManager {
    static show(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        anime({
            targets: notification,
            translateX: [100, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutCubic',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        translateX: [0, 100],
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInCubic',
                        complete: () => {
                            notification.remove();
                        }
                    });
                }, 2000);
            }
        });
    }
}