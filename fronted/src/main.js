const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "c.tours - Конструктор путешествий",
    icon: path.join(__dirname, 'icon.png'), // Можешь потом добавить иконку
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // ВАЖНО: Здесь мы указываем адрес, где сейчас работает наш Vite
  // В идеале для релиза нужно собирать статику, но для диплома покатит и так
  win.loadURL('http://localhost:5173');
  
  // Убираем верхнее меню File/Edit/View (чтобы выглядело как нативное приложение)
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});