const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');

const pathIndex = path.join(__dirname, "../public/index.html");

app.get('/', (req, res)=>{
    res.status(200);
    res.setHeader('Content-type', 'text/html');
    res.sendFile(pathIndex);
});

// io.on('connection', (socket)=>{
//     console.log('a user connected');
    
//     let inter = setInterval(()=>{
//         io.emit("new info", 'hola mundo');
//         console.log('otro');
//     }, 5000);
    
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         clearInterval(inter);
//     });
// });


const port = process.env.port || 3030;
const hostName = "localhost";

server.listen(port, ()=>{
    console.log(`Listen on http://${hostName}:${port}`);
});

module.exports = server;

// const server = http.createServer((req, res)=>{
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
// });