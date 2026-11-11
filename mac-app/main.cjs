'use strict';

const { app, BrowserWindow, net, protocol, session } = require('electron');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const appURL = 'studytime://desktop/index.html';
const files = new Set([
  'index.html', 'app.js', 'core.js', 'study.js', 'study-browser.js',
  'style.css', 'web.css', 'icon.svg', 'icon-192.png'
]);

protocol.registerSchemesAsPrivileged([
  { scheme: 'studytime', privileges: { standard: true, secure: true } }
]);

function allowScreenWakeLock(origin, permission) {
  return permission === 'screen-wake-lock' && /^studytime:\/\/desktop\/?$/.test(origin);
}

function openWindow() {
  const window = new BrowserWindow({
    title: '작심삼일 · 공부의 시간',
    width: 1020,
    height: 740,
    minWidth: 360,
    minHeight: 270,
    backgroundColor: '#f7fbff',
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.loadURL(appURL).catch(error => console.error('Could not open the app:', error));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(() => {
    protocol.handle('studytime', request => {
      const url = new URL(request.url);
      const file = url.pathname.slice(1);
      if (request.method !== 'GET' || url.host !== 'desktop' || !files.has(file)) {
        return new Response(null, { status: 404 });
      }
      return net.fetch(pathToFileURL(join(__dirname, 'web', file)).href);
    });

    const desktopSession = session.defaultSession;
    desktopSession.setPermissionCheckHandler((_contents, permission, origin) =>
      allowScreenWakeLock(origin, permission));
    desktopSession.setPermissionRequestHandler((_contents, permission, respond, details) => {
      const origin = details.requestingUrl?.replace(/\/index\.html$/, '') ?? '';
      respond(allowScreenWakeLock(origin, permission));
    });

    openWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) openWindow();
    });
    app.on('second-instance', () => {
      const window = BrowserWindow.getAllWindows()[0];
      if (!window) return openWindow();
      if (window.isMinimized()) window.restore();
      window.focus();
    });
  });
}
