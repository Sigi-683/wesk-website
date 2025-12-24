const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function testSecurity() {
    console.log('Starting Security Verification...');
    let passed = 0;
    let failed = 0;

    // Helper to log result
    const logResult = (name, success, msg) => {
        if (success) {
            console.log(`[PASS] ${name}`);
            passed++;
        } else {
            console.error(`[FAIL] ${name}: ${msg}`);
            failed++;
        }
    };

    try {
        // 1. Check Security Headers
        try {
            const res = await axios.get(BASE_URL, {
                headers: { 'Origin': 'http://localhost:5173' }
            });
            const headers = res.headers;
            console.log('Received Headers:', headers);

            // Helmet adds these
            logResult('X-DNS-Prefetch-Control', headers['x-dns-prefetch-control'] === 'off', 'Missing X-DNS-Prefetch-Control');
            logResult('X-Frame-Options', headers['x-frame-options'] === 'SAMEORIGIN', 'Missing X-Frame-Options');
            logResult('Strict-Transport-Security', headers['strict-transport-security'] !== undefined, 'Missing HSTS');
            logResult('X-Download-Options', headers['x-download-options'] === 'noopen', 'Missing X-Download-Options');
            logResult('X-Content-Type-Options', headers['x-content-type-options'] === 'nosniff', 'Missing X-Content-Type-Options');

            // Rate limit headers
            logResult('RateLimit-Limit', headers['ratelimit-limit'] !== undefined, 'Missing RateLimit headers');

        } catch (e) {
            console.error('Failed to connect to server for header check');
            if (e.response) {
                console.error('Status:', e.response.status);
                console.error('Data:', e.response.data);
                console.error('Headers:', e.response.headers);
            } else {
                console.error(e.message);
            }
            failed++;
        }

        // 2. Test Input Validation (Register)
        try {
            await axios.post(`${BASE_URL}/api/auth/register`, {
                email: 'invalid-email',
                password: '123'
            }, {
                headers: { 'Origin': 'http://localhost:5173' }
            });
            logResult('Input Validation (Invalid Email)', false, 'Should have rejected invalid email');
        } catch (e) {
            if (e.response && e.response.status === 400 && e.response.data.errors) {
                logResult('Input Validation (Invalid Email)', true);
            } else {
                logResult('Input Validation (Invalid Email)', false, `Unexpected error: ${e.message}`);
                if (e.response) console.error('Response Data:', e.response.data);
            }
        }

        // 3. Test File Upload (Security)
        // We need an admin token first, or just test the middleware if we can mock... 
        // Actually upload middleware is used in createChalet which is admin only.
        // Let's rely on unit test logic or try to hit an endpoint if accessible.
        // Since we didn't add a public upload endpoint, we can't easily integration test this without login.
        // We will skip strict integration test for upload here and rely on code review + unit assumption, 
        // or we could try to login as admin if we knew creds.
        // We have verify_login.js which has admin creds!

        let token = '';
        try {
            const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: 'admin@wesk.com',
                password: 'admin123'
            });
            token = loginRes.data.token;
            console.log('Logged in as Admin');
        } catch (e) {
            console.log('Could not login as admin (maybe DB not seeded?), skipping upload test.');
        }

        if (token) {
            try {
                const form = new FormData();
                // Create a dummy text file
                const dummyPath = path.join(__dirname, 'test.txt');
                fs.writeFileSync(dummyPath, 'This is a text file');
                form.append('image', fs.createReadStream(dummyPath));
                // Add required fields for chalet
                form.append('name', 'Test Chalet');
                form.append('capacity', 6);
                form.append('price', 1000);

                await axios.post(`${BASE_URL}/api/chalets`, form, {
                    headers: {
                        ...form.getHeaders(),
                        'Authorization': `Bearer ${token}`
                    }
                });
                logResult('File Upload Restriction', false, 'Should have rejected .txt file');
            } catch (e) {
                if (e.response) {
                    // We expect 500 or 400 depending on how multer error is handled. 
                    // Our app.js global handler returns 500 for unhandled errors, multer throws an error.
                    // The err.message should contain "Not an image!"
                    if (e.response.data.error === 'Not an image! Please upload an image.' || e.response.data.message.includes('Not an image')) {
                        logResult('File Upload Restriction', true);
                    } else {
                        // Check if it's the 500 wrapper
                        if (e.response.status === 500) {
                            // In production mode we hide error, in dev we see it. 
                            // We are running in dev likely.
                            if (JSON.stringify(e.response.data).includes('Not an image')) {
                                logResult('File Upload Restriction', true);
                            } else {
                                logResult('File Upload Restriction', false, `Unexpected error response: ${JSON.stringify(e.response.data)}`);
                            }
                        } else {
                            logResult('File Upload Restriction', false, `Unexpected status: ${e.response.status}`);
                        }
                    }
                } else {
                    logResult('File Upload Restriction', false, `Network error: ${e.message}`);
                }
            } finally {
                // Cleanup
                try { fs.unlinkSync(path.join(__dirname, 'test.txt')); } catch { }
            }
        }

    } catch (err) {
        console.error('Fatal error during test:', err);
    }

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
}

testSecurity();
