class TabManager {
    constructor() {
        this.tabs = [];
        this.currentTab = null;
        this.tabList = document.getElementById('tabList');
        this.addTabButton = document.getElementById('addTab');
        
        this.loadTabs();
        this.setupEventListeners();
    }
    
    loadTabs() {
        const savedTabs = localStorage.getItem(STORAGE_KEYS.TABS);
        if (savedTabs) {
            this.tabs = JSON.parse(savedTabs);
            this.renderTabs();
            
            const currentTab = localStorage.getItem(STORAGE_KEYS.CURRENT_TAB);
            if (currentTab) {
                this.activateTab(parseInt(currentTab));
            }
        }
    }
    
    saveTabs() {
        localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(this.tabs));
        if (this.currentTab !== null) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_TAB, this.currentTab.toString());
        }
    }
    
    createTab(name = '無題') {
        const tab = {
            id: Date.now(),
            name: name,
            content: ''
        };
        
        this.tabs.push(tab);
        this.renderTabs();
        this.activateTab(tab.id);
        this.saveTabs();
        
        return tab;
    }
    
    renderTabs() {
        this.tabList.innerHTML = '';
        
        this.tabs.forEach(tab => {
            const tabElement = document.createElement('div');
            tabElement.className = `tab ${this.currentTab === tab.id ? 'active' : ''}`;
            tabElement.innerHTML = `
                <span class="tab-name">${tab.name}</span>
                <button class="tab-close">×</button>
            `;
            
            tabElement.querySelector('.tab-name').addEventListener('click', () => {
                this.activateTab(tab.id);
            });
            
            tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeTab(tab.id);
            });
            
            this.tabList.appendChild(tabElement);
        });
    }
    
    activateTab(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;
        
        this.currentTab = tabId;
        this.renderTabs();
        
        editor.setValue(tab.content || '');
        editor.clearSelection();
        
        this.saveTabs();
    }
    
    closeTab(tabId) {
        const index = this.tabs.findIndex(t => t.id === tabId);
        if (index === -1) return;
        
        this.tabs.splice(index, 1);
        
        if (this.currentTab === tabId) {
            this.currentTab = this.tabs[index] ? this.tabs[index].id :
                            this.tabs[index - 1] ? this.tabs[index - 1].id : null;
        }
        
        this.renderTabs();
        this.saveTabs();
        
        if (this.currentTab) {
            this.activateTab(this.currentTab);
        } else {
            editor.setValue('');
        }
        
        showNotification('タブを閉じました');
    }
    
    setupEventListeners() {
        this.addTabButton.addEventListener('click', () => {
            this.createTab();
            showNotification('新しいタブを作成しました');
        });
        
        editor.on('change', () => {
            if (this.currentTab) {
                const tab = this.tabs.find(t => t.id === this.currentTab);
                if (tab) {
                    tab.content = editor.getValue();
                    this.saveTabs();
                }
            }
        });
    }
}

// タブマネージャーの初期化
const tabManager = new TabManager();
if (tabManager.tabs.length === 0) {
    tabManager.createTab();
}