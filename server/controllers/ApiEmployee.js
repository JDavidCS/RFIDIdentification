const fs = require( 'fs/promises' );
const { type } = require('os');
const path = require( 'path' );
const { send } = require('process');

const pathJSON = path.join(__dirname, '../data/data.json');

// Leer el Archivo JSON donde se guarda la información
const toRead = async() =>{
    const data = await fs.readFile(pathJSON, 'utf-8');    

    return JSON.parse(data);
}

exports.getByRfid = async(id) =>{
    const data = await toRead();
    return data.Employees.find(emp => emp.id_rfid === id);
}

const playApp = async() =>{
    try{
        const data = await toRead();
        const json = JSON.parse(data)
        console.log(json.Employees);
    }catch(err){

    }
}

playApp();