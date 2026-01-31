// Audio Management
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.initSounds();
    }

    initSounds() {
        // Create simple audio using Web Audio API
        this.context = null;
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Play a simple beep tone
    playTone(frequency = 440, duration = 0.2, type = 'sine') {
        if (!this.enabled || !this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume * 0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    // Play success sound
    playSuccess() {
        this.playTone(523.25, 0.15, 'sine'); // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 200); // G5
    }

    // Play click sound
    playClick() {
        this.playTone(800, 0.05, 'square');
    }

    // Play healing sound
    playHeal() {
        this.playTone(440, 0.1, 'sine');
        setTimeout(() => this.playTone(554.37, 0.1, 'sine'), 80);
        setTimeout(() => this.playTone(659.25, 0.2, 'sine'), 160);
    }

    // Play sad sound
    playSad() {
        this.playTone(220, 0.4, 'triangle');
    }

    // Play happy sound
    playHappy() {
        this.playTone(523.25, 0.1, 'sine');
        setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(783.99, 0.1, 'sine'), 200);
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine'), 300);
    }

    // Enable/disable audio
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // Set volume (0-1)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

const audioManager = new AudioManager();
