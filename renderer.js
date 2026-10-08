const addressBar = document.getElementById('addressBar');
const browserView = document.getElementById('browserView');
const proxyForm = document.getElementById('proxyForm');
const connectionStatus = document.getElementById('connectionStatus');
const latencyValue = document.getElementById('latencyValue');
const relayCount = document.getElementById('relayCount');
const guardValue = document.getElementById('guardValue');
const middleValue = document.getElementById('middleValue');
const exitValue = document.getElementById('exitValue');
const statusDot = document.getElementById('statusDot');
const proxyType = document.getElementById('proxyType');
const proxyHost = document.getElementById('proxyHost');
const proxyPort = document.getElementById('proxyPort');
const proxyMode = document.getElementById('proxyMode');
const proxyEnabled = document.getElementById('proxyEnabled');

const navButtons = {
  back: document.getElementById('backButton'),
  forward: document.getElementById('forwardButton'),
  refresh: document.getElementById('refreshButton'),
  home: document.getElementById('homeButton')
};

function toUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function setStatusUI(status) {
  const connected = status.connected === true || status.status === 'connected';
  connectionStatus.textContent = (status.status || 'disconnected').toUpperCase();
  statusDot.classList.toggle('connected', connected);
  latencyValue.textContent = `${status.latencyMs || 0} ms`;
  relayCount.textContent = String(status.relayCount || 0);
  guardValue.textContent = status.guard || 'None';
  middleValue.textContent = status.middle || 'None';
  exitValue.textContent = status.exit || 'None';
}

async function refreshStatus() {
  const status = await window.torApp.getStatus();
  setStatusUI(status);
  proxyType.value = status.type || 'socks5';
  proxyHost.value = status.host || '127.0.0.1';
  proxyPort.value = status.port || 9050;
  proxyMode.value = status.mode || 'tor';
  proxyEnabled.checked = Boolean(status.enabled);
}

async function applyProxy(event) {
  event.preventDefault();

  const config = {
    enabled: proxyEnabled.checked,
    type: proxyType.value,
    host: proxyHost.value.trim() || '127.0.0.1',
    port: Number(proxyPort.value) || 9050,
    mode: proxyMode.value
  };

  const status = await window.torApp.setProxy(config);
  setStatusUI(status);
  browserView.reload();
}

function attachBrowserEvents() {
  browserView.addEventListener('did-finish-load', async () => {
    const url = browserView.getURL();
    addressBar.value = url;
    await refreshStatus();
  });

  browserView.addEventListener('did-start-loading', () => {
    connectionStatus.textContent = 'LOADING';
  });
}

function attachNavigation() {
  document.getElementById('addressForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = toUrl(addressBar.value);
    if (!url) return;
    browserView.src = url;
  });

  navButtons.back.addEventListener('click', () => browserView.goBack());
  navButtons.forward.addEventListener('click', () => browserView.goForward());
  navButtons.refresh.addEventListener('click', () => browserView.reload());
  navButtons.home.addEventListener('click', () => {
    browserView.src = 'https://check.torproject.org/';
    addressBar.value = 'https://check.torproject.org/';
  });
}

proxyForm.addEventListener('submit', applyProxy);
attachBrowserEvents();
attachNavigation();
refreshStatus();
