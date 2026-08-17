const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client } = require(path.resolve(__dirname, 'scratch/node_modules/pg'));
const signalR = require(path.resolve(__dirname, 'scratch/node_modules/@microsoft/signalr'));
const WebSocket = require(path.resolve(__dirname, 'scratch/node_modules/ws'));

// In Node environment, assign WebSocket globally so @microsoft/signalr uses it
global.WebSocket = WebSocket;

// Load Tunnels
const tunnelsConfigPath = path.resolve(__dirname, 'tunnels.json');
if (!fs.existsSync(tunnelsConfigPath)) {
    console.error('Error: tunnels.json not found!');
    process.exit(1);
}

const tunnels = JSON.parse(fs.readFileSync(tunnelsConfigPath, 'utf8'));
const BACKEND_URL = tunnels.backend;
const FRONTEND_URL = tunnels.frontend;

console.log('====================================================');
console.log('       NEXCLONE CLOUDFLARE TUNNEL E2E TEST SUITE     ');
console.log('====================================================');
console.log(`Backend Tunnel:  ${BACKEND_URL}`);
console.log(`Frontend Tunnel: ${FRONTEND_URL}`);
console.log('====================================================\n');

const DB_CONN_STR = "Host=tramway.proxy.rlwy.net;Port=37832;Database=railway;Username=postgres;Password=fjHiGhuAwFClkSnGjPrfwwTmNFGGjFEu;SSL Mode=Prefer;Trust Server Certificate=true;";

// Helper to convert ADO.NET connection string to pg config
function parsePgConnString(connStr) {
    const parts = connStr.split(';').reduce((acc, curr) => {
        const [k, v] = curr.split('=');
        if (k && v) acc[k.trim().toLowerCase()] = v.trim();
        return acc;
    }, {});

    return {
        host: parts.host,
        port: parseInt(parts.port, 10),
        database: parts.database,
        user: parts.username,
        password: parts.password,
        ssl: { rejectUnauthorized: false }
    };
}

