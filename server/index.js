const server = require('./server');
const { Server } = require("socket.io");
const io = new Server(server);


// Serial Port Comunication
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');


const isOpen = IsOpen();

isOpen
    .then((USBport) => {
        Open(USBport)
    })
    .catch( err =>{
        Close(err);
    })


function IsOpen(){
    return new Promise((resolve, reject)=>{
        const USBport = new SerialPort({ path: 'COM5', baudRate: 9600 });
    
        USBport.on('error', (err) => {
            reject(err);
        });
    
        USBport.on('open', () => {
            resolve(USBport);
        });
    });
}

function Open(USBport){
    const parser = USBport.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    
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
    io.on('connection', (socket)=>{
        console.log('a user connected');
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        }); 
    });
}

function Close(err){
    io.on('connection', (socket)=>{
        console.log('a user connected');
        
        io.emit('new info', 'ERROR, RFID reader disconnected');
        socket.on('disconnect', () => {
            console.log('user disconnected'); 
        }); 
    });
}

