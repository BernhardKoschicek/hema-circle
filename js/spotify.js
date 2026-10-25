/**
 * HEMA Timer - Spotify Controller (Web Playback SDK & Web API)
 * Handles OAuth 2.0 PKCE authentication, in-browser playback,
 * Spotify Connect device control, and timer synchronization (ducking & auto-pause).
 */

class SpotifyManager {
    constructor() {
        this.clientId = '5e1e3834bfb243928768db89e9a6fbb2';
        this.token = null;
        this.refreshToken = null;
        this.tokenExpiresAt = 0;
        this.userProfile = null;
        this.player = null;
        this.deviceId = null;
        this.selectedDeviceId = null;
        this.devices = [];
        this.currentTrack = null;
        this.isPlaying = false;
        this.normalVolume = 0.8;
        this.duckedVolume = 0.25; // 25% default ducking volume
        this.isDucked = false;

        // Settings
        this.settings = {
            pauseOnRest: true,     // Pause music during rest phase
            duckOnWarning: true,   // Dim volume during 5s countdown
            syncWithTimer: true    // Auto play/pause with timer
        };

        // Callbacks
        this.onStateChange = null;

        this._loadStorage();
    }

    _loadStorage() {
        try {
            const savedClientId = localStorage.getItem('hema_spotify_client_id');
            if (savedClientId) this.clientId = savedClientId;

            this.token = localStorage.getItem('hema_spotify_token');
            this.refreshToken = localStorage.getItem('hema_spotify_refresh_token');
            this.tokenExpiresAt = parseInt(localStorage.getItem('hema_spotify_expires_at'), 10) || 0;
            this.selectedDeviceId = localStorage.getItem('hema_spotify_device_id') || null;

            const savedSettings = localStorage.getItem('hema_spotify_settings');
            if (savedSettings) {
                this.settings = Object.assign(this.settings, JSON.parse(savedSettings));
            }
        } catch (e) {
            console.warn('Could not read Spotify storage:', e);
        }
    }

    _saveStorage() {
        try {
            localStorage.setItem('hema_spotify_client_id', this.clientId);
            if (this.token) localStorage.setItem('hema_spotify_token', this.token);
            if (this.refreshToken) localStorage.setItem('hema_spotify_refresh_token', this.refreshToken);
            localStorage.setItem('hema_spotify_expires_at', String(this.tokenExpiresAt));
            if (this.selectedDeviceId) localStorage.setItem('hema_spotify_device_id', this.selectedDeviceId);
            localStorage.setItem('hema_spotify_settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not write Spotify storage:', e);
        }
    }

    setClientId(id) {
        if (!id) return;
        this.clientId = id.trim();
        this._saveStorage();
    }

    getRedirectUri() {
        // Automatically returns the exact current URL without query parameters or hash
        return window.location.origin + window.location.pathname;
    }

    // -------------------------------------------------------------------------
    // OAuth 2.0 PKCE Authorization
    // -------------------------------------------------------------------------

    async login() {
        if (!this.clientId) {
            alert('Bitte gib eine gültige Spotify Client ID ein.');
            return;
        }

        const verifier = this._generateRandomString(64);
        const challenge = await this._generateCodeChallenge(verifier);

        sessionStorage.setItem('spotify_code_verifier', verifier);

        const scopes = [
            'streaming',
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing'
        ].join(' ');

        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.getRedirectUri(),
            scope: scopes,
            code_challenge_method: 'S256',
            code_challenge: challenge
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    logout() {
        this.token = null;
        this.refreshToken = null;
        this.tokenExpiresAt = 0;
        this.userProfile = null;
        this.currentTrack = null;
        this.isPlaying = false;

        localStorage.removeItem('hema_spotify_token');
        localStorage.removeItem('hema_spotify_refresh_token');
        localStorage.removeItem('hema_spotify_expires_at');

        if (this.player) {
            try { this.player.disconnect(); } catch (e) {}
            this.player = null;
        }

        this._notifyStateChange();
    }

    async handleAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            console.error('Spotify Auth Error:', error);
            window.history.replaceState({}, document.title, window.location.pathname);
            return false;
        }

