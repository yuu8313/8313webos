class CommandManager {
    constructor() {
        this.initShortcuts();
    }

    initShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.ql-editor')) {
                if (e.ctrlKey && e.key.toLowerCase() === 'a') {
                    return;
                }
                return; 
            }

            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'n':
                        e.preventDefault();
                        window.husenManager.createNote();
                        break;
                    case 's':
                        e.preventDefault();
                        window.systemManager.saveNotes();
                        break;
                    case 'a':
                        e.preventDefault();
                        break;
                }
            }
        });
    }
}