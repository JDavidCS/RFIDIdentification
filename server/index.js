const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const USBport = new SerialPort({ path: 'COM6', baudRate: 9600 });

const parser = USBport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', function (data) {
    console.log(data);

    if(data == ' 49 92 FA 6E'){
        USBport.write('OK', 'ascii');
    }
    else{
        USBport.write('Err', 'ascii');
    }
});