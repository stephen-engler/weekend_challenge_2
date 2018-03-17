console.log('in client');

$(document).ready(readyNow);

let calc;

let storedNumber;

let computationDone=false;

class Values {
    constructor(firstIn){
        this.num1 = firstIn;
        this.num2 = " ";
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
    $('#clear').on('click',clearFromServer);
    $('#enter').on('click', compute);
    $('.number').on('click', getNumber);
    $('#history').on('click','.pastCalc', getTheData);
    $('#delete').on('click', clearInputs);
    updateHistory();
}

function addNum(){
    calc = new Values(storedNumber);
    calc.operator = '+';
    storedNumber = "";
    $('#numberText').val(calc.num1 + calc.operator);
}

function subNum(){
    calc = new Values(storedNumber);
    calc.operator = '-';
    storedNumber = "";
    $('#numberText').val(calc.num1 + calc.operator);
}

function multiNum(){
    calc = new Values(storedNumber);
    calc.operator = '*';
    storedNumber = "";
    $('#numberText').val(calc.num1 + calc.operator);
}

function divNum(){
    calc = new Values(storedNumber);
    calc.operator = '/';
    storedNumber = "";
    $('#numberText').val(calc.num1 + calc.operator);
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
        let table = $('<tr class="pastCalc"></tr>');

        table.append('<td>'+values.num1+'</td>');
        table.append('<td>' + values.operator + '</td>');
        table.append('<td>' + values.num2 + '</td>');
        table.append('<td> = </td>');
        table.append('<td>' + values.answer + '</td>');
        table.data('calculation', values);

        $('#history').append(table);
    });
    let last = history.length -1;
    
    if(last >=0){
        let answer = history[last].answer;

        console.log(answer);
        let screenData=$('#numberText').val();
        $('#numberText').val(screenData + answer);
        $('#output').text('Answer: ' + answer);
    }
}

function clearFromServer(){
    $.ajax({
        url: '/value',
        type: 'DELETE',
        success: function(result){
            console.log('result');
            clearInputs();
            $('#history').empty();
        }
    });
}

function clearInputs(){
    $('#numberText').val('');
    $('#output').text('Answer: ');
}

function getNumber(){   
    if(computationDone){
        $('#numberText').val('');
        computationDone=false;
    } 
    let num = $(this).data('number');
    console.log(num);
    let screenText = $('#numberText').val();
    $('#numberText').val(screenText + num);
    storedNumber = num;
}

function compute(){
    calc.num2 = storedNumber;
    let screenText = $('#numberText').val();
    $('#numberText').val(screenText + '=');
    sendToServer(calc);
    computationDone = true;
    calc = " ";
}

function getTheData(){
    let pastCalc = $(this).data('calculation');
    console.log(pastCalc);
    $('#numberText').val(pastCalc.num1 + pastCalc.operator + pastCalc.num2 + '=' + pastCalc.answer);
}