const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

console.log('Environment variables loaded:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✓' : '✗');
console.log('FIREBASE_AUTH_DOMAIN:', process.env.FIREBASE_AUTH_DOMAIN ? '✓' : '✗');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓' : '✗');
console.log('FIREBASE_APP_ID:', process.env.FIREBASE_APP_ID ? '✓' : '✗');

const port = 3000;

const app = express();

app.get('/config-check', (req, res) => {
    res.json({
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY ? 'loaded' : 'missing',
            authDomain: process.env.FIREBASE_AUTH_DOMAIN ? 'loaded' : 'missing',
            projectId: process.env.FIREBASE_PROJECT_ID ? 'loaded' : 'missing',
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET ? 'loaded' : 'missing',
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ? 'loaded' : 'missing',
            appId: process.env.FIREBASE_APP_ID ? 'loaded' : 'missing'
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, html) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Replace placeholders with environment variables
        const injectedHtml = html
            .replace('{{FIREBASE_API_KEY}}', process.env.FIREBASE_API_KEY || '')
            .replace('{{FIREBASE_AUTH_DOMAIN}}', process.env.FIREBASE_AUTH_DOMAIN || '')
            .replace('{{FIREBASE_PROJECT_ID}}', process.env.FIREBASE_PROJECT_ID || '')
            .replace('{{FIREBASE_STORAGE_BUCKET}}', process.env.FIREBASE_STORAGE_BUCKET || '')
            .replace('{{FIREBASE_MESSAGING_SENDER_ID}}', process.env.FIREBASE_MESSAGING_SENDER_ID || '')
            .replace('{{FIREBASE_APP_ID}}', process.env.FIREBASE_APP_ID || '');

        res.send(injectedHtml);
    });
});

app.listen(port, (req, res) => {
    console.log('server frontend is running on port', port);
});