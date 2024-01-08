var socket = io();

// Status

const $disconnected = document.querySelector('#disconnected');
const $wait = document.querySelector('#wait');
const $correct = document.querySelector('#correct');
const $error = document.querySelector('#error');
const $employee_layer = document.querySelector('#emp_layer');

// Employee Layer

const $employee_img = document.querySelector('#emp_img');
const $employee_name = document.querySelector('#emp_name');
const $employee_position = document.querySelector('#emp_position');
const $currentHour = document.querySelector("#currentHour");
const $currentJourney = document.querySelector("#currentJourney");
const $arrivalHour = document.querySelector("#arrivalHour");
const $arrivalJourney = document.querySelector("#arrivalJourney");

// variables
let timeout;

socket.on('status', function(msg){
    if(msg == 'error'){
        $wait.style.display = 'none';
        $disconnected.style.display = '';
    }
    else{
        $disconnected.style.display = 'none';
        $wait.style.display = '';
    }
});

socket.on('new info', function(msg){
    clearTimeout(timeout);
    $employee_layer.style.display = 'none';
    $wait.style.display = '';
    if(msg){
        $wait.style.display = 'none';
        $correct.style.display = '';
        renderInfo(msg);
    }
    else{
        $wait.style.display = 'none';
        $error.style.display = '';
        setTimeout(() => {
            $wait.style.display = '';
            $error.style.display = 'none';
        }, 1000);
    }
});

function renderInfo(msg){
    
    $employee_name.textContent = msg.name;
    $employee_position.textContent = msg.position;
    $employee_img.src = msg.photo;
    $arrivalHour.innerText = msg.arrival_time.hour;
    $arrivalJourney.innerText = msg.arrival_time.journey;

    let time  = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? "0"+minutes : minutes;
    time = `${hours}:${minutes}`

    $currentHour.innerText = time;
    $currentJourney.innerText = ampm;
    
    setTimeout(() => {
        $correct.style.display = 'none';
        $employee_layer.style.display = '';
    }, 1000);
    timeout = setTimeout(() => {
        $employee_layer.style.display = 'none';
        $employee_img.src = '';
        
        $wait.style.display = '';
    }, 5000);
}

// $putInfo.append('Información a continuación:');
// let $txt = document.createElement('p');
// $putInfo.appendChild($txt);
// socket.on('new info', function( msg ){
//     if(msg) $txt.textContent = JSON.stringify(msg);
//     else $txt.textContent = "UNKNOWN";
// });