        if (code) {
            const verifier = sessionStorage.getItem('spotify_code_verifier');
            if (!verifier) {
                console.error('No code_verifier found in sessionStorage');
                return false;
            }

            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: this.clientId,
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: this.getRedirectUri(),
                        code_verifier: verifier
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Token exchange failed: ${errText}`);
                }

                const data = await response.json();
                this.token = data.access_token;
                if (data.refresh_token) this.refreshToken = data.refresh_token;
                this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);

                this._saveStorage();
                sessionStorage.removeItem('spotify_code_verifier');

                // Clean URL from code parameter
                window.history.replaceState({}, document.title, window.location.pathname);

                await this.init();
                return true;
            } catch (err) {
                console.error('Error during token exchange:', err);
                window.history.replaceState({}, document.title, window.location.pathname);
                return false;
            }
        }

        return false;
    }

    async getValidToken() {
        if (!this.token) return null;

        // If token expires in less than 60 seconds, refresh it
        if (Date.now() > this.tokenExpiresAt - 60000 && this.refreshToken) {
            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: this.clientId,
                        grant_type: 'refresh_token',
                        refresh_token: this.refreshToken
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.token = data.access_token;
                    if (data.refresh_token) this.refreshToken = data.refresh_token;
                    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);
                    this._saveStorage();
                }
            } catch (e) {
                console.warn('Failed to refresh Spotify token', e);
            }
        }

        return this.token;
    }

    // -------------------------------------------------------------------------
    // Player & Web API Initialization
    // -------------------------------------------------------------------------

    async init() {
        const token = await this.getValidToken();
        if (!token) return;

        // 1. Fetch user profile
        try {
            const profileRes = await fetch('https://api.spotify.com/v1/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (profileRes.ok) {
                this.userProfile = await profileRes.json();
            } else if (profileRes.status === 401) {
                this.logout();
                return;
            }
        } catch (e) {
            console.warn('Could not fetch user profile:', e);
        }

        // 2. Fetch available devices (Spotify Connect)
        await this.refreshDevices();

        // 3. Setup Web Playback SDK if loaded
        this._initWebPlaybackSdk();

        // 4. Poll currently playing track periodically
        this._startPolling();

        this._notifyStateChange();
    }

    _initWebPlaybackSdk() {
        if (!window.Spotify || this.player) return;

        const player = new window.Spotify.Player({
            name: 'HEMA Circuit Timer',
            getOAuthToken: async cb => {
                const token = await this.getValidToken();
                cb(token);
            },
            volume: this.normalVolume
        });

        player.addListener('ready', ({ device_id }) => {
            console.log('Spotify Web Player ready with Device ID:', device_id);
            this.deviceId = device_id;
            if (!this.selectedDeviceId) {
                this.selectedDeviceId = device_id;
            }
            this.refreshDevices();
            this._notifyStateChange();
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Spotify Web Player offline:', device_id);
        });

        player.addListener('player_state_changed', state => {
            if (!state) return;
            this.isPlaying = !state.paused;
            const current = state.track_window ? state.track_window.current_track : null;
            if (current) {
                this.currentTrack = {
                    title: current.name,
                    artist: current.artists.map(a => a.name).join(', '),
                    albumArt: current.album && current.album.images[0] ? current.album.images[0].url : ''
                };
            }
            this._notifyStateChange();
        });

        player.addListener('initialization_error', ({ message }) => console.warn('Spotify Init Error:', message));
        player.addListener('authentication_error', ({ message }) => {
            console.warn('Spotify Auth Error:', message);
            this.logout();
        });
        player.addListener('account_error', ({ message }) => {
            console.warn('Spotify Premium Required for in-browser playback:', message);
        });

        player.connect();
        this.player = player;
    }

    async refreshDevices() {
        const token = await this.getValidToken();
        if (!token) return;

        try {
            const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                this.devices = data.devices || [];

                // If active device exists and none selected yet, choose it
                const active = this.devices.find(d => d.is_active);
                if (active && !this.selectedDeviceId) {
                    this.selectedDeviceId = active.id;
                }
            }
        } catch (e) {
            console.warn('Could not fetch devices:', e);
        }
    }

    _startPolling() {
        if (this._pollingInterval) clearInterval(this._pollingInterval);
        this._pollingInterval = setInterval(async () => {
            if (!this.token) return;
            await this._fetchCurrentPlayback();
        }, 3000);
    }

    async _fetchCurrentPlayback() {
        const token = await this.getValidToken();
        if (!token) return;

        try {
            const res = await fetch('https://api.spotify.com/v1/me/player', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 200) {
                const data = await res.json();
                this.isPlaying = data.is_playing;
                if (data.item) {
                    this.currentTrack = {
                        title: data.item.name,
                        artist: data.item.artists.map(a => a.name).join(', '),
                        albumArt: data.item.album && data.item.album.images[0] ? data.item.album.images[0].url : ''
                    };
                }
                if (data.device && data.device.id) {
                    this.selectedDeviceId = data.device.id;
                }
                this._notifyStateChange();
            } else if (res.status === 204) {
                // No active playback
            }
        } catch (e) {
            // Ignore polling network blips
        }
    }

    // -------------------------------------------------------------------------
    // Playback Control Actions
    // -------------------------------------------------------------------------

    async play() {
        const token = await this.getValidToken();
        if (!token) return;

        try {
            const targetDevice = this.selectedDeviceId || this.deviceId;
            const url = targetDevice
                ? `https://api.spotify.com/v1/me/player/play?device_id=${targetDevice}`
                : 'https://api.spotify.com/v1/me/player/play';

            await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            this.isPlaying = true;
            this._notifyStateChange();
        } catch (e) {
            console.warn('Spotify play error:', e);
        }
    }

    async pause() {
        const token = await this.getValidToken();
        if (!token) return;

        try {
            const targetDevice = this.selectedDeviceId || this.deviceId;
            const url = targetDevice
                ? `https://api.spotify.com/v1/me/player/pause?device_id=${targetDevice}`
                : 'https://api.spotify.com/v1/me/player/pause';

            await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            this.isPlaying = false;
            this._notifyStateChange();
        } catch (e) {
            console.warn('Spotify pause error:', e);
        }
    }

    async togglePlayPause() {
        if (this.isPlaying) {
            await this.pause();
        } else {
            await this.play();
        }
    }

    async nextTrack() {
        const token = await this.getValidToken();
        if (!token) return;

        try {
            const targetDevice = this.selectedDeviceId || this.deviceId;
            const url = targetDevice
                ? `https://api.spotify.com/v1/me/player/next?device_id=${targetDevice}`
                : 'https://api.spotify.com/v1/me/player/next';

            await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTimeout(() => this._fetchCurrentPlayback(), 300);
        } catch (e) {
            console.warn('Spotify next track error:', e);
        }
    }

    async setVolume(percent) {
        const token = await this.getValidToken();
        if (!token) return;

        const volumeVal = Math.max(0, Math.min(100, Math.round(percent * 100)));

        try {
            if (this.player && this.selectedDeviceId === this.deviceId) {
                await this.player.setVolume(percent);
            } else {
                await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumeVal}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch (e) {
            console.warn('Spotify volume error:', e);
        }
    }

    // -------------------------------------------------------------------------
    // Timer Synchronization (Ducking & Phase Automation)
    // -------------------------------------------------------------------------

    async onPhaseStarted(phase) {
        if (!this.settings.syncWithTimer || !this.token) return;

        // Restore normal volume when new phase begins
        if (this.isDucked) {
            await this.setVolume(this.normalVolume);
            this.isDucked = false;
        }

        if (phase === 'WORK') {
            await this.play();
        } else if (phase === 'REST') {
            if (this.settings.pauseOnRest) {
                await this.pause();
            } else {
                // Lower volume during rest instead of full pause
                await this.setVolume(this.duckedVolume);
            }
        }
    }

    async onWarningCountdown(secondsLeft) {
        if (!this.settings.duckOnWarning || !this.token) return;

        // Duck volume 5 seconds before phase end so countdown beeps are clearly audible
        if (!this.isDucked && secondsLeft <= 5) {
            this.isDucked = true;
            await this.setVolume(this.duckedVolume);
        }
    }

    async onTimerPaused() {
        if (!this.settings.syncWithTimer || !this.token) return;
        if (this.isPlaying) {
            await this.pause();
        }
    }

    async onTimerResumed() {
        if (!this.settings.syncWithTimer || !this.token) return;
        await this.play();
    }

    // -------------------------------------------------------------------------
    // Helper Methods
    // -------------------------------------------------------------------------

    _notifyStateChange() {
        if (typeof this.onStateChange === 'function') {
            this.onStateChange({
                isConnected: !!this.token,
                user: this.userProfile,
                track: this.currentTrack,
                isPlaying: this.isPlaying,
                devices: this.devices,
                selectedDeviceId: this.selectedDeviceId,
                settings: this.settings
            });
        }
    }

    _generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(values).map(x => possible[x % possible.length]).join('');
    }

    async _generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}

window.spotifyManager = new SpotifyManager();

// Callback required by official Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    if (window.spotifyManager) {
        window.spotifyManager._initWebPlaybackSdk();
    }
};
