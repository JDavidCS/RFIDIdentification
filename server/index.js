const server = require('./server');
const { Server } = require("socket.io");
const io = new Server(server);


// Serial Port Comunication
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const USBport = new SerialPort({ path: 'COM5', baudRate: 9600 });

const parser = USBport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

io.on('connection', (socket)=>{
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    parser.on('data', function (data) {
        io.emit("new info", data);
        console.log(data);
        if(data == ' 49 92 FA 6E'){
            USBport.write('OK', 'ascii');
        }
        else{
            USBport.write('Err', 'ascii');
        }
    });
    
    
});
