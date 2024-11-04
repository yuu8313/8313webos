document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const volumeSlider = document.querySelector('.volume-slider');
    const speedSelect = document.querySelector('.speed-select');
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const errorMessage = document.getElementById('errorMessage');
    const playlist = document.getElementById('playlist');

    let videos = [];

    // ドラッグ&ドロップハンドリング
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('video/')) {
            const videoUrl = URL.createObjectURL(file);
            videos.push({ 
                name: file.name, 
                url: videoUrl
            });
            updatePlaylist();
            loadVideo(videoUrl);
        } else {
            showError('対応していないファイル形式です');
        }
    });

    // 再生コントロール
    playPauseBtn.addEventListener('click', togglePlay);
    stopBtn.addEventListener('click', stopVideo);
    muteBtn.addEventListener('click', toggleMute);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    volumeSlider.addEventListener('input', updateVolume);
    speedSelect.addEventListener('change', updatePlaybackSpeed);

    // プログレスバー
    videoPlayer.addEventListener('timeupdate', updateProgress);
    progress.addEventListener('click', seek);

    function togglePlay() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.textContent = '⏸';
        } else {
            videoPlayer.pause();
            playPauseBtn.textContent = '▶';
        }
    }

    function stopVideo() {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        playPauseBtn.textContent = '▶';
    }

    function toggleMute() {
        videoPlayer.muted = !videoPlayer.muted;
        muteBtn.textContent = videoPlayer.muted ? '🔇' : '🔊';
    }

    function updateVolume() {
        videoPlayer.volume = volumeSlider.value;
        videoPlayer.muted = false;
        muteBtn.textContent = '🔊';
    }

    function updatePlaybackSpeed() {
        videoPlayer.playbackRate = parseFloat(speedSelect.value);
    }

    function updateProgress() {
        const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function seek(e) {
        const rect = progress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoPlayer.currentTime = pos * videoPlayer.duration;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function loadVideo(url) {
        videoPlayer.src = url;
        videoPlayer.load();
        errorMessage.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function updatePlaylist() {
        playlist.innerHTML = '<h3>プレイリスト</h3>';
        videos.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = video.name;
            nameSpan.onclick = () => loadVideo(video.url);
            
            const controls = document.createElement('div');
            controls.className = 'playlist-item-controls';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '⋮';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm('このアイテムを削除しますか？')) {
                    videos.splice(index, 1);
                    updatePlaylist();
                }
            };
            
            controls.appendChild(deleteBtn);
            item.appendChild(nameSpan);
            item.appendChild(controls);
            playlist.appendChild(item);
        });
    }

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowLeft') {
            videoPlayer.currentTime -= 5;
        } else if (e.code === 'ArrowRight') {
            videoPlayer.currentTime += 5;
        } else if (e.code === 'ArrowUp') {
            videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
            volumeSlider.value = videoPlayer.volume;
        } else if (e.code === 'ArrowDown') {
            videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
            volumeSlider.value = videoPlayer.volume;
        }
    });
});