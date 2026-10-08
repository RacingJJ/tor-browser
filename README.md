# Tor Browser

A privacy-focused browser with Tor networking and proxy capabilities with anonymity statistics.

## Features

- **Tor Integration**: Built-in SOCKS5 proxy support for Tor network connectivity
- **Auto-Detection**: Automatic detection of Tor proxy on localhost:9050
- **Anonymity Metrics**: Real-time anonymity statistics including relay information
- **Proxy Management**: Easy configuration and switching between proxy modes
- **Privacy-First**: Minimal tracking, context-isolated rendering

## Prerequisites

Before building and running this application, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Tor** (optional but recommended) - [Download](https://www.torproject.org/download/)
  - On macOS: `brew install tor`
  - On Ubuntu/Debian: `sudo apt-get install tor`
  - On Windows: Download from Tor Project website

## Building

### 1. Clone the Repository

```bash
git clone https://github.com/RacingJJ/tor-browser.git
cd tor-browser
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

**Development Mode:**
```bash
npm start
```

**Build for Production:**
```bash
npm run build
```

## Configuration

The browser auto-detects Tor on the default SOCKS5 proxy (127.0.0.1:9050). You can configure custom proxy settings through the application UI:

- **Host**: Proxy server address (default: 127.0.0.1)
- **Port**: Proxy port (default: 9050)
- **Type**: SOCKS5, SOCKS4, or HTTP
- **Mode**: Tor or custom proxy

## Project Structure

- `main.js` - Electron main process with proxy management
- `preload.js` - Preload script for IPC communication
- `index.html` - Main application window
- `src/` - UI components and styling

## Technologies

- **Electron** - Cross-platform desktop application framework
- **Node.js** - JavaScript runtime
- **HTML/CSS/JavaScript** - User interface

## License

This project is open source and available on GitHub.

## Support

For issues, feature requests, or questions, please visit the [GitHub repository](https://github.com/RacingJJ/tor-browser).
