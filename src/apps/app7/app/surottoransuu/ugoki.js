class SlotMachine {
    constructor() {
        this.minInput = document.getElementById('min');
        this.maxInput = document.getElementById('max');
        this.generateBtn = document.getElementById('generate');
        this.slots = Array.from({ length: 4 }, (_, i) => document.getElementById(`slot${i + 1}`));
        this.notification = document.getElementById('notification');
        this.isSpinning = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.minInput.addEventListener('input', () => this.validateInputs());
        this.maxInput.addEventListener('input', () => this.validateInputs());
    }

    validateInputs() {
        let min = parseInt(this.minInput.value);
        let max = parseInt(this.maxInput.value);

        if (min > max) {
            this.showNotification('最小値は最大値より小さくしてください');
            this.generateBtn.disabled = true;
            return false;
        }

        if (min < 0 || max > 9999) {
            this.showNotification('0から9999の範囲で入力してください');
            this.generateBtn.disabled = true;
            return false;
        }

        this.generateBtn.disabled = false;
        return true;
    }

    async generate() {
        if (this.isSpinning || !this.validateInputs()) return;

        this.isSpinning = true;
        this.generateBtn.disabled = true;

        const min = parseInt(this.minInput.value);
        const max = parseInt(this.maxInput.value);
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        const resultString = result.toString().padStart(4, '0');

        await this.spinAnimation(resultString);
        
        this.showNotification('数字が生成されました！');
        this.isSpinning = false;
        this.generateBtn.disabled = false;
    }

    async spinAnimation(finalNumber) {
        const spinDuration = 2000; // 2秒
        const fps = 60;
        const frames = spinDuration / (1000 / fps);
        
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.spinDigit(i, finalNumber[i], frames);
                this.triggerConfetti();
            }, i * 500);
        }
    }

    async spinDigit(index, finalDigit, frames) {
        let frame = 0;
        const slot = this.slots[index];
        
        const animation = setInterval(() => {
            if (frame >= frames) {
                clearInterval(animation);
                slot.textContent = finalDigit;
                return;
            }

            slot.textContent = Math.floor(Math.random() * 10);
            frame++;
        }, 1000 / 60);
    }

    triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0 }
        });
    }

    showNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the slot machine
new SlotMachine();