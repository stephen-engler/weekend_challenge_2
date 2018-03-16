console.log('in client');

$(document).ready(readyNow);

class Values {
    constructor(firstIn, secondIn){
        this.num1 = firstIn;
        this.num2 = secondIn;
        this.operator = " ";
        this.answer = " ";
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
    value.operator = '+';
    sendToServer(value);
}

function subNum(){
    let value = getValues();
    value.operator = '-';
    sendToServer(value);
}

function multiNum(){
    let value = getValues();
    value.operator = '*';
    sendToServer(value);
}

function divNum(){
    let value = getValues();
    value.operator = '/';
    sendToServer(value);
}

function updateHistory(){
    $.ajax({
        type: 'GET',
        url: '/value'
    }).done(function(response){
        console.log(response);
        appendToDom(response);
    });
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
    $('#history').empty();
    history.forEach(function(values){
        let table = $('<tr></tr>');

        table.append('<td>'+values.num1+'</td>');
        table.append('<td>' + values.operator + '</td>');
        table.append('<td>' + values.num2 + '</td>');
        table.append('<td> = </td>');
        table.append('<td>' + values.answer + '</td>');

        $('#history').append(table);
    });
    let last = history.length -1;
    let answer = history[last].answer;

    console.log(answer);

    $('#output').text('Answer: '+ answer);
}