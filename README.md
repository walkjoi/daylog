# Daylog

A privacy-first mood tracking app that visualizes your emotional journey throughout the year. Data is encrypted and stored in your GitHub Gist—nothing is stored on our servers.

## Features

- **Year in Pixels** — Visual mood calendar showing your emotional state each day
- **Encrypted Storage** — Your mood data is encrypted before being saved to GitHub
- **GitHub Gist Backend** — Your data lives where you control it
- **Offline Ready** — PWA with service worker for offline access
- **No Account Required** — Just authenticate with GitHub and go
- **Mobile Friendly** — Responsive design works on all devices

## Quick Start

### Development

```bash
bun install
bun run dev
```

The app runs on `http://localhost:5173` with hot module reloading.

### Production Build

```bash
bun run build
```

Outputs optimized static files to `build/`.

## Setup

### 1. Provide GitHub Authentication

You can authenticate in two ways:

**Option A: Personal Access Token** (current implementation)

- Create a [GitHub Personal Access Token](https://github.com/settings/tokens)
- Minimum scope: `gist` (to read/write gists)
- Paste token in Settings when prompted

**Option B: OAuth Device Flow** (in development)

- Work in progress
- Simpler user experience — one-click login instead of token pasting

### 2. First Run

1. Open the app and go to Settings
2. Paste your GitHub token
3. The app automatically creates a private gist named `daylog` for storing your mood data
4. Start tracking your mood daily

## Project Structure

```
src/
  components/
    DayCell.jsx         — Individual day mood cell
    MoodPicker.jsx      — Mood selection UI
    YearInPixels.jsx    — Calendar visualization
    Settings.jsx        — Configuration & auth
    Header.jsx          — App header
  hooks/
    useMoodData.js      — Mood data management
  lib/
    gist.js            — GitHub Gist API
    crypto.js          — Encryption/decryption
    oauth.js           — OAuth device flow (WIP)
    storage.js         — Local storage utils
  constants.js         — App configuration
worker/
  index.js             — Cloudflare Worker proxy (for OAuth)
```

## Technologies

- **React 19** — UI framework
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Styling
- **PWA Plugin** — Progressive web app support
- **Cloudflare Workers** — OAuth proxy (in development)

## Privacy

All mood data is encrypted client-side before being sent to GitHub. The encryption key is derived from your GitHub token and stored locally. We have zero access to your data.

## Contributing

Found a bug? Have a feature idea? Open an issue or pull request.

## License

MIT
