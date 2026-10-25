/**
 * HEMA Timer - Audio Engine (Web Audio API)
 * Synthesizes high-impact, piercing countdown buzzers and resonant phase-change gongs.
 * Features Dynamics Compression to cut cleanly through Spotify music and Fechtsaal echoes.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.compressor = null;
        this.masterGain = null;
        this.isMuted = false;
        this.masterVolume = 1.0; // Max volume for gym environment
    }

    /**
     * Initializes the AudioContext and Compressor graph on user interaction.
     */
    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();

                // Master compressor to boost perceived loudness and prevent clipping
                this.compressor = this.ctx.createDynamicsCompressor();
                this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
                this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
                this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
                this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
                this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

                // Master Gain
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

                this.compressor.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);
            }
        }

        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.isMuted = !!muted;
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    /**
     * Piercing countdown warning beep (5, 4, 3, 2, 1s before phase end)
     * Dual-oscillator (fundamental + octave) with square/triangle mix.
     * Cuts cleanly through Spotify music even at low volume!
     */
    playWarningBeep(secondsLeft = 5) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.compressor) return;

        const now = this.ctx.currentTime;
        const isFinalCountdown = secondsLeft <= 3;
        const freq = isFinalCountdown ? 1046.50 : 880; // C6 or A5

        // Oscillator 1: Triangle for body
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);

        // Oscillator 2: Square wave with lowpass filter for piercing presence (like a digital sports buzzer)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc1.connect(gain);
        osc2.connect(filter);
        filter.connect(gain);

        gain.connect(this.compressor);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
    }

    /**
     * Distinct halfway chime (for partner / role rotation)
     * Plays a crisp high double-strike (blade contact simulation)
     */
    playHalfwayBeep() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.compressor) return;

        const now = this.ctx.currentTime;
        // Strike 1
        this._playRichBuzzer(880.00, now, 0.1, 0.9);
        // Strike 2
        this._playRichBuzzer(1318.51, now + 0.12, 0.25, 1.0);
    }

    /**
     * High-energy phase transition signal (Work vs Rest)
     */
    playPhaseChangeBeep(phase = 'work') {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.compressor) return;

        const now = this.ctx.currentTime;

        if (phase === 'work') {
            // Triumphant boxing horn / battle call
            this._playRichBuzzer(587.33, now, 0.25, 1.0);        // D5
            this._playRichBuzzer(880.00, now + 0.1, 0.25, 1.0);  // A5
            this._playRichBuzzer(1174.66, now + 0.2, 0.6, 1.0);  // D6 (high ringing note)
        } else if (phase === 'rest') {
            // Lower, calm recovery gong with long warm chime
            this._playRichBuzzer(523.25, now, 0.3, 0.9);         // C5
            this._playRichBuzzer(392.00, now + 0.15, 0.7, 0.9);  // G4
        } else {
            // Generic chime
            this._playRichBuzzer(880.00, now, 0.4, 0.9);
        }
    }

    _playRichBuzzer(frequency, startTime, duration, volume = 1.0) {
        const osc = this.ctx.createOscillator();
        const sub = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, startTime);

        sub.type = 'sine';
        sub.frequency.setValueAtTime(frequency / 2, startTime); // sub-bass weight

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        sub.connect(gain);
        gain.connect(this.compressor);

        osc.start(startTime);
        sub.start(startTime);
        osc.stop(startTime + duration + 0.05);
        sub.stop(startTime + duration + 0.05);
    }

    /**
     * Test beep for volume verification in settings
     */
    testBeep() {
        this.init();
        this.playWarningBeep(1);
    }
}

// Export singleton instance
window.soundEngine = new SoundEngine();
