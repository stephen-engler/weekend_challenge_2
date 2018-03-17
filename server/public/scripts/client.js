console.log('in client');

$(document).ready(readyNow);

let calc;//declares calc as a global variable so other functions have access when it's an object

let storedNumber;//stores the number pressed as a global

let computationDone=false;//

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
    addClickHandlers();    
    updateHistory();
}

function addClickHandlers(){
    $('#clear').on('click', clearFromServer);
    $('#enter').on('click', compute);
    $('.number').on('click', getNumber);
    $('#history').on('click', '.pastCalc', getTheData);
    $('#delete').on('click', clearInputs);
    $('.operator').on('click', getOperator);
}

function getOperator(){
    calc = new Values(storedNumber);//makes new value object with stored number
    calc.operator = $(this).data('operator'); //adds the operator to the object
    storedNumber = "";//clears storedNumber now that it is in the object
    $('#numberText').val(calc.num1 + calc.operator);//updates the text box with new values
}

function updateHistory(){
    $.ajax({
        type: 'GET',
        url: '/value'
    }).done(function(response){
        console.log(response);
        //appends the response from the server to the dom
        appendToDom(response);
    });
}

function sendToServer(value){
    $.ajax({
        type: 'POST',
        data: value,
        url: '/value'
    }).done(function (response) {
        //updates the history only after a response is heard from server
        console.log(response);
        updateHistory();
     
    }).fail(function (response) {
        alert('something went very very very wrong');
    });
}

function appendToDom(history){
    $('#history').empty();//clears history
    history.forEach(function(values){//loops through history array and appends to dom
        let table = $('<tr class="pastCalc"></tr>');

        table.append('<td>'+values.num1+'</td>');
        table.append('<td>' + values.operator + '</td>');
        table.append('<td>' + values.num2 + '</td>');
        table.append('<td> = </td>');
        table.append('<td>' + values.answer + '</td>');
        table.data('calculation', values);//stores values in the table for future use

        $('#history').append(table);
    });
    let last = history.length -1;
    
    if(last >=0){//checks to see if history array has any values in it
        let answer = history[last].answer;
        let screenData=$('#numberText').val();//gets past calculations from text box
        $('#numberText').val(screenData + answer);//adds answer to text box
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
    if(computationDone){//clears the inputs if the computation is Complete, essentially resets if a new calculation
        $('#numberText').val('');
        computationDone=false;
    } 
    let num = $(this).data('number');//gets which number is pressed
    console.log(num);
    let screenText = $('#numberText').val();//gets any past numbers and operators from text box
    $('#numberText').val(screenText + num);//updates the text box with new value
    storedNumber = num;//stores the num in the global variable for future use
}

function compute(){
    calc.num2 = storedNumber;//adds global number to object
    let screenText = $('#numberText').val();//updates screen
    $('#numberText').val(screenText + '=');
    sendToServer(calc);//sends calc object to server
    computationDone = true;//sets global to true so other functions know to clear inputs on next number click
    calc = " ";//clears the global calc variable after it's sent to the server
}

function getTheData(){
    let pastCalc = $(this).data('calculation');//gets the object data stored in table
    console.log(pastCalc);
    $('#numberText').val(pastCalc.num1 + pastCalc.operator + pastCalc.num2 + '=' + pastCalc.answer);//puts data in text box
}