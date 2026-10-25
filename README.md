# HEMA Circuit Timer ⚔️🛡️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](https://pages.github.com/)
[![Built with Google Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Pure Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%2F%20CSS3%20%2F%20Vanilla%20JS-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/Offline-100%25%20Compatible-brightgreen.svg)](#features)

A modern, responsive, high-contrast interval & circuit training timer designed for Historical European Martial Arts (**HEMA**), combat sports, sparring, and fitness drills. Runs natively in any web browser on **Laptop**, **Tablet**, and **Smartphone**, and is built for seamless 1-click deployment to **GitHub Pages** (pure static frontend, zero dependencies, zero build step, 100% offline capable).

---

## 📋 GitHub Repository Setup Helper

To make your GitHub repository look clean and professional, use these recommended settings:

### Description
> ⚔️ Precision interval & circuit training timer for HEMA (Historical European Martial Arts), sparring, and workouts. Runs in any browser, 100% offline, mobile & desktop optimized.

### Website URL
> `https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/`

### Suggested Topics / Tags
```text
hema, interval-timer, circuit-training, sparring, martial-arts, workout-timer, github-pages, vanilla-javascript, web-audio-api, wake-lock, built-with-gemini, open-source
```

---

## 🌟 Key Features

- 🎨 **3 High-Visibility Color Themes**:
  - 🛡️ **Fechtsaal (Iron Slate)**: Clean dark theme with forged iron, amber, and blade teal accents.
  - 🍷 **Rittersporn (Burgundy)**: Dedicated HEMA club theme in noble medieval burgundy/dark red with golden sheen.
  - ☀️ **High Contrast (Light)**: Crisp white background with bold pitch-black digits for direct sunlight and outdoor sparring.
  - Switch anytime via header palette button, settings drawer, or key <kbd>T</kbd>.
- 🌐 **Bilingual (Deutsch & English)**: Toggle effortlessly between German and English anytime with the header button or key `L`.
- ⏱️ **Minute & Second Precision**: Flexible, direct input for Work (`MM:SS`) and Rest (`MM:SS`) durations.
- 🥋 **Quick HEMA Presets**:
  - `2m / 30s`: Standard HEMA Sparring & Freeplay
  - `1m / 15s`: Footwork & Cutting Drills
  - `30s / 15s`: High-Intensity Interval Training (HIIT)
  - `3m / 1m`: Competitive Match Simulation (Fechtfeder / Rapier)
- 🔁 **Flexible Round Modes**: Run open-ended (infinite) or set a targeted round count (e.g. 5 rounds).
- 🔊 **Zero-Latency Web Audio Synthesizer**:
  - Distinct countdown warning beeps at **5, 4, 3, 2, and 1 seconds** before every phase transition.
  - Resonant two-tone gong / chime on phase transition.
  - Synthesized directly by the browser's `AudioContext` — no external MP3 downloads, zero lag, works offline.
  - Dedicated sound mute toggle (`M`).
- ⏭️ **Phase Controls**:
  - **Start / Pause / Resume**: Freeze timer instantly during work, prep, or rest phases.
  - **Skip Phase**: Instantly jump from work to rest or skip rest to start fighting immediately.
  - **Reset**: Return to the initial configuration with one tap.
- 📱 **Mobile & Sala Visibility**:
  - **Screen Wake Lock API**: Automatically prevents phone, tablet, and laptop screens from sleeping during sparring.
  - **PWA Installation (Add to Home Screen)**: Progressive Web App with offline caching & custom longsword icons. Runs standalone without browser address bar on iOS & Android.
  - **Ultra-High Contrast Theme**: Scalable giant digits readable through fencing masks and from across the fencing hall.
  - **Landscape & Portrait Optimization**: Automatically adapts controls and digit layout.
- ⚔️ **Halbzeit-Signal (Halfway Chime)**: Distinct audio chime and visual banner at 50% of each active round (perfect for partner swap or attacker/defender role switch). Can be toggled in settings.
- 🏆 **Session Summary & Share**: Summary screen tracking completed rounds, combat time, and total duration. 1-click sharing to WhatsApp or Discord via Web Share API or clipboard.
- 💾 **Automatic Persistence**: Remembers your preferred times, rounds, volume, theme, and language in `localStorage`.

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

## 🚀 Deployment to GitHub Pages

Because this application is written in standard HTML5, CSS3, and modern Vanilla JavaScript, **no build step or server is needed**:

1. **Create a new GitHub Repository** (e.g. `hema-circle` or `hema-timer`).
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of HEMA circuit timer"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
3. **Activate GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** ➔ **Pages**.
   - Under **Build and deployment** / **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
   - Your timer will be live within seconds at:
     ```
     https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
     ```

---

## 💻 Local Development & Testing

Run a lightweight local server with Python or Node.js:

```bash
# Using Python
python3 -m http.server 8080

# Or using npx serve
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your web browser.

---

## 📂 Project Structure

```
hema-circle/
├── index.html          # Semantic HTML5 arena, responsive layout & i18n hooks
├── css/
│   └── style.css       # High-contrast martial theme, clamp() typography, mobile styling
├── js/
│   ├── audio.js        # Web Audio API sound synthesizer (beeps & resonant chimes)
│   ├── spotify.js      # Spotify OAuth PKCE, Web Playback SDK & Connect Controller
│   ├── timer.js        # Drift-free timestamp-based interval state machine
│   ├── wakelock.js     # Screen Wake Lock controller for sleep prevention
│   └── app.js          # Main app logic, keyboard bindings, i18n engine & persistence
├── LICENSE             # Open-source MIT License
├── README.md           # Documentation & GitHub Pages deployment guide
└── .gitignore          # Standard repository ignore rules
```

---

## 🎵 Spotify Integration (Live)

The app features a **Hybrid Spotify Connector** using **OAuth 2.0 PKCE**:

- 🎛️ **Dual Engine Support**:
  - **In-Browser Web Playback SDK**: Streams audio directly inside the timer tab (ideal for laptops & computers).
  - **Spotify Connect API**: Controls an existing active Spotify app running on your phone, laptop, or hall sound system.
  - Automatically lists all your active Spotify devices in a dropdown menu.
- ⚡ **Smart Sparring Audio Sync**:
  - **Auto-Play / Pause**: Starts music when the round starts, pauses when the round ends or when the timer is paused.
  - **Auto-Ducking**: 5 seconds before the end of a round, music volume is automatically ducked to ~20% so the countdown beeps and gong are loud and clear.
- 🔒 **Zero-Backend Security (PKCE)**: Uses client-side PKCE authentication with Spotify's official token endpoint. No secret keys stored in code.

### ⚙️ Spotify Developer Dashboard Setup:
In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) under your app's **Settings**:
1. Add both **Redirect URIs**:
   - For local testing: `http://localhost:8080/`
   - For GitHub Pages: `https://bernhardkoschicek.github.io/hema-circle/`
2. Save changes.
3. In the timer app settings drawer, click **"Mit Spotify verbinden" / "Connect Spotify"**!

---

## 📄 License & Attribution

This project is open-source software licensed under the [MIT License](LICENSE). You are free to use, modify, distribute, and integrate it into your own martial arts or sports projects.

**Created with Google Gemini** ✦ Pair-programmed with AI.
