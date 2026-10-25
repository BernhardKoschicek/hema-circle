/**
 * HEMA Timer - Main Application Controller
 * Handles UI interactions, state synchronization, events, shortcuts & persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const displayTime = document.getElementById('display-time');
    const displayPhase = document.getElementById('display-phase');
    const displayRound = document.getElementById('display-round');
    const nextPhaseInfo = document.getElementById('next-phase-info');
    const nextPhaseName = document.getElementById('next-phase-name');
    const progressBar = document.getElementById('progress-bar');
    const warningFlash = document.getElementById('warning-flash');

    const btnPrimary = document.getElementById('btn-primary');
    const btnPrimaryText = document.getElementById('btn-primary-text');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const btnSkip = document.getElementById('btn-skip');
    const btnReset = document.getElementById('btn-reset');

    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const iconSoundOn = document.getElementById('icon-sound-on');
    const iconSoundOff = document.getElementById('icon-sound-off');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const iconFsEnter = document.getElementById('icon-fs-enter');
    const iconFsExit = document.getElementById('icon-fs-exit');

    const btnSettingsToggle = document.getElementById('btn-settings-toggle');
    const btnSettingsClose = document.getElementById('btn-settings-close');
    const settingsDrawer = document.getElementById('settings-drawer');
    const btnApplySettings = document.getElementById('btn-apply-settings');
    const presetChips = document.querySelectorAll('.btn-chip');

    // Input Fields
    const inputWorkMin = document.getElementById('input-work-min');
    const inputWorkSec = document.getElementById('input-work-sec');
    const inputRestMin = document.getElementById('input-rest-min');
    const inputRestSec = document.getElementById('input-rest-sec');
    const inputPrepSec = document.getElementById('input-prep-sec');
    const inputRounds = document.getElementById('input-rounds');

    // Instances
    const timer = new CircuitTimer();
    const sound = window.soundEngine;
    const wakeLock = window.wakeLockManager;

    // Local Storage Keys
    const STORAGE_KEY = 'hema_circuit_timer_cfg';

    /**
     * Load settings from localStorage or defaults
     */
    function loadSavedSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const cfg = JSON.parse(raw);
                if (cfg.workMin !== undefined) inputWorkMin.value = cfg.workMin;
                if (cfg.workSec !== undefined) inputWorkSec.value = cfg.workSec;
                if (cfg.restMin !== undefined) inputRestMin.value = cfg.restMin;
                if (cfg.restSec !== undefined) inputRestSec.value = cfg.restSec;
                if (cfg.prepSec !== undefined) inputPrepSec.value = cfg.prepSec;
                if (cfg.rounds !== undefined) inputRounds.value = cfg.rounds;
                if (cfg.isMuted !== undefined) {
                    setSoundMuted(cfg.isMuted);
                }
            }
        } catch (e) {
            console.warn('Could not load settings from localStorage', e);
        }
    }

    function saveSettings() {
        try {
            const cfg = {
                workMin: parseInt(inputWorkMin.value, 10) || 0,
                workSec: parseInt(inputWorkSec.value, 10) || 0,
                restMin: parseInt(inputRestMin.value, 10) || 0,
                restSec: parseInt(inputRestSec.value, 10) || 0,
                prepSec: parseInt(inputPrepSec.value, 10) || 0,
                rounds: parseInt(inputRounds.value, 10) || 0,
                isMuted: sound.isMuted
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch (e) {
            console.warn('Could not save settings to localStorage', e);
        }
    }

    /**
     * Read form inputs and configure the timer instance
     */
    function applyConfiguration() {
        const workSec = (parseInt(inputWorkMin.value, 10) || 0) * 60 + (parseInt(inputWorkSec.value, 10) || 0);
        const restSec = (parseInt(inputRestMin.value, 10) || 0) * 60 + (parseInt(inputRestSec.value, 10) || 0);
        const prepSec = parseInt(inputPrepSec.value, 10) || 0;
        const totalRounds = parseInt(inputRounds.value, 10) || 0;

        timer.configure({
            workSeconds: Math.max(1, workSec),
            restSeconds: Math.max(0, restSec),
            prepSeconds: Math.max(0, prepSec),
            totalRounds: Math.max(0, totalRounds)
        });

        saveSettings();
        updateNextPhasePreview();
    }

    /**
     * Format seconds into MM:SS string
     */
    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * Update Next Phase Preview text
     */
    function updateNextPhasePreview() {
        const restSec = (parseInt(inputRestMin.value, 10) || 0) * 60 + (parseInt(inputRestSec.value, 10) || 0);
        const workSec = (parseInt(inputWorkMin.value, 10) || 0) * 60 + (parseInt(inputWorkSec.value, 10) || 0);

        if (timer.state === 'PREP') {
            nextPhaseName.textContent = `Aktiv (${formatTime(workSec)})`;
        } else if (timer.state === 'WORK') {
            if (restSec > 0) {
                nextPhaseName.textContent = `Pause (${formatTime(restSec)})`;
            } else {
                nextPhaseName.textContent = `Nächste Runde (${formatTime(workSec)})`;
            }
        } else if (timer.state === 'REST') {
            nextPhaseName.textContent = `Aktiv (${formatTime(workSec)})`;
        } else {
            nextPhaseName.textContent = `Pause (${formatTime(restSec)})`;
        }
    }

    /**
     * Update UI theme styling according to current phase
     */
    function updateTheme(phase, subPhase) {
        body.className = '';
        const effectivePhase = phase === 'PAUSED' ? subPhase : phase;

        switch (phase) {
            case 'IDLE':
                body.classList.add('theme-idle');
                displayPhase.textContent = 'BEREIT';
                break;
            case 'PREP':
                body.classList.add('theme-prep');
                displayPhase.textContent = 'VORBEREITUNG';
                break;
            case 'WORK':
                body.classList.add('theme-work');
                displayPhase.textContent = 'AKTIV';
                break;
            case 'REST':
                body.classList.add('theme-rest');
                displayPhase.textContent = 'PAUSE';
                break;
            case 'PAUSED':
                body.classList.add('theme-paused');
                displayPhase.textContent = 'PAUSIERT';
                break;
            case 'COMPLETE':
                body.classList.add('theme-complete');
                displayPhase.textContent = 'FERTIG';
                break;
        }

        // Toggle primary button state
        if (phase === 'WORK' || phase === 'REST' || phase === 'PREP') {
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
            btnPrimaryText.textContent = 'PAUSE';
        } else if (phase === 'PAUSED') {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            btnPrimaryText.textContent = 'WEITER';
        } else {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            btnPrimaryText.textContent = 'START';
        }
    }

    // -------------------------------------------------------------------------
    // Timer Engine Callbacks
    // -------------------------------------------------------------------------
    timer.onTick = ({ phase, subPhase, remainingSeconds, totalSeconds, progress, round, totalRounds }) => {
        displayTime.textContent = formatTime(remainingSeconds);
        progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;

        // Update round info
        if (totalRounds > 0) {
            displayRound.textContent = `Runde ${round} / ${totalRounds}`;
        } else {
            displayRound.textContent = `Runde ${round}`;
        }

        updateTheme(phase, subPhase);
        updateNextPhasePreview();

        // Remove warning pulse if above 5 seconds
        if (remainingSeconds > 5 || phase === 'PAUSED' || phase === 'IDLE') {
            displayTime.classList.remove('warning-pulse');
            warningFlash.classList.remove('active');
        }
    };

    timer.onWarning = (secondsLeft) => {
        // Trigger beep sound
        sound.playWarningBeep(secondsLeft);

        // Visual flash & pulse effect
        displayTime.classList.add('warning-pulse');
        warningFlash.classList.add('active');
        setTimeout(() => warningFlash.classList.remove('active'), 250);
    };

    timer.onPhaseChange = (newPhase, round) => {
        displayTime.classList.remove('warning-pulse');
        warningFlash.classList.remove('active');

        // Play phase transition audio
        if (newPhase === 'WORK') {
            sound.playPhaseChangeBeep('work');
        } else if (newPhase === 'REST') {
            sound.playPhaseChangeBeep('rest');
        } else if (newPhase === 'PREP') {
            sound.playPhaseChangeBeep('prep');
        }
    };

    timer.onComplete = () => {
        displayTime.classList.remove('warning-pulse');
        sound.playPhaseChangeBeep('work'); // Celebration signal
        wakeLock.releaseLock();
    };

    // -------------------------------------------------------------------------
    // User Control Actions
    // -------------------------------------------------------------------------
    function handlePrimaryAction() {
        sound.init(); // Initialize audio context on click
        
        if (timer.state === 'IDLE') {
            wakeLock.requestLock();
            timer.start();
        } else if (timer.state === 'PAUSED') {
            wakeLock.requestLock();
            timer.resume();
        } else if (timer.state === 'WORK' || timer.state === 'REST' || timer.state === 'PREP') {
            timer.pause();
        } else if (timer.state === 'COMPLETE') {
            timer.reset();
            wakeLock.requestLock();
            timer.start();
        }
    }

    function handleSkip() {
        sound.init();
        timer.skip();
    }

    function handleReset() {
        timer.reset();
        wakeLock.releaseLock();
        displayTime.classList.remove('warning-pulse');
        warningFlash.classList.remove('active');
    }

    function setSoundMuted(muted) {
        sound.setMuted(muted);
        if (sound.isMuted) {
            iconSoundOn.classList.add('hidden');
            iconSoundOff.classList.remove('hidden');
        } else {
            iconSoundOn.classList.remove('hidden');
            iconSoundOff.classList.add('hidden');
        }
        saveSettings();
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            iconFsEnter.classList.add('hidden');
            iconFsExit.classList.remove('hidden');
        } else {
            document.exitFullscreen().catch(() => {});
            iconFsEnter.classList.remove('hidden');
            iconFsExit.classList.add('hidden');
        }
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            iconFsEnter.classList.remove('hidden');
            iconFsExit.classList.add('hidden');
        } else {
            iconFsEnter.classList.add('hidden');
            iconFsExit.classList.remove('hidden');
        }
    });

    // -------------------------------------------------------------------------
    // Event Listeners: Buttons
    // -------------------------------------------------------------------------
    btnPrimary.addEventListener('click', handlePrimaryAction);
    btnSkip.addEventListener('click', handleSkip);
    btnReset.addEventListener('click', handleReset);

    btnSoundToggle.addEventListener('click', () => {
        sound.init();
        setSoundMuted(!sound.isMuted);
    });

    btnFullscreen.addEventListener('click', toggleFullscreen);

    // Settings Drawer
    function openSettings() {
        settingsDrawer.classList.add('open');
    }

    function closeSettings() {
        settingsDrawer.classList.remove('open');
        applyConfiguration();
    }

    btnSettingsToggle.addEventListener('click', () => {
        if (settingsDrawer.classList.contains('open')) {
            closeSettings();
        } else {
            openSettings();
        }
    });

    btnSettingsClose.addEventListener('click', closeSettings);
    btnApplySettings.addEventListener('click', closeSettings);

    // Preset Chips
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            inputWorkMin.value = chip.dataset.workM;
            inputWorkSec.value = chip.dataset.workS;
            inputRestMin.value = chip.dataset.restM;
            inputRestSec.value = chip.dataset.restS;

            applyConfiguration();
        });
    });

    // Inputs Change
    [inputWorkMin, inputWorkSec, inputRestMin, inputRestSec, inputPrepSec, inputRounds].forEach(input => {
        input.addEventListener('change', () => {
            presetChips.forEach(c => c.classList.remove('active'));
            applyConfiguration();
        });
    });

    // -------------------------------------------------------------------------
    // Keyboard Shortcuts
    // -------------------------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        // Ignore if user is currently typing in an input
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            if (e.key === 'Escape' || e.key === 'Enter') {
                document.activeElement.blur();
                closeSettings();
            }
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                handlePrimaryAction();
                break;
            case 'KeyS':
            case 'ArrowRight':
                e.preventDefault();
                handleSkip();
                break;
            case 'KeyR':
                e.preventDefault();
                handleReset();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                setSoundMuted(!sound.isMuted);
                break;
            case 'Escape':
                if (settingsDrawer.classList.contains('open')) {
                    closeSettings();
                }
                break;
        }
    });

    // Initialize application
    loadSavedSettings();
    applyConfiguration();
});
