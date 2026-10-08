# Tor Browser

This project is a lightweight desktop browser designed around Tor-compatible proxy settings and connection diagnostics. It is built as an Electron application that will auto-detect a local Tor daemon on `127.0.0.1:9050` and route browser traffic through SOCKS5 when available.

## Features

- Chromium-based desktop browser
- Auto-detect Tor at `127.0.0.1:9050`
- SOCKS5/HTTP proxy configuration
- Proxy status and relay circuit display
- Portable Windows build support
- No terminal required after the EXE is built

## Requirements

- Node.js 18+
- npm
- A working Tor daemon (optional, but recommended)

## Run in development mode

```bash
npm install
npm start
```

## Build a Windows portable EXE

```bash
npm install
npm run dist
```

This generates a portable EXE in the `dist` folder.

## Tor auto-detection behavior

On startup, the app probes `127.0.0.1:9050`. If Tor is running, the app automatically switches to:

- Host: `127.0.0.1`
- Port: `9050`
- Type: `socks5`
- Mode: `tor`

If no Tor service is detected, the app remains in direct browsing mode but keeps the proxy controls available.

## Notes

- This app is a Tor-aware browser shell, not the official Tor Browser project.
- Actual anonymity only exists when a real Tor daemon is running and reachable.
- The compiled portable EXE is a GUI app, so users do not need PowerShell or Command Prompt to run it once built.

## License

MIT
