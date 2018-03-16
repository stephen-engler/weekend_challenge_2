console.log('in client');

$(document).ready(readyNow);

class Values {
    constructor(firstIn, secondIn){
        this.num1 = firstIn;
        this.num2 = secondIn;
        this.operator = " ";
        this.answer = " "
    }
}

function readyNow(){
    console.log('document loaded');
    $('#add').on('click', addNum);
    $('#subtract').on('click', subNum);
    $('#multiply').on('click', multiNum);
    $('#divide').on('click', divNum);
    updateHistory();

}


function addNum(){
    let value = getValues();
    value.operator = 'add';
    sendToServer(value);
}

function subNum(){
    let value = getValues();
    value.operator = 'subtract';
    sendToServer(value);
}

function multiNum(){
    let value = getValues();
    value.operator = 'multiply';
    sendToServer(value);
}

function divNum(){
    let value = getValues();
    value.operator = 'divide';
    sendToServer(value);
}

function updateHistory(){
    $.ajax({
        type: 'GET',
        url: '/value'
    }).done(function(response){
        console.log(response);
        appendToDom(response);
    })
}

function getValues(){
    let num1 = $('#number1').val();
    let num2 = $('#number2').val();

    num1 = parseInt(num1);
    num2 = parseInt(num2);

    let numbers = new Values(num1, num2);

    console.log(numbers);

    return numbers;
}

function sendToServer(value){
    $.ajax({
        type: 'POST',
        data: value,
        url: '/value'
    }).done(function (response) {//need to wait till post request sends back response before doing get 
        //response from a post will just be 200 sucess
        console.log(response);
        updateHistory();
     
    }).fail(function (response) {
        alert('something went wrong');
    });
}

function appendToDom(history){

}