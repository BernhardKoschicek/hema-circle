/**
 * HEMA Timer - Screen Wake Lock Controller
 * Keeps display active during training sessions on supported mobile & desktop devices.
 */

class WakeLockManager {
    constructor() {
        this.wakeLock = null;
        this.isActive = false;
        this._bindEvents();
    }

    _bindEvents() {
        // Automatically re-request wake lock when user switches back to the tab
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.isActive) {
                this.requestLock();
            }
        });
    }

    async requestLock() {
        if (!('wakeLock' in navigator)) {
            return false;
        }

        try {
            this.wakeLock = await navigator.wakeLock.request('screen');
            this.isActive = true;

            this.wakeLock.addEventListener('release', () => {
                // WakeLock released
                this.wakeLock = null;
            });
            return true;
        } catch (err) {
            // Can fail if battery is ultra-low or system policy restricts it
            console.warn('Wake Lock request error:', err);
            return false;
        }
    }

    async releaseLock() {
        this.isActive = false;
        if (this.wakeLock !== null) {
            try {
                await this.wakeLock.release();
            } catch (err) {
                console.warn('Wake Lock release error:', err);
            }
            this.wakeLock = null;
        }
    }
}

window.wakeLockManager = new WakeLockManager();
