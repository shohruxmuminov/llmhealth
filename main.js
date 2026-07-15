const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0a0a0c',
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  // Start the Next.js production server
  // We use 'npm run start' assuming the app is built
  nextProcess = spawn('npm', ['run', 'start'], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
  });

  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);
    if (data.toString().includes('started server on') || data.toString().includes('ready on')) {
      mainWindow.loadURL('http://localhost:3000');
    }
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (nextProcess) nextProcess.kill();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  if (nextProcess) nextProcess.kill();
});
