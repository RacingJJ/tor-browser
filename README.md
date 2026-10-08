const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const net = require('net');

let mainWindow;

const defaultConfig = {
  enabled: false,
  host: '127.0.0.1',
  port: 9050,
  type: 'socks5',
  mode: 'tor',
  username: '',
  password: ''
};

let currentConfig = { ...defaultConfig };
let metrics = {
  status: 'disconnected',
  latencyMs: 0,
  relayCount: 0,
  guard: 'None',
  middle: 'None',
  exit: 'None',
  online: false,
  lastUpdated: null
};

async function autoDetectTor() {
  const probeHost = '127.0.0.1';
  const probePort = 9050;
  const result = await probeSocket(probeHost, probePort);

  if (!result.connected) {
    currentConfig = { ...defaultConfig, enabled: false };
    await setBrowserProxy(currentConfig);
    return { ...currentConfig, connected: false, status: 'disconnected', latencyMs: 0 };
  }

  const detected = {
    ...defaultConfig,
    enabled: true,
    host: probeHost,
    port: probePort,
    type: 'socks5',
    mode: 'tor'
  };

  currentConfig = detected;
  await setBrowserProxy(detected);
  return getProxyStatus();
}

function updateMetrics(partial) {
  metrics = { ...metrics, ...partial, lastUpdated: new Date().toISOString() };
}

function buildProxyString(config) {
  if (!config.enabled || !config.host || !config.port) {
    return '';
  }

  const protocol = config.type === 'http' ? 'http://' : config.type === 'socks5' ? 'socks5://' : 'socks4://';
  return `${protocol}${config.host}:${config.port}`;
}

async function setBrowserProxy(config) {
  const rules = buildProxyString(config);
  const targetSession = mainWindow ? mainWindow.webContents.session : session.defaultSession;

  if (!rules) {
    await targetSession.setProxy({ mode: 'direct' });
    updateMetrics({ status: 'direct', online: false, latencyMs: 0 });
    return;
  }

  await targetSession.setProxy({
    mode: 'fixed_servers',
    proxyRules: rules,
    proxyBypassRules: 'localhost,127.0.0.1'
  });

  updateMetrics({
    status: 'connected',
    online: true,
    guard: config.mode === 'tor' ? 'Guard relay' : 'Configured endpoint',
    middle: config.mode === 'tor' ? 'Middle relay' : 'Proxy hop',
    exit: config.mode === 'tor' ? 'Exit relay' : 'Exit node'
  });
}

function probeSocket(host, port) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let settled = false;

    const finish = (connected) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({ connected, latencyMs: connected ? Date.now() - start : 0 });
    };

    socket.setTimeout(1200);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect({ host, port });
  });
}

async function getProxyStatus() {
  const host = currentConfig.host || '127.0.0.1';
  const port = Number(currentConfig.port || 9050);

  if (!currentConfig.enabled || !host || !port) {
    return {
      ...currentConfig,
      connected: false,
      status: 'disabled',
      latencyMs: 0,
      guard: 'None',
      middle: 'None',
      exit: 'None',
      relayCount: 0,
      mode: currentConfig.mode,
      online: false
    };
  }

  const socketProbe = await probeSocket(host, port);
  const connected = socketProbe.connected;

  const report = {
    ...currentConfig,
    connected,
    status: connected ? 'connected' : 'disconnected',
    latencyMs: connected ? socketProbe.latencyMs : 0,
    mode: currentConfig.mode,
    relayCount: connected ? 3 : 0,
    guard: connected ? 'Guard relay' : 'None',
    middle: connected ? 'Middle relay' : 'None',
    exit: connected ? 'Exit relay' : 'None',
    online: connected
  };

  updateMetrics(report);
  return report;
}

async function setProxyFromApp(config) {
  currentConfig = { ...defaultConfig, ...config };
  await setBrowserProxy(currentConfig);
  return getProxyStatus();
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Tor Browser',
    backgroundColor: '#0b1020',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.webContents.on('did-finish-load', async () => {
    updateMetrics({ status: 'ready' });
    await autoDetectTor();
  });
}

ipcMain.handle('proxy:get-status', async () => getProxyStatus());
ipcMain.handle('proxy:set', async (_event, config) => setProxyFromApp(config));
ipcMain.handle('proxy:detect-tor', async () => autoDetectTor());
ipcMain.handle('browser:navigate', async (_event, url) => {
  if (mainWindow && url) {
    try {
      await mainWindow.webContents.send('browser:load-url', url);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  return { ok: false, error: 'No browser window available' };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
