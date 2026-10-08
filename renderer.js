const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('torApp', {
  getStatus: () => ipcRenderer.invoke('proxy:get-status'),
  setProxy: (config) => ipcRenderer.invoke('proxy:set', config),
  detectTor: () => ipcRenderer.invoke('proxy:detect-tor'),
  navigate: (url) => ipcRenderer.invoke('browser:navigate', url)
});
