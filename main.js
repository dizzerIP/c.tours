const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "c.tours - Конструктор путешествий",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Загружаем наш локальный сайт Vite
  win.loadURL('http://localhost:5173');
  
  // Скрываем верхнее меню (File, Edit, View)
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});