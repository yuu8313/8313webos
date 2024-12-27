/**
 * AppNotification.js - 通知の表示を担当
 */
class AppNotification {
    static show(title, message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        
        notification.innerHTML = `
            <div class="notification-icon">${this.getIcon(type)}</div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        container.appendChild(notification);

        // アニメーション後に削除
        setTimeout(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-exit');
            
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 3000);
    }

    static getIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }
}