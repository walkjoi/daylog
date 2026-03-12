# Daylog

A minimal, privacy-first mood tracking app with a year-in-pixels calendar view. Track your daily moods and sync your data securely to GitHub Gists.

## Features

- 📊 **Year-in-Pixels View** — See your entire year at a glance with color-coded mood entries
- 🔐 **End-to-End Encrypted** — Your mood data is encrypted locally before syncing to GitHub
- ☁️ **GitHub Gist Sync** — Store your data in your own GitHub account
- 🎨 **Mood Tracking** — Rate each day on a 5-level mood scale (1-5)
- 🌙 **Dark Mode** — Built-in theme toggle
- 📱 **Progressive Web App** — Install as an app on your device
- 🚀 **Fast & Lightweight** — Built with React, Vite, and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub account (for Gist integration)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## How It Works

1. **Setup** — Authenticate with GitHub using OAuth
2. **Encrypt** — Set a password to encrypt your mood data
3. **Track** — Log your mood each day (scale of 1-5)
4. **Sync** — Automatic sync to a GitHub Gist with encrypted payload
5. **View** — Visualize the entire year with the pixel calendar

Your encryption key is derived from your password using secure cryptographic functions. Only you can decrypt your data.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **PWA**: Workbox
- **Encryption**: Web Crypto API
- **APIs**: GitHub OAuth, GitHub Gist API

## Project Structure

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities (crypto, gist, oauth, storage)
├── assets/          # Static assets
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── types.ts         # TypeScript types
```

## License

MIT
