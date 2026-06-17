const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let javaProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "StockFlow Pro",
    autoHideMenuBar: true
  });

  // En developpement, on charge le port local Vite
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Sinon on charge les fichiers compiles
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Browser Console] ${message} (line ${line} in ${sourceId})`);
  });
}

function startJavaBackend() {
  // Chemin vers le dossier du backend
  const backendPath = path.join(__dirname, '../../stockflow-backend');
  
  // Demarrage via Maven pour le developpement
  // En production, il vaudrait mieux utiliser 'java -jar target/backend-0.0.1-SNAPSHOT.jar'
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'mvn.cmd' : 'mvn';

  javaProcess = spawn(cmd, ['spring-boot:run'], {
    cwd: backendPath,
    shell: true
  });

  javaProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  javaProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

app.whenReady().then(() => {
  startJavaBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (javaProcess) {
      // Arreter le backend Java quand l'app se ferme
      javaProcess.kill('SIGINT');
    }
    app.quit();
  }
});

app.on('quit', () => {
  if (javaProcess) {
    javaProcess.kill('SIGINT');
  }
});
