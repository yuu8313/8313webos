class MainManager {
    constructor() {
        this.initManagers();
        this.initButtons();
    }

    initManagers() {
        window.husenManager = new HusenManager();
        window.systemManager = new SystemManager();
        window.commandManager = new CommandManager();
        window.contextMenuManager = new ContextMenuManager();
    }

    initButtons() {
        document.getElementById('newNote').addEventListener('click', () => {
            window.husenManager.createNote();
        });

        document.getElementById('saveNotes').addEventListener('click', () => {
            window.systemManager.saveNotes();
        });
    }
}