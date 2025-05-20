const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const http = require("http");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  const startURL = "http://localhost:3000";

  const tryToLoad = () => {
    http
      .get(startURL, (res) => {
        if (res.statusCode === 200) {
          mainWindow.loadURL(startURL);
          mainWindow.once("ready-to-show", () => {
            mainWindow.show();
          });
        } else {
          setTimeout(tryToLoad, 1000);
        }
      })
      .on("error", (err) => {
        setTimeout(tryToLoad, 1000);
      });
  };

  tryToLoad();
}

app.whenReady().then(() => {
  const server = exec("npm run start");

  server.stdout.on("data", (data) => {
    console.log(`[Express STDOUT] ${data}`);
  });

  server.stderr.on("data", (data) => {
    console.error(`[Express STDERR] ${data}`);
  });

  createWindow();

  app.on("before-quit", () => {
    server.kill();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
