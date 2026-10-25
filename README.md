# HEMA Circuit Timer ⚔️🛡️

Ein leichtgewichtiger, responsiver Intervall-Timer für **Zirkeltraining**, **Sparring-Runden** und **Drills** im Fechtsaal (HEMA - Historical European Martial Arts) oder Fitnessbereich.

Entwickelt für den direkten Einsatz auf **Laptop**, **Tablet** und **Smartphone** sowie für das Hosting über **GitHub Pages** (ohne Backend, 100% offline-fähig).

---

## Features

- ⏱️ **Flexible Zeiteingabe**: Aktivphase & Pausephase bequem in Minuten und Sekunden einstellbar.
- 🔁 **Rundenverwaltung**: Endlos-Modus oder feste Rundenzahl (z.B. 5 Runden).
- 🔊 **Präzise Akustik-Signale (Web Audio API)**:
  - Sekundengenaue Countdown-Beeps bei **5, 4, 3, 2, 1** vor Ende der Phase.
  - Kräftiger, markanter Doppelton / Gong beim Phasenwechsel.
  - Keine externen Audio-Dateien nötig, latenzfrei und sofort bereit.
- ⏭️ **Phasensteuerung**:
  - **Start / Pause / Fortsetzen**: In jeder Phase pausierbar.
  - **Skip (Überspringen)**: Springt sofort zur nächsten Phase (z.B. Rest vorzeitig beenden).
  - **Reset**: Setzt den Timer zurück.
- 📱 **Mobil- und Laptop-Optimiert**:
  - **Screen Wake Lock API**: Hält das Smartphone- und Laptop-Display aktiv, damit der Bildschirm während des Sparrings nicht ausgeht.
  - **High-Contrast Dark Theme**: Riesige Ziffern, aus mehreren Metern Entfernung durch Fechtmasken erkennbar.
  - **Touch & Handschuh-freundlich**: Große Trefferflächen für mobile Geräte.
  - **Fullscreen-Modus**: Maximale Übersicht auf Monitoren und Smart-TVs in der Fechthalle.
- ⌨️ **Tastatur-Shortcuts (für Präsentator / Bluetooth-Fernbedienung)**:
  - `Leertaste`: Start / Pause / Fortsetzen
  - `S` oder `→`: Phase überspringen (Skip)
  - `R`: Zurücksetzen (Reset)
  - `F`: Vollbildmodus
  - `M`: Ton stummschalten / aktivieren
- 💾 **Persistenz**: Speichert automatisch deine zuletzt gewählten Zeiten im lokalen Browserspeicher (`localStorage`).

---

## 🚀 Deployment auf GitHub Pages (Anleitung)

Da das Projekt aus reinem HTML5, CSS3 und modernem JavaScript besteht, ist kein Build-Schritt nötig:

1. **GitHub Repository erstellen**:
   Erstelle auf [GitHub](https://github.com) ein neues Repository (z.B. `hema-timer` oder `hema-circle`).

2. **Code pushen**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of HEMA circuit timer"
   git branch -M main
   git remote add origin https://github.com/<DEIN-NUTZERNAME>/<DEIN-REPO-NAME>.git
   git push -u origin main
   ```

3. **GitHub Pages aktivieren**:
   - Gehe in deinem GitHub-Repository auf **Settings** -> **Pages**.
   - Unter **Build and deployment** / **Branch** wähle `main` und Ordner `/ (root)`.
   - Klicke auf **Save**.
   - Nach wenigen Augenblicken ist dein Timer unter `https://<DEIN-NUTZERNAME>.github.io/<DEIN-REPO-NAME>/` weltweit erreichbar!

---

## 💻 Lokales Testen

Du kannst das Projekt lokal mit jedem einfachen Webserver starten:

### Mit Python:
```bash
python3 -m http.server 8080
```
Öffne anschließend [http://localhost:8080](http://localhost:8080) im Browser.

---

## 🎵 Spotify-Integration (Ausblick Phase 2)

In einem nächsten Schritt kann eine Spotify-Anbindung ergänzt werden:
- **Client-Side OAuth (PKCE)**: Ermöglicht die Spotify-Anmeldung direkt im Browser ohne Backend.
- **Web Playback SDK**: Ermöglicht die Wiedergabe von Playlists direkt im Browser (erfordert einen Spotify-Premium-Account).
- **Play/Pause Synchronisation**: Musik kann während der Aktivphase lauter und während der Pausen leiser geschaltet oder pausiert werden.
