const http = require('http');

function request(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = responseBody ? JSON.parse(responseBody) : {};
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: responseBody });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function test() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        const password = 'password123';

        console.log(`1. Registering user ${email}...`);
        const regRes = await request('/auth/register', 'POST', { email, password });
        if (regRes.status !== 201) throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
        console.log('User registered.');

        const token = regRes.body.token;

        console.log('2. Testing Get Profile...');
        const profileRes = await request('/auth/me', 'GET', null, token);
        if (profileRes.status !== 200) {
            console.log('Profile Response:', profileRes.body);
            throw new Error('Get Profile failed');
        }
        console.log('Profile access successful!');

        console.log('3. Testing Select Chalet (ID: 1)...');
        const selectRes = await request('/chalets/1/select', 'POST', {}, token);
        if (selectRes.status !== 200) {
            console.log('Select Chalet Response:', selectRes.body);
            throw new Error('Select Chalet failed');
        }
        console.log('Chalet selected successfully!');

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

test();
