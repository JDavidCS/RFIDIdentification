const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');

const pathIndex = path.join(__dirname, "../public/index.html");

app.use(express.static(__dirname + '/../public', { type: 'text/css' }));

app.get('/', (req, res)=>{
    res.status(200);
    // res.setHeader('Content-type', 'text/html');
    res.sendFile(pathIndex);
});

const port = process.env.port || 3030;
const hostName = "localhost";

server.listen(port, ()=>{
    console.log(`Listen on http://${hostName}:${port}`);
});

module.exports = server;
