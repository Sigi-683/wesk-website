const http = require('http');

const data = JSON.stringify({
    email: 'admin@wesk.com',
    password: 'admin123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        if (res.statusCode === 200) {
            console.log('Login Successful!');
            console.log('Response:', responseBody);
        } else {
            console.log('Login Failed.');
            console.log('Response:', responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('Error connecting to server:', error);
});

req.write(data);
req.end();
