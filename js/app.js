/**
 * HEMA Timer - Main Application Controller
 * Handles UI interactions, state synchronization, events, shortcuts, i18n, themes, Spotify & persistence.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // -------------------------------------------------------------------------
    // Translations Dictionary (i18n)
    // -------------------------------------------------------------------------
    const I18N = {
        de: {
            brandTitle: 'HEMA TIMER',
            brandSub: 'Fechtsaal Intervall',
            phaseReady: 'BEREIT',
            phasePrep: 'VORBEREITUNG',
            phaseWork: 'AKTIV',
            phaseRest: 'PAUSE',
            phasePaused: 'PAUSIERT',
            phaseComplete: 'FERTIG',
            roundPrefix: 'Runde',
            nextPhase: 'Nächste Phase',
            nextRoundLabel: 'Nächste Runde',
            workPhaseName: 'Aktiv',
            restPhaseName: 'Pause',
            btnStart: 'START',
            btnPause: 'PAUSE',
            btnResume: 'WEITER',
            btnSkip: 'Skip',
            btnReset: 'Reset',
            settingsTitle: 'Timer Einstellungen',
            themeLabel: 'Farbschema:',
            themeIron: '🛡️ Fechtsaal',
            themeRittersporn: '🍷 Rittersporn',
            themeHighContrast: '☀️ High Contrast',
            presetsLabel: 'HEMA Vorlagen:',
            presetSparring: '2m / 30s (Sparring)',
            presetDrills: '1m / 15s (Drills)',
            presetHiit: '30s / 15s (HIIT)',
            presetMatch: '3m / 1m (Gefecht)',
            cardWork: '⚔️ Aktivphase (Runde)',
            cardRest: '🛡️ Pausephase',
            cardOptions: '⚙️ Optionen',
            unitMin: 'Min',
            unitSec: 'Sek',
            labelPrep: 'Vorbereitungszeit',
            labelRounds: 'Runden (0 = Endlos)',
            unitRounds: 'Runden',
            labelBeepVol: 'Signalton Lautstärke',
            btnTestSound: '🔊 Test',
            btnApply: 'Übernehmen & Schließen',
            hotkeyHint: '⌨️ <strong>Leertaste:</strong> Pause | <strong>S:</strong> Skip | <strong>R:</strong> Reset | <strong>F:</strong> Vollbild | <strong>L:</strong> Sprache | <strong>T:</strong> Schema',
            wakelockActive: '📱 Display aktiv',
            titleSound: 'Ton umschalten',
            titleFullscreen: 'Vollbild',
            titleSettings: 'Einstellungen',
            titleReset: 'Zurücksetzen [Taste R]',
            titleSkip: 'Phase überspringen [Taste S]',
            titleLang: 'Sprache wechseln (Deutsch / English)',
            titleTheme: 'Farbschema wechseln [Taste T]',
            titleQuickShare: 'Training teilen',
            labelHalfwayBeep: 'Halbzeit-Signal (z. B. Rollen-/Partnerwechsel)',
            halfwayNotice: '⚔️ HALBZEIT',
            summaryTitle: 'Training Beendet!',
            summarySub: 'Starke Leistung im Fechtsaal',
            statRoundsLabel: 'Runden',
            statFightTimeLabel: 'Reine Fechtzeit',
            statTotalTimeLabel: 'Gesamtdauer',
            btnShareSession: 'Training teilen',
            btnCloseSummary: 'Schließen',
            shareCopied: 'In Zwischenablage kopiert! 📋',
            spotifyTitle: 'Spotify Connector',
            spotifyNotConnected: 'Spotify verbinden',
            spotifyClickToConnect: 'Klicke für Training Sound',
            btnSpotifyConnect: 'Mit Spotify verbinden',
            btnSpotifyDisconnect: 'Trennen',
            spotifyConnected: 'Verbunden',
            spotifyDisconnected: 'Getrennt',
            spotifyDeviceLabel: 'Ausgabegerät (Spotify Connect):',
            spotifyDuckLevelLabel: 'Musik-Lautstärke beim Countdown (Ducking):',
            spotifySyncToggle: 'Musik mit Timer synchronisieren (Start/Pause)',
            spotifyPauseRestToggle: 'Musik in der Pausephase pausieren',
            spotifyDuckToggle: 'Auto-Ducking (Musik leiser bei 5s Countdown)',
            spotifyRedirectHint: 'Redirect URI für dein Spotify Dashboard:'
        },
        en: {
            brandTitle: 'HEMA TIMER',
            brandSub: 'Sala Interval',
            phaseReady: 'READY',
            phasePrep: 'PREPARE',
            phaseWork: 'WORK',
            phaseRest: 'REST',
            phasePaused: 'PAUSED',
            phaseComplete: 'COMPLETE',
            roundPrefix: 'Round',
            nextPhase: 'Next Phase',
            nextRoundLabel: 'Next Round',
            workPhaseName: 'Work',
            restPhaseName: 'Rest',
            btnStart: 'START',
            btnPause: 'PAUSE',
            btnResume: 'RESUME',
            btnSkip: 'Skip',
            btnReset: 'Reset',
            settingsTitle: 'Timer Settings',
            themeLabel: 'Color Theme:',
            themeIron: '🛡️ Iron Sala',
            themeRittersporn: '🍷 Rittersporn',
            themeHighContrast: '☀️ High Contrast',
            presetsLabel: 'HEMA Presets:',
            presetSparring: '2m / 30s (Sparring)',
            presetDrills: '1m / 15s (Drills)',
            presetHiit: '30s / 15s (HIIT)',
            presetMatch: '3m / 1m (Match)',
            cardWork: '⚔️ Work Phase (Round)',
            cardRest: '🛡️ Rest Phase',
            cardOptions: '⚙️ Options',
            unitMin: 'Min',
            unitSec: 'Sec',
            labelPrep: 'Preparation Time',
            labelRounds: 'Rounds (0 = Infinite)',
            unitRounds: 'Rounds',
            labelBeepVol: 'Beep Signal Volume',
            btnTestSound: '🔊 Test',
            btnApply: 'Apply & Close',
            hotkeyHint: '⌨️ <strong>Space:</strong> Pause | <strong>S:</strong> Skip | <strong>R:</strong> Reset | <strong>F:</strong> Fullscreen | <strong>L:</strong> Language | <strong>T:</strong> Theme',
            wakelockActive: '📱 Screen awake',
            titleSound: 'Toggle Sound',
            titleFullscreen: 'Fullscreen',
            titleSettings: 'Settings',
            titleReset: 'Reset [Key R]',
            titleSkip: 'Skip Phase [Key S]',
            titleLang: 'Switch Language (English / Deutsch)',
            titleTheme: 'Switch Theme [Key T]',
            titleQuickShare: 'Share Workout',
            labelHalfwayBeep: 'Halfway chime (Role / partner swap)',
            halfwayNotice: '⚔️ HALFWAY',
            summaryTitle: 'Session Complete!',
            summarySub: 'Great work in the sala',
            statRoundsLabel: 'Rounds',
            statFightTimeLabel: 'Combat Time',
            statTotalTimeLabel: 'Total Duration',
            btnShareSession: 'Share Workout',
            btnCloseSummary: 'Close',
            shareCopied: 'Copied to clipboard! 📋',
            spotifyTitle: 'Spotify Connector',
            spotifyNotConnected: 'Connect Spotify',
            spotifyClickToConnect: 'Click for Workout Audio',
            btnSpotifyConnect: 'Connect with Spotify',
            btnSpotifyDisconnect: 'Disconnect',
            spotifyConnected: 'Connected',
            spotifyDisconnected: 'Disconnected',
            spotifyDeviceLabel: 'Playback Device (Spotify Connect):',
            spotifyDuckLevelLabel: 'Music volume on countdown (Ducking):',
            spotifySyncToggle: 'Sync music with timer (Play/Pause)',
            spotifyPauseRestToggle: 'Pause music during rest phase',
            spotifyDuckToggle: 'Auto-Ducking (Lower music on 5s countdown)',
            spotifyRedirectHint: 'Redirect URI for your Spotify Dashboard:'
        }
    };

    let currentLang = 'de';

    // -------------------------------------------------------------------------
    // Theme System
    // -------------------------------------------------------------------------
    const THEMES = ['iron', 'rittersporn', 'high-contrast'];
    const THEME_COLORS = {
        'iron': '#0e1014',
        'rittersporn': '#130307',
        'high-contrast': '#ffffff'
    };
    let currentTheme = 'iron';

    // DOM Elements: Main Timer
    const body = document.body;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const displayTime = document.getElementById('display-time');
    const displayPhase = document.getElementById('display-phase');
    const displayRound = document.getElementById('display-round');
    const nextPhaseName = document.getElementById('next-phase-name');
    const progressBar = document.getElementById('progress-bar');
    const warningFlash = document.getElementById('warning-flash');

    const btnPrimary = document.getElementById('btn-primary');
    const btnPrimaryText = document.getElementById('btn-primary-text');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const btnSkip = document.getElementById('btn-skip');
    const btnReset = document.getElementById('btn-reset');

    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeChips = document.querySelectorAll('.theme-chip');

    const btnLangToggle = document.getElementById('btn-lang-toggle');
    const langIndicator = document.getElementById('lang-indicator');

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
    const presetChips = document.querySelectorAll('.preset-buttons:not(.theme-buttons) .btn-chip');

    const hotkeyHint = document.getElementById('hotkey-hint');
    const wakelockStatus = document.getElementById('wakelock-status');

    // Input Fields
    const inputWorkMin = document.getElementById('input-work-min');
    const inputWorkSec = document.getElementById('input-work-sec');
    const inputRestMin = document.getElementById('input-rest-min');
    const inputRestSec = document.getElementById('input-rest-sec');
    const inputPrepSec = document.getElementById('input-prep-sec');
    const inputRounds = document.getElementById('input-rounds');

    // DOM Elements: Spotify
    const spotifyWidget = document.getElementById('spotify-widget');
    const spotifyWidgetInfo = document.getElementById('spotify-widget-info');
    const spotifyTrackTitle = document.getElementById('spotify-track-title');
    const spotifyTrackArtist = document.getElementById('spotify-track-artist');
    const btnSpotifyToggle = document.getElementById('btn-spotify-toggle');
    const iconSpotifyPlay = document.getElementById('icon-spotify-play');
    const iconSpotifyPause = document.getElementById('icon-spotify-pause');
    const btnSpotifyNext = document.getElementById('btn-spotify-next');

    const spotifyStatusBadge = document.getElementById('spotify-status-badge');
    const inputSpotifyClientId = document.getElementById('input-spotify-client-id');
    const btnSpotifyConnect = document.getElementById('btn-spotify-connect');
    const btnSpotifyDisconnect = document.getElementById('btn-spotify-disconnect');
    const spotifyDeviceBox = document.getElementById('spotify-device-box');
    const selectSpotifyDevice = document.getElementById('select-spotify-device');
    const chkSpotifySync = document.getElementById('chk-spotify-sync');
    const chkSpotifyPauseRest = document.getElementById('chk-spotify-pause-rest');
    const chkSpotifyDuck = document.getElementById('chk-spotify-duck');
    const selectDuckLevel = document.getElementById('select-duck-level');
    const spotifyRedirectUriText = document.getElementById('spotify-redirect-uri-text');

    const inputBeepVol = document.getElementById('input-beep-vol');
    const btnTestSound = document.getElementById('btn-test-sound');
    const chkHalfwayBeep = document.getElementById('chk-halfway-beep');
    const halfwayBadge = document.getElementById('halfway-badge');

    // Summary Modal & Share Elements
    const summaryModal = document.getElementById('summary-modal');
    const statRounds = document.getElementById('stat-rounds');
    const statFightTime = document.getElementById('stat-fight-time');
    const statTotalTime = document.getElementById('stat-total-time');
    const btnShareSession = document.getElementById('btn-share-session');
    const btnShareText = document.getElementById('btn-share-text');
    const btnCloseSummary = document.getElementById('btn-close-summary');
    const btnQuickShare = document.getElementById('btn-quick-share');

    // Instances
    const timer = new CircuitTimer();
    const sound = window.soundEngine;
    const wakeLock = window.wakeLockManager;
    const spotify = window.spotifyManager;

    // Local Storage Keys
    const STORAGE_KEY = 'hema_circuit_timer_cfg';
    const LANG_STORAGE_KEY = 'hema_circuit_timer_lang';
    const THEME_STORAGE_KEY = 'hema_circuit_timer_theme';

    /**
     * Set Color Theme (iron, rittersporn, high-contrast)
     */
    function setColorTheme(themeId) {
        if (!THEMES.includes(themeId)) themeId = 'iron';
        currentTheme = themeId;

        body.setAttribute('data-color-theme', currentTheme);

        if (metaThemeColor && THEME_COLORS[currentTheme]) {
            metaThemeColor.setAttribute('content', THEME_COLORS[currentTheme]);
        }

        // Update Theme Chips active state
        themeChips.forEach(chip => {
            if (chip.dataset.themeId === currentTheme) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        try {
            localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        } catch (e) {
            console.warn('Could not save theme to localStorage', e);
        }
    }

    function cycleColorTheme() {
        const nextIdx = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
        setColorTheme(THEMES[nextIdx]);
    }

    /**
     * Set language and re-translate all elements
     */
    function setLanguage(lang) {
        if (!I18N[lang]) lang = 'de';
        currentLang = lang;
        document.documentElement.lang = currentLang;

        const dict = I18N[currentLang];

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Update indicator button (shows target switch)
        if (langIndicator) {
            langIndicator.textContent = currentLang === 'de' ? 'EN' : 'DE';
        }

        // Update button titles & aria-labels
        if (btnThemeToggle) btnThemeToggle.title = dict.titleTheme;
        if (btnQuickShare) btnQuickShare.title = dict.titleQuickShare;
        if (btnLangToggle) btnLangToggle.title = dict.titleLang;
        if (btnSoundToggle) btnSoundToggle.title = dict.titleSound;
        if (btnFullscreen) btnFullscreen.title = dict.titleFullscreen;
        if (btnSettingsToggle) btnSettingsToggle.title = dict.titleSettings;
        if (btnReset) btnReset.title = dict.titleReset;
        if (btnSkip) btnSkip.title = dict.titleSkip;
        if (hotkeyHint) hotkeyHint.innerHTML = dict.hotkeyHint;
        if (wakelockStatus) wakelockStatus.textContent = dict.wakelockActive;

        // Re-render dynamic timer labels
        updateTheme(timer.state, timer.previousState);
        updateNextPhasePreview();
        updateRoundDisplay(timer.currentRound, timer.config.totalRounds);
        updateSpotifyUI();

        try {
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
        } catch (e) {
            console.warn('Could not save language to localStorage', e);
        }
    }

    /**
     * Load settings from localStorage or defaults
     */
    function loadSavedSettings() {
        try {
            const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
            if (savedLang && I18N[savedLang]) {
                currentLang = savedLang;
            }

            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && THEMES.includes(savedTheme)) {
                currentTheme = savedTheme;
            }

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
                if (cfg.beepVol !== undefined) {
                    sound.setVolume(cfg.beepVol);
                    if (inputBeepVol) inputBeepVol.value = cfg.beepVol;
                }
                if (cfg.halfwayBeep !== undefined) {
                    timer.config.halfwayBeep = cfg.halfwayBeep;
                    if (chkHalfwayBeep) chkHalfwayBeep.checked = cfg.halfwayBeep;
                }
            }

            // Sync Spotify Toggles & Duck Level
            if (spotify) {
                if (inputSpotifyClientId && spotify.clientId) {
                    inputSpotifyClientId.value = spotify.clientId;
                }
                if (chkSpotifySync) chkSpotifySync.checked = spotify.settings.syncWithTimer;
                if (chkSpotifyPauseRest) chkSpotifyPauseRest.checked = spotify.settings.pauseOnRest;
                if (chkSpotifyDuck) chkSpotifyDuck.checked = spotify.settings.duckOnWarning;

                const savedDuckLevel = localStorage.getItem('hema_spotify_duck_level');
                if (savedDuckLevel !== null) {
                    spotify.duckedVolume = parseFloat(savedDuckLevel);
                    if (selectDuckLevel) selectDuckLevel.value = savedDuckLevel;
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
                isMuted: sound.isMuted,
                beepVol: sound.masterVolume,
                halfwayBeep: chkHalfwayBeep ? chkHalfwayBeep.checked : true
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
        const halfwayBeep = chkHalfwayBeep ? chkHalfwayBeep.checked : true;

        timer.configure({
            workSeconds: Math.max(1, workSec),
            restSeconds: Math.max(0, restSec),
            prepSeconds: Math.max(0, prepSec),
            totalRounds: Math.max(0, totalRounds),
            halfwayBeep: halfwayBeep
        });

        // Save Spotify Settings
        if (spotify) {
            if (inputSpotifyClientId) spotify.setClientId(inputSpotifyClientId.value);
            if (chkSpotifySync) spotify.settings.syncWithTimer = chkSpotifySync.checked;
            if (chkSpotifyPauseRest) spotify.settings.pauseOnRest = chkSpotifyPauseRest.checked;
            if (chkSpotifyDuck) spotify.settings.duckOnWarning = chkSpotifyDuck.checked;
            spotify._saveStorage();
        }

        saveSettings();
        updateNextPhasePreview();
        updateRoundDisplay(timer.currentRound, timer.config.totalRounds);
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
     * Update Next Phase Preview text in current language
     */
    function updateNextPhasePreview() {
        const dict = I18N[currentLang];
        const restSec = (parseInt(inputRestMin.value, 10) || 0) * 60 + (parseInt(inputRestSec.value, 10) || 0);
        const workSec = (parseInt(inputWorkMin.value, 10) || 0) * 60 + (parseInt(inputWorkSec.value, 10) || 0);

        if (timer.state === 'PREP') {
            nextPhaseName.textContent = `${dict.workPhaseName} (${formatTime(workSec)})`;
        } else if (timer.state === 'WORK') {
            if (restSec > 0) {
                nextPhaseName.textContent = `${dict.restPhaseName} (${formatTime(restSec)})`;
            } else {
                nextPhaseName.textContent = `${dict.nextRoundLabel} (${formatTime(workSec)})`;
            }
        } else if (timer.state === 'REST') {
            nextPhaseName.textContent = `${dict.workPhaseName} (${formatTime(workSec)})`;
        } else {
            nextPhaseName.textContent = `${dict.restPhaseName} (${formatTime(restSec)})`;
        }
    }

    /**
     * Update round display text
     */
    function updateRoundDisplay(round, totalRounds) {
        const dict = I18N[currentLang];
        if (totalRounds > 0) {
            displayRound.textContent = `${dict.roundPrefix} ${round} / ${totalRounds}`;
        } else {
            displayRound.textContent = `${dict.roundPrefix} ${round}`;
        }
    }

    /**
     * Update UI theme styling and phase label according to current phase
     */
    function updateTheme(phase, subPhase) {
        body.className = '';
        const dict = I18N[currentLang];

        switch (phase) {
            case 'IDLE':
                body.classList.add('theme-idle');
                displayPhase.textContent = dict.phaseReady;
                break;
            case 'PREP':
                body.classList.add('theme-prep');
                displayPhase.textContent = dict.phasePrep;
                break;
            case 'WORK':
                body.classList.add('theme-work');
                displayPhase.textContent = dict.phaseWork;
                break;
            case 'REST':
                body.classList.add('theme-rest');
                displayPhase.textContent = dict.phaseRest;
                break;
            case 'PAUSED':
                body.classList.add('theme-paused');
                displayPhase.textContent = dict.phasePaused;
                break;
            case 'COMPLETE':
                body.classList.add('theme-complete');
                displayPhase.textContent = dict.phaseComplete;
                break;
        }

        // Toggle primary button state
        if (phase === 'WORK' || phase === 'REST' || phase === 'PREP') {
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
            btnPrimaryText.textContent = dict.btnPause;
        } else if (phase === 'PAUSED') {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            btnPrimaryText.textContent = dict.btnResume;
        } else {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            btnPrimaryText.textContent = dict.btnStart;
        }
    }

    // -------------------------------------------------------------------------
    // Spotify UI Synchronization
    // -------------------------------------------------------------------------
    function updateSpotifyUI() {
        if (!spotify) return;

        const dict = I18N[currentLang];
        const isConnected = !!spotify.token;

        if (isConnected) {
            spotifyStatusBadge.className = 'badge-connected';
            const userName = spotify.userProfile ? spotify.userProfile.display_name : '';
            spotifyStatusBadge.textContent = userName ? `${dict.spotifyConnected}: ${userName}` : dict.spotifyConnected;

            btnSpotifyConnect.classList.add('hidden');
            btnSpotifyDisconnect.classList.remove('hidden');
            spotifyDeviceBox.classList.remove('hidden');

            // Update mini-bar widget
            if (spotify.currentTrack) {
                spotifyTrackTitle.textContent = spotify.currentTrack.title;
                spotifyTrackArtist.textContent = spotify.currentTrack.artist;
            } else {
                spotifyTrackTitle.textContent = 'Spotify bereit';
                spotifyTrackArtist.textContent = 'Starte Wiedergabe oder Timer';
            }

            // Update Play/Pause button icons
            if (spotify.isPlaying) {
                iconSpotifyPlay.classList.add('hidden');
                iconSpotifyPause.classList.remove('hidden');
            } else {
                iconSpotifyPlay.classList.remove('hidden');
                iconSpotifyPause.classList.add('hidden');
            }

            // Populate Device List
            if (spotify.devices && spotify.devices.length > 0) {
                selectSpotifyDevice.innerHTML = '';
                spotify.devices.forEach(dev => {
                    const opt = document.createElement('option');
                    opt.value = dev.id;
                    opt.textContent = `${dev.name} (${dev.type})${dev.is_active ? ' • Aktiv' : ''}`;
                    if (dev.id === spotify.selectedDeviceId) {
                        opt.selected = true;
                    }
                    selectSpotifyDevice.appendChild(opt);
                });
            }
        } else {
            spotifyStatusBadge.className = 'badge-disconnected';
            spotifyStatusBadge.textContent = dict.spotifyDisconnected;

            btnSpotifyConnect.classList.remove('hidden');
            btnSpotifyDisconnect.classList.add('hidden');
            spotifyDeviceBox.classList.add('hidden');

            spotifyTrackTitle.textContent = dict.spotifyNotConnected;
            spotifyTrackArtist.textContent = dict.spotifyClickToConnect;

            iconSpotifyPlay.classList.remove('hidden');
            iconSpotifyPause.classList.add('hidden');
        }

        // Show current redirect URI
        if (spotifyRedirectUriText) {
            spotifyRedirectUriText.textContent = spotify.getRedirectUri();
        }
    }

    if (spotify) {
        spotify.onStateChange = () => {
            updateSpotifyUI();
        };
    }

    // -------------------------------------------------------------------------
    // Timer Engine Callbacks
    // -------------------------------------------------------------------------
    timer.onTick = ({ phase, subPhase, remainingSeconds, totalSeconds, progress, round, totalRounds }) => {
        displayTime.textContent = formatTime(remainingSeconds);
        progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;

        updateRoundDisplay(round, totalRounds);
        updateTheme(phase, subPhase);
        updateNextPhasePreview();

        // Remove warning pulse if above 5 seconds
        if (remainingSeconds > 5 || phase === 'PAUSED' || phase === 'IDLE') {
            displayTime.classList.remove('warning-pulse');
            warningFlash.classList.remove('active');
        }
    };

    timer.onWarning = (secondsLeft) => {
        // Trigger synth warning sound
        sound.playWarningBeep(secondsLeft);

        // Spotify Auto-Ducking (dims volume 5 seconds before phase end)
        if (spotify) {
            spotify.onWarningCountdown(secondsLeft);
        }

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

        // Sync Spotify playback with new phase
        if (spotify) {
            spotify.onPhaseStarted(newPhase);
        }
    };

    timer.onHalfway = () => {
        sound.playHalfwayBeep();
        if (halfwayBadge) {
            halfwayBadge.classList.remove('hidden');
            setTimeout(() => {
                halfwayBadge.classList.add('hidden');
            }, 2200);
        }
    };

    function openSummaryModal(stats) {
        const finalStats = stats || timer.getStats();
        if (statRounds) statRounds.textContent = finalStats.completedRounds;
        if (statFightTime) statFightTime.textContent = formatTime(finalStats.totalWorkSeconds);
        if (statTotalTime) statTotalTime.textContent = formatTime(finalStats.totalElapsedSeconds);

        if (summaryModal) {
            summaryModal.classList.add('open');
            summaryModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeSummaryModal() {
        if (summaryModal) {
            summaryModal.classList.remove('open');
            summaryModal.setAttribute('aria-hidden', 'true');
        }
    }

    async function shareSession() {
        const stats = timer.getStats();
        const dict = I18N[currentLang];
        const rounds = stats.completedRounds;
        const fightTime = formatTime(stats.totalWorkSeconds);
        const totalTime = formatTime(stats.totalElapsedSeconds);
        const shareUrl = window.location.origin + window.location.pathname;

        const shareText = `⚔️ HEMA Rittersporn Training abgeschlossen!\n🔥 ${rounds} Runden absolviert (${fightTime} Min. reine Fechtzeit / ${totalTime} Gesamtdauer)\n⏱️ HEMA Circuit Timer: ${shareUrl}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'HEMA Rittersporn Training',
                    text: shareText,
                    url: shareUrl
                });
                return;
            } catch (e) {
                // Fallback to clipboard
            }
        }

        try {
            await navigator.clipboard.writeText(shareText);
            if (btnShareText) {
                const originalText = btnShareText.textContent;
                btnShareText.textContent = dict.shareCopied;
                setTimeout(() => {
                    btnShareText.textContent = originalText;
                }, 2500);
            }
        } catch (e) {
            prompt('Training teilen (Text kopieren):', shareText);
        }
    }

    timer.onComplete = (stats) => {
        displayTime.classList.remove('warning-pulse');
        sound.playPhaseChangeBeep('work');
        wakeLock.releaseLock();
        if (spotify) spotify.pause();
        openSummaryModal(stats);
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
            if (spotify) spotify.onTimerResumed();
        } else if (timer.state === 'WORK' || timer.state === 'REST' || timer.state === 'PREP') {
            timer.pause();
            if (spotify) spotify.onTimerPaused();
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
        if (spotify) spotify.pause();
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
    // Event Listeners: Buttons & Spotify
    // -------------------------------------------------------------------------
    btnPrimary.addEventListener('click', handlePrimaryAction);
    btnSkip.addEventListener('click', handleSkip);
    btnReset.addEventListener('click', handleReset);

    // Theme Switcher Button
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', cycleColorTheme);
    }

    // Theme Chips in Settings Drawer
    themeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            setColorTheme(chip.dataset.themeId);
        });
    });

    // Language Toggle
    btnLangToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'de' ? 'en' : 'de');
    });

    btnSoundToggle.addEventListener('click', () => {
        sound.init();
        setSoundMuted(!sound.isMuted);
    });

    btnFullscreen.addEventListener('click', toggleFullscreen);

    // Settings Drawer
    function openSettings() {
        settingsDrawer.classList.add('open');
        if (spotify) spotify.refreshDevices();
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

    // Spotify Controls
    if (spotifyWidgetInfo) {
        spotifyWidgetInfo.addEventListener('click', () => {
            if (!spotify.token) {
                openSettings();
            }
        });
    }

    if (btnSpotifyToggle) {
        btnSpotifyToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (spotify.token) {
                spotify.togglePlayPause();
            } else {
                openSettings();
            }
        });
    }

    if (btnSpotifyNext) {
        btnSpotifyNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (spotify.token) {
                spotify.nextTrack();
            }
        });
    }

    if (btnSpotifyConnect) {
        btnSpotifyConnect.addEventListener('click', () => {
            if (inputSpotifyClientId && inputSpotifyClientId.value) {
                spotify.setClientId(inputSpotifyClientId.value);
            }
            spotify.login();
        });
    }

    if (btnSpotifyDisconnect) {
        btnSpotifyDisconnect.addEventListener('click', () => {
            spotify.logout();
        });
    }

    if (selectSpotifyDevice) {
        selectSpotifyDevice.addEventListener('change', () => {
            spotify.selectedDeviceId = selectSpotifyDevice.value;
            spotify._saveStorage();
        });
    }

    if (selectDuckLevel) {
        selectDuckLevel.addEventListener('change', () => {
            spotify.duckedVolume = parseFloat(selectDuckLevel.value);
            localStorage.setItem('hema_spotify_duck_level', selectDuckLevel.value);
        });
    }

    // Sound Volume & Test Button
    if (inputBeepVol) {
        inputBeepVol.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            sound.setVolume(vol);
            saveSettings();
        });
    }

    if (btnTestSound) {
        btnTestSound.addEventListener('click', () => {
            sound.init();
            sound.testBeep();
        });
    }

    if (chkHalfwayBeep) {
        chkHalfwayBeep.addEventListener('change', () => {
            timer.config.halfwayBeep = chkHalfwayBeep.checked;
            saveSettings();
        });
    }

    // Share & Summary Modal Listeners
    if (btnShareSession) {
        btnShareSession.addEventListener('click', shareSession);
    }

    if (btnCloseSummary) {
        btnCloseSummary.addEventListener('click', closeSummaryModal);
    }

    if (btnQuickShare) {
        btnQuickShare.addEventListener('click', () => {
            openSummaryModal();
        });
    }

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
            case 'KeyL':
                e.preventDefault();
                setLanguage(currentLang === 'de' ? 'en' : 'de');
                break;
            case 'KeyT':
                e.preventDefault();
                cycleColorTheme();
                break;
            case 'Escape':
                if (settingsDrawer.classList.contains('open')) {
                    closeSettings();
                }
                break;
        }
    });

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------
    loadSavedSettings();
    setColorTheme(currentTheme);
    setLanguage(currentLang);
    applyConfiguration();

    // Check if returning from Spotify OAuth redirect
    if (spotify) {
        const returnedFromAuth = await spotify.handleAuthRedirect();
        if (!returnedFromAuth && spotify.token) {
            spotify.init();
        }
        updateSpotifyUI();
    }
});
