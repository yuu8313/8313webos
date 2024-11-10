class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooped = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    initializeElements() {
        // DOM elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.loopBtn = document.getElementById('loopBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.speedSelect = document.getElementById('speedSelect');
        this.pitchSlider = document.getElementById('pitchSlider');
        this.progress = document.getElementById('progress');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.durationSpan = document.getElementById('duration');
        this.playlistElement = document.getElementById('playlist');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
    }

    setupEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('drag-over');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        this.fileInput.addEventListener('change', () => {
            this.handleFiles(this.fileInput.files);
        });

        // Playback control events
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.loopBtn.addEventListener('click', () => this.toggleLoop());

        // Audio control events
        this.volumeSlider.addEventListener('input', () => {
            this.audio.volume = this.volumeSlider.value / 100;
            this.showNotification(`音量: ${this.volumeSlider.value}%`);
        });

        this.speedSelect.addEventListener('change', () => {
            this.audio.playbackRate = parseFloat(this.speedSelect.value);
            this.showNotification(`再生速度: ${this.speedSelect.value}x`);
        });

        this.pitchSlider.addEventListener('input', () => {
            // Note: Real pitch shifting would require Web Audio API
            this.showNotification(`ピッチ: ${this.pitchSlider.value}`);
        });

        // Progress bar events
        this.progress.parentElement.addEventListener('click', (e) => {
            const rect = this.progress.parentElement.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    this.audio.currentTime -= 5;
                    break;
                case 'ArrowRight':
                    this.audio.currentTime += 5;
                    break;
                case 'ArrowUp':
                    this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 5);
                    this.audio.volume = this.volumeSlider.value / 100;
                    break;
                case 'ArrowDown':
                    this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 5);
                    this.audio.volume = this.volumeSlider.value / 100;
                    break;
            }
        });
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('audio/')) {
                const track = {
                    file: file,
                    name: file.name,
                    artist: 'Unknown Artist'
                };
                this.playlist.push(track);
                this.addToPlaylist(track);
            }
        });

        if (this.playlist.length === files.length) {
            this.showNotification('🎵 音声ファイルを追加しました');
            if (!this.isPlaying) this.playTrack(0);
        }
    }

    addToPlaylist(track) {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.textContent = track.name;
        li.addEventListener('click', () => {
            const index = Array.from(this.playlistElement.children).indexOf(li);
            this.playTrack(index);
        });
        this.playlistElement.appendChild(li);
    }

    playTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrackIndex = index;
            const track = this.playlist[index];
            
            // Update audio source
            const url = URL.createObjectURL(track.file);
            this.audio.src = url;
            this.audio.play();
            this.isPlaying = true;
            
            // Update UI
            this.playBtn.textContent = '⏸️';
            this.trackTitle.textContent = track.name;
            this.trackArtist.textContent = track.artist;
            
            // Update playlist highlighting
            Array.from(this.playlistElement.children).forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            this.showNotification(`🎵 再生中: ${track.name}`);
        }
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
                this.playBtn.textContent = '▶️';
                this.showNotification('⏸️ 一時停止');
            } else {
                this.audio.play();
                this.playBtn.textContent = '⏸️';
                this.showNotification('▶️ 再生');
            }
            this.isPlaying = !this.isPlaying;
        }
    }

    playPrevious() {
        let index = this.currentTrackIndex - 1;
        if (index < 0) index = this.playlist.length - 1;
        this.playTrack(index);
    }

    playNext() {
        let index = this.currentTrackIndex + 1;
        if (index >= this.playlist.length) index = 0;
        this.playTrack(index);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.style.color = this.isShuffled ? '#6c5ce7' : '';
        this.showNotification(this.isShuffled ? '🔀 シャッフル ON' : '🔀 シャッフル OFF');
    }

    toggleLoop() {
        this.isLooped = !this.isLooped;
        this.loopBtn.style.color = this.isLooped ? '#6c5ce7' : '';
        this.showNotification(this.isLooped ? '🔁 ループ ON' : '🔁 ループ OFF');
    }

    handleTrackEnd() {
        if (this.isLooped) {
            this.audio.play();
        } else if (this.isShuffled) {
            const nextIndex = Math.floor(Math.random() * this.playlist.length);
            this.playTrack(nextIndex);
        } else {
            this.playNext();
        }
    }

    updateProgress() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;
        const progress = (currentTime / duration) * 100;
        
        this.progress.style.width = `${progress}%`;
        this.currentTimeSpan.textContent = this.formatTime(currentTime);
        this.durationSpan.textContent = this.formatTime(duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// Initialize the audio player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
});