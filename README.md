# Tor Browser

This project is a lightweight, desktop privacy browser designed around Tor-compatible proxy settings and a status dashboard for relay and proxy connection stats.

It is not the official Tor Browser project. Instead, it acts as a convenience app that can connect to a Tor SOCKS5 or HTTP proxy (including the default Tor daemon at `127.0.0.1:9050`) and exposes connection status, latency, circuit metadata, and basic privacy metrics.

## Features

- Chromium-based browser through Electron
- Proxy configuration for Tor and other HTTP/SOCKS proxy servers
- Proxy connection status panel
- Circuit metadata display
- Latency and uptime stats
- Simple browser controls: back, forward, reload, stop, home, and direct URL entry
- Works without PowerShell, Command Prompt, or administrator rights for normal operation

## Requirements

- Node.js 18+
- npm
- A Tor daemon or another SOCKS5/HTTP proxy if you want to route traffic through it

## Run

```bash
npm install
npm start
```

## Default Tor configuration

If you have Tor installed and listening on the default port, the app will work with:

- Host: `127.0.0.1`
- Port: `9050`
- Type: `socks5`

## Notes

- If Tor is not running, the app still opens a browser; it will show the proxy as disconnected.
- Browser traffic is only anonymized if a real proxy/Tor service is available and your system is configured to use it.
- The app is meant as a proxy-aware browser shell and diagnostic dashboard, not a full custom Tor network implementation.
