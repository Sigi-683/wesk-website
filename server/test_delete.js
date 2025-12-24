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
        console.log('--- STARTING DELETE TEST ---');

        // 1. Login Admin
        console.log('1. Logging in as Admin...');
        const adminLogin = await request('/auth/login', 'POST', { email: 'admin@wesk.com', password: 'admin123' });
        if (adminLogin.status !== 200) throw new Error('Admin login failed');
        const adminToken = adminLogin.body.token;
        console.log('Admin logged in.');

        // 2. Create Chalet
        console.log('2. Creating Test Chalet...');
        const chaletRes = await request('/chalets', 'POST', {
            name: 'ChaletToDelete',
            description: 'Temporary',
            capacity: 2
        }, adminToken);
        if (chaletRes.status !== 201) throw new Error('Create Chalet failed: ' + JSON.stringify(chaletRes.body));
        const chaletId = chaletRes.body.id;
        console.log(`Chalet created with ID: ${chaletId}`);

        // 3. Register User
        const userEmail = 'user' + Date.now() + '@test.com';
        console.log(`3. Registering user ${userEmail}...`);
        const userReg = await request('/auth/register', 'POST', { email: userEmail, password: 'password123' });
        if (userReg.status !== 201) throw new Error('User registration failed');
        const userToken = userReg.body.token;
        const userId = userReg.body.user.id;
        console.log(`User registered ID: ${userId}`);

        // 4. Select Chalet
        console.log('4. User selecting chalet...');
        const selectRes = await request(`/chalets/${chaletId}/select`, 'POST', {}, userToken);
        if (selectRes.status !== 200) throw new Error('Select chalet failed: ' + JSON.stringify(selectRes.body));
        console.log('Chalet selected.');

        // 5. Delete Chalet
        console.log('5. Admin deleting chalet...');
        const deleteRes = await request(`/chalets/${chaletId}`, 'DELETE', {}, adminToken);
        if (deleteRes.status !== 200) throw new Error('Delete chalet failed: ' + JSON.stringify(deleteRes.body));
        console.log('Chalet deleted.');

        // 6. Verify Deletion
        console.log('6. Verifying deletion...');
        // Check chalet is gone (creating a get route for specific chalet or just list and check)
        // We'll check via list for simplicity as we have get all access
        const listRes = await request('/chalets', 'GET', null, adminToken);
        const exists = listRes.body.find(c => c.id === chaletId);
        if (exists) throw new Error('Chalet still exists in list!');
        console.log('Chalet successfully removed from list.');

        // 7. Verify User unlinked (Using get users admin route or profile)
        // Let's use get all users as admin to be sure
        const usersRes = await request('/users', 'GET', null, adminToken);
        const user = usersRes.body.find(u => u.id === userId);

        if (user.ChaletId !== null) {
            throw new Error(`User ChaletId is not null! It is: ${user.ChaletId}`);
        }
        console.log('User ChaletId is correctly NULL.');

        console.log('--- TEST PASSED SUCCESSFULLY ---');

    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error.message);
        process.exit(1);
    }
}

test();
