# HEMA Circuit Timer ⚔️🛡️

[![Version: 0.2.0](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/BernhardKoschicek/hema-circle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](https://bernhardkoschicek.github.io/hema-circle/)
[![Built with Google Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Pure Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%2F%20CSS3%20%2F%20Vanilla%20JS-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/Offline-100%25%20Compatible-brightgreen.svg)](#key-features)

A modern, responsive, high-contrast interval & circuit training timer designed for Historical European Martial Arts (**HEMA**), combat sports, sparring, and fitness drills. Runs natively in any web browser on **Laptop**, **Tablet**, and **Smartphone**, with zero dependencies, zero build step, and 100% offline PWA support.

🔗 **Live App**: [https://bernhardkoschicek.github.io/hema-circle/](https://bernhardkoschicek.github.io/hema-circle/)

---

## 🌟 Key Features

- 🎨 **3 High-Visibility Color Themes**:
  - 🛡️ **Fechtsaal (Iron Slate)**: Clean dark theme with forged iron, amber, and blade teal accents.
  - ⚜️ **Rittersporn (Burgundy)**: Dedicated HEMA club theme featuring the official Rittersporn emblem in noble medieval burgundy with golden accents.
  - ☀️ **High Contrast (Light)**: Crisp white background with bold pitch-black digits for direct sunlight and outdoor sparring.
- 🌐 **Bilingual (Deutsch & English)**: Toggle between German and English anytime via the header button or key <kbd>L</kbd>.
- ⏱️ **Minute & Second Precision**: Flexible direct input for Work (`MM:SS`), Rest (`MM:SS`), Prep time, and Round count (`0` = infinite).
- 🥋 **Quick HEMA Presets**:
  - `2m / 30s`: Standard HEMA Sparring & Freeplay
  - `1m / 15s`: Footwork & Cutting Drills
  - `30s / 15s`: High-Intensity Interval Training (HIIT)
  - `3m / 1m`: Competitive Match Simulation (Fechtfeder / Rapier)
- 🔊 **Zero-Latency Web Audio Synthesizer**:
  - Distinct countdown warning beeps at **5, 4, 3, 2, and 1 seconds** before every phase transition.
  - Resonant two-tone gong / chime on phase transitions.
  - Optional **Halfway Chime** (`50%` of round) for partner or role swaps.
  - Synthesized directly via the browser's `AudioContext` — no external audio files required.
- 📱 **Mobile & Sala Ready**:
  - **Screen Wake Lock API**: Prevents phone, tablet, and laptop screens from dimming or locking during sparring.
  - **Installable PWA**: Works standalone on Android, iOS, and Desktop with offline caching (`sw.js`).
- 🏆 **Session Summary & Share**: Tracks completed rounds, combat time, and total duration with 1-click sharing via Web Share API or clipboard.

---

## 🎵 Spotify Integration

The timer includes a client-side **Spotify Connector** secured via **OAuth 2.0 PKCE** (no backend required):

- **Spotify Connect API (Mobile & Desktop)**: Remotely controls playback on your active Spotify app (smartphone, laptop, or Bluetooth speaker).
- **Web Playback SDK (Desktop Browser)**: Streams audio directly inside the browser tab on supported desktop browsers.
- **Smart Sparring Sync**:
  - Automatically starts music on `WORK` phases and pauses (or dims) on `REST` phases.
  - **Auto-Ducking**: Automatically lowers music volume during the 5-second warning countdown so signal beeps remain clearly audible.

### Spotify Developer Dashboard Configuration
To use your own Spotify Client ID, add the following **Redirect URIs** in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
- `https://bernhardkoschicek.github.io/hema-circle/`
- `http://localhost:8080/` (for local development)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Start / Pause / Resume Timer |
| <kbd>S</kbd> or <kbd>→</kbd> | Skip Phase (Work ↔ Rest) |
| <kbd>R</kbd> | Reset Timer |
| <kbd>F</kbd> | Fullscreen Toggle |
| <kbd>M</kbd> | Mute / Unmute Audio |
| <kbd>L</kbd> | Switch Language (DE / EN) |
| <kbd>T</kbd> | Cycle Color Theme (Fechtsaal / Rittersporn / High Contrast) |
| <kbd>Esc</kbd> | Close Settings Drawer |

---

## 💻 Local Development

Run any static HTTP server in the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in your browser.

---

## 📂 Project Structure

```text
hema-circle/
├── index.html          # Main application layout & i18n hooks
├── manifest.json       # PWA Web App Manifest
├── sw.js               # Network-first Service Worker for offline support
├── css/
│   └── style.css       # Responsive layout & color themes (Iron, Rittersporn, High Contrast)
├── icons/              # App icons & Rittersporn club emblems
├── js/
│   ├── app.js          # UI controller, i18n dictionary, themes & event bindings
│   ├── audio.js        # Web Audio API synthesizer for countdown beeps & gongs
│   ├── spotify.js      # Spotify OAuth 2.0 PKCE, Spotify Connect & Web Playback controller
│   ├── timer.js        # Drift-free timestamp-based interval state machine
│   └── wakelock.js     # Screen Wake Lock API manager
├── LICENSE             # MIT License
└── README.md           # Documentation
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).
