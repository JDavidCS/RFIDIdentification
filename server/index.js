const server = require('./server');
const { Server } = require("socket.io");
const io = new Server(server);


// Serial Port Comunication
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { getByRfid } = require('./controllers/ApiEmployee');

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
    try {
        parser = USBport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        io.emit('status', 'ok');
        
        console.log("\nSerialPort Connectect");
        parser.on('data', async function (data) {
            console.log(data);

            const employee = await getByRfid(data);
    
            if(employee){
                io.emit("new info", employee);
                USBport.write('OK', 'ascii');
            }
            else{
                USBport.write('Err', 'ascii');
                io.emit("new info", undefined);
            }

            // if(data == ' 49 92 FA 6E'){
            //     USBport.write('OK', 'ascii');
            //     io.emit("new info", data);
            // }
        });
        
    } catch (error) {
        console.log(err);
    }

}

function Close(err){
    delete USBport;
    io.removeAllListeners();
        
    io.emit('status', 'error');
    setTimeout(() => {
        // console.log(io.rawListeners('connection'));
        // console.log(io.rawListeners('connection').find(el => el.listener.name == 'emmiteError'));
        // console.log("SerialPort Connection have failed");
        connectSerialPort();
    }, 2000);
}

connectSerialPort();