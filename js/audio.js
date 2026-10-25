/**
 * HEMA Timer - Audio Engine (Web Audio API)
 * Synthesizes warning countdown beeps and phase-change chimes without external audio assets.
 * Zero latency, works offline, mobile compatible.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.8;
    }

    /**
     * Initializes or resumes the AudioContext on user interaction.
     * Required by iOS/Android browser autoplay policies.
     */
    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
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
    }

    /**
     * Short warning beep (used at 5, 4, 3, 2, 1 seconds before phase end)
     * Frequency: 880Hz (A5), Duration: 120ms
     */
    playWarningBeep(secondsLeft = 5) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Slightly higher pitch for the last 3 seconds
        osc.type = 'sine';
        osc.frequency.setValueAtTime(secondsLeft <= 3 ? 987.77 : 880, now); // B5 or A5

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.7, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
    }

    /**
     * Distinct sound signal when a new phase starts.
     * Plays a resonant dual-tone gong / horn.
     */
    playPhaseChangeBeep(phase = 'work') {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        if (phase === 'work') {
            // High triumphant chord for battle/work start (e.g. Major chord arpeggio)
            this._playTone(523.25, now, 0.35, 0.8, 'triangle');       // C5
            this._playTone(659.25, now + 0.08, 0.4, 0.8, 'triangle');  // E5
            this._playTone(1046.50, now + 0.16, 0.65, 0.9, 'sine');    // C6
        } else if (phase === 'rest') {
            // Calm, low resonant gong for recovery/rest
            this._playTone(440.00, now, 0.3, 0.7, 'sine');            // A4
            this._playTone(329.63, now + 0.12, 0.7, 0.8, 'triangle');  // E4
        } else {
            // General bell / prep
            this._playTone(880, now, 0.4, 0.8, 'sine');
        }
    }

    _playTone(frequency, startTime, duration, volumeFactor = 1, type = 'sine') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        const targetVol = this.masterVolume * volumeFactor;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(targetVol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }
}

// Export singleton instance
window.soundEngine = new SoundEngine();
