const { contextBridge, desktopCapturer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAudioSources: () => desktopCapturer.getSources({ types: ['window', 'screen'] })
}); 