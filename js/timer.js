/**
 * HEMA Timer - Core Timer Engine
 * High-precision, drift-free interval timer based on system timestamps.
 */

class CircuitTimer {
    constructor() {
        this.config = {
            workSeconds: 120, // 2 minutes
            restSeconds: 30,  // 30 seconds
            prepSeconds: 5,   // 5 seconds get-ready
            totalRounds: 0    // 0 = infinite / open-ended
        };

        this.state = 'IDLE'; // IDLE, PREP, WORK, REST, PAUSED, COMPLETE
        this.previousState = null; // Used during pause
        this.currentRound = 1;

        this.phaseEndTime = 0;
        this.pausedRemainingMs = 0;
        this.phaseTotalMs = 0;

        this.intervalId = null;
        this.lastWarningSecond = -1;

        // Callbacks
        this.onTick = null;          // ({ phase, remainingSeconds, totalSeconds, progress, round, totalRounds })
        this.onWarning = null;       // (secondsLeft)
        this.onPhaseChange = null;   // (newPhase, round)
        this.onComplete = null;      // ()
    }

    configure(options = {}) {
        if (options.workSeconds !== undefined) this.config.workSeconds = Math.max(1, parseInt(options.workSeconds, 10));
        if (options.restSeconds !== undefined) this.config.restSeconds = Math.max(0, parseInt(options.restSeconds, 10));
        if (options.prepSeconds !== undefined) this.config.prepSeconds = Math.max(0, parseInt(options.prepSeconds, 10));
        if (options.totalRounds !== undefined) this.config.totalRounds = Math.max(0, parseInt(options.totalRounds, 10));

        if (this.state === 'IDLE') {
            this._notifyTick(this.config.workSeconds, this.config.workSeconds, 'IDLE');
        }
    }

    start() {
        if (this.state !== 'IDLE') return;

        this.currentRound = 1;
        this.lastWarningSecond = -1;

        if (this.config.prepSeconds > 0) {
            this._enterPhase('PREP', this.config.prepSeconds);
        } else {
            this._enterPhase('WORK', this.config.workSeconds);
        }

        this._startLoop();
    }

    pause() {
        if (this.state === 'PAUSED' || this.state === 'IDLE' || this.state === 'COMPLETE') return;

        this._stopLoop();
        this.pausedRemainingMs = Math.max(0, this.phaseEndTime - Date.now());
        this.previousState = this.state;
        this.state = 'PAUSED';

        const remainingSeconds = Math.ceil(this.pausedRemainingMs / 1000);
        const totalSeconds = Math.round(this.phaseTotalMs / 1000);
        this._notifyTick(remainingSeconds, totalSeconds, 'PAUSED');
    }

    resume() {
        if (this.state !== 'PAUSED') return;

        this.state = this.previousState;
        this.previousState = null;
        this.phaseEndTime = Date.now() + this.pausedRemainingMs;
        this.lastWarningSecond = -1;

        this._startLoop();
        this._tick();
    }

    togglePause() {
        if (this.state === 'PAUSED') {
            this.resume();
        } else if (this.state === 'WORK' || this.state === 'REST' || this.state === 'PREP') {
            this.pause();
        } else if (this.state === 'IDLE') {
            this.start();
        }
    }

    skip() {
        if (this.state === 'IDLE' || this.state === 'COMPLETE') return;

        const wasPaused = (this.state === 'PAUSED');
        const activePhase = wasPaused ? this.previousState : this.state;

        if (activePhase === 'PREP') {
            this._enterPhase('WORK', this.config.workSeconds);
        } else if (activePhase === 'WORK') {
            // Check if rest exists
            if (this.config.restSeconds > 0) {
                this._enterPhase('REST', this.config.restSeconds);
            } else {
                this._advanceRoundOrFinish();
            }
        } else if (activePhase === 'REST') {
            this._advanceRoundOrFinish();
        }

        if (wasPaused && this.state !== 'COMPLETE') {
            // Preserve pause in the newly skipped phase
            this.pausedRemainingMs = this.phaseTotalMs;
            this.previousState = this.state;
            this.state = 'PAUSED';
            this._stopLoop();
            const totalSec = Math.round(this.phaseTotalMs / 1000);
            this._notifyTick(totalSec, totalSec, 'PAUSED');
        } else {
            this._tick();
        }
    }

    reset() {
        this._stopLoop();
        this.state = 'IDLE';
        this.previousState = null;
        this.currentRound = 1;
        this.pausedRemainingMs = 0;
        this.phaseEndTime = 0;
        this.lastWarningSecond = -1;

        this._notifyTick(this.config.workSeconds, this.config.workSeconds, 'IDLE');
    }

    _enterPhase(phase, durationSeconds) {
        this.state = phase;
        this.phaseTotalMs = durationSeconds * 1000;
        this.phaseEndTime = Date.now() + this.phaseTotalMs;
        this.lastWarningSecond = -1;

        if (typeof this.onPhaseChange === 'function') {
            this.onPhaseChange(this.state, this.currentRound);
        }
    }

    _advanceRoundOrFinish() {
        if (this.config.totalRounds > 0 && this.currentRound >= this.config.totalRounds) {
            this._finish();
            return;
        }

        this.currentRound++;
        this._enterPhase('WORK', this.config.workSeconds);
    }

    _finish() {
        this._stopLoop();
        this.state = 'COMPLETE';
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
        this._notifyTick(0, this.config.workSeconds, 'COMPLETE');
    }

    _startLoop() {
        this._stopLoop();
        this.intervalId = setInterval(() => this._tick(), 50);
    }

    _stopLoop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    _tick() {
        if (this.state === 'IDLE' || this.state === 'PAUSED' || this.state === 'COMPLETE') return;

        const remainingMs = Math.max(0, this.phaseEndTime - Date.now());
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const totalSeconds = Math.round(this.phaseTotalMs / 1000);

        // Warning countdown (5, 4, 3, 2, 1 seconds left before transition)
        if (remainingSeconds <= 5 && remainingSeconds > 0 && remainingSeconds !== this.lastWarningSecond) {
            this.lastWarningSecond = remainingSeconds;
            if (typeof this.onWarning === 'function') {
                this.onWarning(remainingSeconds);
            }
        }

        // Phase finished
        if (remainingMs <= 0) {
            if (this.state === 'PREP') {
                this._enterPhase('WORK', this.config.workSeconds);
            } else if (this.state === 'WORK') {
                if (this.config.restSeconds > 0) {
                    this._enterPhase('REST', this.config.restSeconds);
                } else {
                    this._advanceRoundOrFinish();
                }
            } else if (this.state === 'REST') {
                this._advanceRoundOrFinish();
            }
            return;
        }

        this._notifyTick(remainingSeconds, totalSeconds, this.state);
    }

    _notifyTick(remainingSeconds, totalSeconds, phase) {
        if (typeof this.onTick === 'function') {
            const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
            this.onTick({
                phase: phase || this.state,
                subPhase: this.state === 'PAUSED' ? this.previousState : this.state,
                remainingSeconds,
                totalSeconds,
                progress: Math.min(1, Math.max(0, progress)),
                round: this.currentRound,
                totalRounds: this.config.totalRounds
            });
        }
    }
}

window.CircuitTimer = CircuitTimer;