async function runTests() {
    let passed = 0;
    let failed = 0;

    // Test 1: Frontend Reachability over Cloudflare Tunnel
    console.log('[TEST 1] Testing Frontend over Cloudflare Tunnel...');
    try {
        const feRes = await axios.get(FRONTEND_URL, { timeout: 15000 });
        if (feRes.status === 200) {
            console.log(`  ✓ Frontend reached successfully (HTTP ${feRes.status})`);
            passed++;
        } else {
            console.error(`  ✗ Frontend returned unexpected status: ${feRes.status}`);
            failed++;
        }
    } catch (e) {
        console.error(`  ✗ Frontend test failed:`, e.message);
        failed++;
    }

    // Test 2: Backend Public APIs over Cloudflare Tunnel
    console.log('\n[TEST 2] Testing Backend Public API over Cloudflare Tunnel...');
    try {
        const settingsRes = await axios.get(`${BACKEND_URL}/api/settings/public`, { timeout: 15000 });
        if (settingsRes.status === 200) {
            console.log(`  ✓ Backend /api/settings/public reached successfully (HTTP 200)`);
            console.log(`    MaintenanceMode: ${settingsRes.data?.MaintenanceMode ?? settingsRes.data?.maintenanceMode ?? 'OK'}`);
            passed++;
        } else {
            console.error(`  ✗ Backend public settings returned status: ${settingsRes.status}`);
            failed++;
        }
    } catch (e) {
        console.error(`  ✗ Backend API test failed:`, e.message);
        failed++;
    }

    // Test 3: Auth Flow (Register -> DB Verify -> Login -> Me) over Cloudflare Tunnel
    console.log('\n[TEST 3] Testing Full Auth Flow over Cloudflare Tunnel...');
    const testEmail = `test_cf_${Date.now()}@nexmedia-test.com`;
    const testPassword = 'Password123!';
    let jwtToken = null;

    try {
        // Step 3a: Register
        console.log(`  - Step 3a: Registering new test user (${testEmail})...`);
        const regRes = await axios.post(`${BACKEND_URL}/api/auth/register`, {
            email: testEmail,
            password: testPassword,
            fullName: 'Cloudflare E2E Tester'
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });
        console.log(`    ✓ Registered (HTTP ${regRes.status}): ${regRes.data?.message || 'OK'}`);

        // Step 3b: Verify in Postgres
        console.log(`  - Step 3b: Confirming email in database...`);
        const pgClient = new Client(parsePgConnString(DB_CONN_STR));
        await pgClient.connect();
        await pgClient.query('UPDATE "AspNetUsers" SET "EmailConfirmed" = true, "IsVerified" = true WHERE "Email" = $1', [testEmail]);
        await pgClient.end();
        console.log(`    ✓ User account verified in DB`);

        // Step 3c: Login
        console.log(`  - Step 3c: Logging in over Cloudflare Tunnel...`);
        const loginRes = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: testEmail,
            password: testPassword,
            deviceFingerprint: 'cf-e2e-fingerprint-123'
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        jwtToken = loginRes.data?.token || loginRes.data?.Token;
        if (!jwtToken) {
            throw new Error(`Login succeeded but token was not returned: ${JSON.stringify(loginRes.data)}`);
        }
        console.log(`    ✓ Login successful! JWT Token acquired (length: ${jwtToken.length})`);

        // Step 3d: Get Profile (/api/auth/me)
        console.log(`  - Step 3d: Accessing protected endpoint (/api/auth/me) with Bearer token...`);
        const meRes = await axios.get(`${BACKEND_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
            timeout: 15000
        });
        console.log(`    ✓ Profile fetched: Email=${meRes.data?.email}, FullName=${meRes.data?.fullName}, Role=${meRes.data?.role || 'User'}`);
        passed++;
    } catch (e) {
        console.error(`  ✗ Auth flow failed:`, e.response?.data || e.message);
        failed++;
    }

    // Test 4: SignalR Hubs over Cloudflare Tunnel (NotificationHub & TicketHub)
    console.log('\n[TEST 4] Testing SignalR over Cloudflare Tunnel...');
    if (!jwtToken) {
        console.error('  ✗ Skipping SignalR test because JWT token is missing.');
        failed++;
    } else {
        try {
            // Step 4a: SignalR Negotiate Endpoint
            console.log(`  - Step 4a: Testing SignalR Negotiation (/hubs/notification/negotiate)...`);
            const negRes = await axios.post(`${BACKEND_URL}/hubs/notification/negotiate?negotiateVersion=1`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
                timeout: 15000
            });
            console.log(`    ✓ Negotiate OK (connectionId: ${negRes.data?.connectionId}, transports: ${negRes.data?.availableTransports?.map(t => t.transport).join(', ')})`);

            // Step 4b: SignalR WebSocket Connection using @microsoft/signalr
            console.log(`  - Step 4b: Establishing SignalR WebSocket connection to NotificationHub...`);
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${BACKEND_URL}/hubs/notification`, {
                    accessTokenFactory: () => jwtToken,
                    skipNegotiation: false,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            let notificationReceived = false;
            hubConnection.on("ReceiveNotification", (title, message, type, url) => {
                console.log(`    [SignalR Notification] title: ${title}, message: ${message}`);
                notificationReceived = true;
            });

            await hubConnection.start();
            console.log(`    ✓ SignalR NotificationHub connected successfully! State: ${hubConnection.state} (ConnectionId: ${hubConnection.connectionId})`);

            // Step 4c: TicketHub Connection
            console.log(`  - Step 4c: Testing TicketHub (/hubs/ticket)...`);
            const ticketConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${BACKEND_URL}/hubs/ticket`, {
                    accessTokenFactory: () => jwtToken,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .build();

            await ticketConnection.start();
            console.log(`    ✓ TicketHub connected successfully! State: ${ticketConnection.state}`);

            // Invoke group join/leave
            await ticketConnection.invoke("JoinTicketGroup", "9999");
            console.log(`    ✓ Successfully joined TicketGroup ticket_9999`);
            await ticketConnection.invoke("LeaveTicketGroup", "9999");
            console.log(`    ✓ Successfully left TicketGroup ticket_9999`);

            await hubConnection.stop();
            await ticketConnection.stop();
            console.log(`    ✓ SignalR connections closed cleanly.`);
            passed++;
        } catch (e) {
            console.error(`  ✗ SignalR test failed:`, e.message);
            failed++;
        }
    }

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Fatal error during test run:', err);
    process.exit(1);
});
