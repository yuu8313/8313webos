// Mac.js - MacOS風のデザインと動作を実現するための機能を提供
 

class MacSystem {
    constructor() {
        this.initializeStyles();
    }

    // MacOS風のスタイルを初期化
    initializeStyles() {
        // ウィンドウのブラーエフェクト
        document.documentElement.style.setProperty('--window-blur', '10px');
        
        // アニメーションの設定
        this.setupAnimations();
    }

    // MacOS風のアニメーションを設定
    setupAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .window {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .window.minimizing {
                transform: scale(0.7) translateY(100%);
                opacity: 0;
            }
            
            .window.maximizing {
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }

    // ウィンドウのホバーエフェクト
    addWindowHoverEffect(window) {
        window.addEventListener('mouseenter', () => {
            window.style.transform = 'scale(1.002)';
        });

        window.addEventListener('mouseleave', () => {
            window.style.transform = 'scale(1)';
        });
    }

    // ウィンドウコントロールボタンのスタイル
    styleWindowControls(controls) {
        controls.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    // MacOS風のウィンドウアニメーション
    animateWindowOpen(window) {
        window.style.transform = 'scale(0.95)';
        window.style.opacity = '0';

        requestAnimationFrame(() => {
            window.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        });
    }

    // MacOS風のウィンドウクローズアニメーション
    animateWindowClose(window) {
        window.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        window.style.transform = 'scale(0.95)';
        window.style.opacity = '0';

        window.addEventListener('transitionend', () => {
            window.remove();
        }, { once: true });
    }

    // タスクバーのホバーエフェクト
    styleTaskbarItems() {
        const taskbarItems = document.querySelectorAll('.taskbar-item');
        taskbarItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                item.style.transform = 'scale(1.05)';
            });

            item.addEventListener('mouseout', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    // スタートメニューのアニメーション
    animateStartMenu(startMenu, show) {
        startMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (show) {
            startMenu.classList.remove('hidden');
            requestAnimationFrame(() => {
                startMenu.style.transform = 'translateY(0)';
                startMenu.style.opacity = '1';
            });
        } else {
            startMenu.style.transform = 'translateY(10px)';
            startMenu.style.opacity = '0';
            startMenu.addEventListener('transitionend', () => {
                startMenu.classList.add('hidden');
            }, { once: true });
        }
    }
}

// グローバルなMacシステムのインスタンスを作成
const macSystem = new MacSystem();