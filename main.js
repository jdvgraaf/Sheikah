// electron.js
const { app, BrowserWindow } = require('electron');

// Create an Electron window and load the Next.js application
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
