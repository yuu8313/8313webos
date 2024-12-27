document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const appContainer = document.querySelector('.app-container');
    const mainContent = document.querySelector('.main-content');
    const mobileDeleteBtn = document.getElementById('mobileDeleteBtn');

    // サイドメニュー
    let isMenuOpen = true; // デフォルトで開いた状態

    // 初期状態でサイドバーを表示
    sidebar.classList.add('visible');
    appContainer.classList.add('sidebar-open');
    mainContent.style.width = 'calc(100% - 300px)';
    mainContent.style.marginLeft = '300px';
    
    // アイコンの初期状態を設定
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
    
    // メニュートグルのクリックイベント
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        sidebar.classList.toggle('visible');
        appContainer.classList.toggle('sidebar-open');
        
        // アイコンの切り替え
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');

        // メインコンテンツの幅を調整
        if (isMenuOpen) {
            mainContent.style.width = 'calc(100% - 300px)';
            mainContent.style.marginLeft = '300px';
            document.body.style.overflow = window.innerWidth <= 768 ? 'hidden' : '';
        } else {
            mainContent.style.width = '100%';
            mainContent.style.marginLeft = '0';
            document.body.style.overflow = '';
        }
    });

    // モバイル用削除ボタンのクリックイベント
    mobileDeleteBtn.addEventListener('click', () => {
        if (genzaiNoThread) {
            threadSakujo(genzaiNoThread.id);
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('visible');
                appContainer.classList.remove('sidebar-open');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
                isMenuOpen = false;
                document.body.style.overflow = '';
            }
        }
    });

    // 画面サイズが変更された時の処理
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('visible');
            appContainer.classList.remove('sidebar-open');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
            isMenuOpen = false;
            document.body.style.overflow = '';
            mainContent.style.width = '100%';
            mainContent.style.marginLeft = '0';
        }
    });

    // サイドバー内のクリックイベントの伝播を停止
    sidebar.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // サイドバー外のクリックでサイドバーを閉じる（モバイルのみ）　＜＝ほぼ意味ない
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && isMenuOpen && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('visible');
            appContainer.classList.remove('sidebar-open');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
            isMenuOpen = false;
            document.body.style.overflow = '';
            mainContent.style.width = '100%';
            mainContent.style.marginLeft = '0';
        }
    });
});