class DesktopIconManager {
    static createIcon(app, x, y) {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
        icon.innerHTML = `
            <img src="${app.icon}" alt="${app.name}">
            <span>${app.name}</span>
        `;
        icon.addEventListener('dblclick', () => WindowManager.createWindow(app));
        document.getElementById('desktop').appendChild(icon);
        
        this.makeDraggable(icon);
    }

    static makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
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
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}