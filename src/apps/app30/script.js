document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const muteBtn = document.getElementById('muteBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeBar = document.getElementById('volumeBar');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const playbackSpeed = document.getElementById('playbackSpeed');
    const pitchControl = document.getElementById('pitchControl');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const dropZone = document.getElementById('dropZone');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const playlist = document.getElementById('playlist');

    // プレイリストの初期化（ローカルストレージは使用しない）
    let playlistItems = [];

    // 通知システム
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.getElementById('notificationContainer').appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // プレイリスト更新
    function updatePlaylist() {
        playlist.innerHTML = '';
        playlistItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `📺 ${item.name}`;
            li.onclick = () => loadVideo(item.url);
            playlist.appendChild(li);
        });
    }

    // 動画読み込み
    function loadVideo(url) {
        videoPlayer.src = url;
        videoPlayer.load();
        showNotification('🎬 動画を読み込みました');
    }

    // ドラッグ&ドロップ処理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadOverlay.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => {
        uploadOverlay.classList.remove('active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadOverlay.classList.remove('active');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            playlistItems.push({ name: file.name, url: url });
            updatePlaylist();
            loadVideo(url);
        } else {
            showNotification('⚠️ 対応していないファイル形式です');
        }
    });

    // 基本的な制御
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.textContent = '⏸️';
            showNotification('▶️ 再生開始');
        } else {
            videoPlayer.pause();
            playPauseBtn.textContent = '▶️';
            showNotification('⏸️ 一時停止');
        }
    });

    stopBtn.addEventListener('click', () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        playPauseBtn.textContent = '▶️';
        showNotification('⏹️ 停止');
    });

    // 音量制御
    muteBtn.addEventListener('click', () => {
        videoPlayer.muted = !videoPlayer.muted;
        muteBtn.textContent = videoPlayer.muted ? '🔇' : '🔊';
        showNotification(videoPlayer.muted ? '🔇 ミュート' : '🔊 ミュート解除');
    });

    volumeBar.addEventListener('input', () => {
        videoPlayer.volume = volumeBar.value;
        videoPlayer.muted = false;
        muteBtn.textContent = '🔊';
    });

    // シークバー制御
    videoPlayer.addEventListener('loadedmetadata', () => {
        seekBar.max = videoPlayer.duration;
        durationSpan.textContent = formatTime(videoPlayer.duration);
    });

    videoPlayer.addEventListener('timeupdate', () => {
        seekBar.value = videoPlayer.currentTime;
        currentTimeSpan.textContent = formatTime(videoPlayer.currentTime);
    });

    seekBar.addEventListener('input', () => {
        videoPlayer.currentTime = seekBar.value;
    });

    // 再生速度とピッチ制御
    playbackSpeed.addEventListener('change', () => {
        videoPlayer.playbackRate = playbackSpeed.value;
        showNotification(`🏃 再生速度: ${playbackSpeed.value}x`);
    });

    pitchControl.addEventListener('input', () => {
        // Web Audio APIを使用したピッチ制御の実装
        showNotification(`🎵 ピッチ: ${pitchControl.value}`);
    });

    // フルスクリーン制御
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen();
            showNotification('📺 フルスクリーンモード');
        } else {
            document.exitFullscreen();
            showNotification('📺 通常画面モード');
        }
    });

    // テーマ切替
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        showNotification(
            document.body.classList.contains('light-theme') 
                ? '☀️ ライトモード' 
                : '🌙 ダークモード'
        );
    });

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                playPauseBtn.click();
                break;
            case 'f':
            case 'F':
                fullscreenBtn.click();
                break;
            case 'm':
            case 'M':
                muteBtn.click();
                break;
            case 'ArrowRight':
                videoPlayer.currentTime += 10;
                showNotification('⏩ 10秒進みました');
                break;
            case 'ArrowLeft':
                videoPlayer.currentTime -= 10;
                showNotification('⏪ 10秒戻りました');
                break;
        }
    });

    // 時間フォーマット
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // 初期通知
    showNotification('👋 ようこそ！動画をドラッグ&ドロップしてください');
});
