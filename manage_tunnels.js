const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Kill any existing cloudflared
try {
    execSync('taskkill /F /IM cloudflared.exe', { stdio: 'ignore' });
} catch (e) {}

const cloudflaredPath = path.resolve(__dirname, 'cloudflared.exe');

function startTunnel(name, port) {
    return new Promise((resolve, reject) => {
        const logFile = path.resolve(__dirname, `${name}_tunnel.log`);
        try { fs.writeFileSync(logFile, ''); } catch (e) {}

        const proc = spawn(cloudflaredPath, [
            'tunnel',
            '--url', `http://127.0.0.1:${port}`,
            '--logfile', logFile
        ], {
            stdio: 'ignore'
        });

        let resolved = false;
        const urlRegex = /https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/;

        const checkInterval = setInterval(() => {
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const match = content.match(urlRegex);
                if (match && !resolved) {
                    resolved = true;
                    clearInterval(checkInterval);
                    resolve({ name, url: match[0], pid: proc.pid, proc });
                }
            }
        }, 500);

        proc.on('exit', (code) => {
            clearInterval(checkInterval);
            if (!resolved) {
                reject(new Error(`${name} tunnel exited prematurely with code ${code}`));
            } else {
                console.log(`[Tunnels] ${name} tunnel exited with code ${code}`);
            }
        });

        setTimeout(() => {
            if (!resolved) {
                clearInterval(checkInterval);
                reject(new Error(`Timeout waiting for ${name} tunnel URL`));
            }
        }, 30000);
    });
}

async function main() {
    console.log('[Tunnels] Starting Backend (8080) and Frontend (3000) Cloudflare Tunnels...');
    const [be, fe] = await Promise.all([
        startTunnel('backend', 8080),
        startTunnel('frontend', 3000)
    ]);

    const result = {
        backend: be.url,
        frontend: fe.url,
        backendPid: be.pid,
        frontendPid: fe.pid,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(path.resolve(__dirname, 'tunnels.json'), JSON.stringify(result, null, 2));
    console.log('[Tunnels] ONLINE:');
    console.log(`  Backend URL:  ${be.url}`);
    console.log(`  Frontend URL: ${fe.url}`);

    // Keep process alive indefinitely
    setInterval(() => {
        // Heartbeat
    }, 30000);
}

main().catch(err => {
    console.error('[Tunnels] Error:', err);
    process.exit(1);
});
