class WindowManager {
    static windows = new Set();
    static zIndex = 100;

    static createWindow(app) {
        const window = document.createElement('div');
        window.className = 'window';
        window.style.zIndex = ++this.zIndex;
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">${app.name}</div>
                <div class="window-controls">
                    <button class="window-button minimize"></button>
                    <button class="window-button maximize"></button>
                    <button class="window-button close"></button>
                </div>
            </div>
            <div class="window-content">
                <iframe src="${app.path}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;

        window.style.left = '50%';
        window.style.top = '50%';
        window.style.transform = 'translate(-50%, -50%)';

        document.getElementById('desktop').appendChild(window);
        this.windows.add(window);

        this.setupWindowControls(window, app);
        this.makeWindowDraggable(window);
        this.makeWindowResizable(window);

        DockManager.addIcon(app);

        return window;
    }

    static setupWindowControls(window, app) {
        const controls = window.querySelector('.window-controls');
        const minimize = controls.querySelector('.minimize');
        const maximize = controls.querySelector('.maximize');
        const close = controls.querySelector('.close');

        minimize.onclick = () => {
            window.style.display = 'none';
        };

        maximize.onclick = () => {
            if (window.style.width === '100vw') {
                window.style.width = '';
                window.style.height = '';
                window.style.top = '50%';
                window.style.left = '50%';
                window.style.transform = 'translate(-50%, -50%)';
            } else {
                window.style.width = '100vw';
                window.style.height = '100vh';
                window.style.top = '0';
                window.style.left = '0';
                window.style.transform = 'none';
            }
        };

        close.onclick = () => {
            window.remove();
            this.windows.delete(window);
            DockManager.removeIcon(app);
        };

        window.addEventListener('mousedown', () => {
            window.style.zIndex = ++this.zIndex;
        });
    }

    static makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.classList.contains('window-button')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            window.style.top = (window.offsetTop - pos2) + "px";
            window.style.left = (window.offsetLeft - pos1) + "px";
            window.style.transform = 'none';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    static makeWindowResizable(window) {
        const minWidth = 300;
        const minHeight = 200;
        const resizeArea = 8;

        window.addEventListener('mousemove', (e) => {
            const rect = window.getBoundingClientRect();
            const isRight = e.clientX > rect.right - resizeArea;
            const isBottom = e.clientY > rect.bottom - resizeArea;
            
            if (isRight && isBottom) window.style.cursor = 'se-resize';
            else if (isRight) window.style.cursor = 'e-resize';
            else if (isBottom) window.style.cursor = 's-resize';
            else window.style.cursor = 'default';
        });

        window.addEventListener('mousedown', (e) => {
            const rect = window.getBoundingClientRect();
            const isRight = e.clientX > rect.right - resizeArea;
            const isBottom = e.clientY > rect.bottom - resizeArea;

            if (!isRight && !isBottom) return;

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(window.offsetWidth, 10);
            const startHeight = parseInt(window.offsetHeight, 10);

            const resize = (e) => {
                if (isRight) {
                    const width = Math.max(startWidth + e.clientX - startX, minWidth);
                    window.style.width = width + 'px';
                }
                if (isBottom) {
                    const height = Math.max(startHeight + e.clientY - startY, minHeight);
                    window.style.height = height + 'px';
                }
            };

            const stopResize = () => {
                window.style.cursor = 'default';
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            };

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });
    }
}