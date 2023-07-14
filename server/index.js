const server = require('./server');
const { Server } = require("socket.io");
const io = new Server(server);


// Serial Port Comunication
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let USBport, parser;

const connectSerialPort = () => {
    const path = 'COM5';
    const baudRate = 9600;
    USBport = new SerialPort({ path, baudRate });

    USBport.on('open', Open);
    USBport.on('error', Close);
    USBport.on('close', Close);
}

function Open(){
    parser = USBport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('data', function (data) {
        console.log(data);
        if(data == ' 49 92 FA 6E'){
            USBport.write('OK', 'ascii');
            io.emit("new info", data);
        }
        else{
            USBport.write('Err', 'ascii');
            io.emit("new info", "UNKNOWN");
        }
    });
}

function Close(err){
    io.removeAllListeners();
        
    io.emit('new info', 'ERROR, RFID reader disconnected');
    setTimeout(() => {
        // console.log(io.rawListeners('connection'));
        // console.log(io.rawListeners('connection').find(el => el.listener.name == 'emmiteError'));
        console.log(io.rawListeners('connection').map(el => el.listener.name).includes('emitError'));
        console.log(USBport.rawListeners('on'));
        connectSerialPort();
    }, 2000);
}

connectSerialPort();