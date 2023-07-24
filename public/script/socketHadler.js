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
        setTimeout(() => {
            renderInfo(msg);
        }, 1000);
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
    $correct.style.display = 'none';
    $employee_layer.style.display = '';

    $employee_name.textContent = msg.name;
    $employee_position.textContent = msg.position;

    timeout = setTimeout(() => {
        $employee_layer.style.display = 'none';
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