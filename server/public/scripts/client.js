console.log('in client');

$(document).ready(readyNow);

let calc; //declares calc as a global variable so other functions have access when it's an object

let storedNumber; //stores the number pressed as a global

let computationDone = false; // used for checking is user is done entering numbers

let allNumbersEntered = false;

//makes a class Values that will be sent to server
class Values {
    constructor(firstIn) {
        this.num1 = firstIn;
        this.num2 = " ";
        this.operator = " ";
        this.answer = " ";
    }
}
//on doc load, sets up event listeners and updates history
function readyNow() {
    console.log('document loaded');
    addClickHandlers();
    updateHistory();
}
//adds event handlers
function addClickHandlers() {
    $('#clear').on('click', clearFromServer);
    $('#enter').on('click', compute);
    $('.number').on('click', getNumber);
    $('#history').on('click', '.pastCalc', getTheData);
    $('#delete').on('click', clearInputs);
    $('.operator').on('click', getOperator);
}
//get the operator for thegit a button clicked
function getOperator() {
    calc = new Values(storedNumber); //makes new value object with stored number
    calc.operator = $(this).data('operator'); //adds the operator to the object
    storedNumber = ""; //clears storedNumber now that it is in the object
    $('#numberText').val(calc.num1 + calc.operator); //updates the text box with new values
}
//GETs the history from the server
function updateHistory() {
    $.ajax({
        type: 'GET',
        url: '/value'
    }).done(function (response) {
        console.log(response);
        //appends the response from the server to the dom
        appendToDom(response);
    });
}
//POSTs the new computation to the server, updates history on response
function sendToServer(value) {
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
//appends the history from server to dom
function appendToDom(history) {
    $('#history').empty(); //clears history
    history.forEach(function (values) { //loops through history array and appends to dom
        let table = $('<tr class="pastCalc"></tr>');
        table.data('calculation', values); //stores values in the table for future use


        
        table.append('<th scope="row"></th>');
        table.append('<td>' + values.num1 + '</td>');
        table.append('<td>' + values.operator + '</td>');
        table.append('<td>' + values.num2 + '</td>');
        table.append('<td> = </td>');
        table.append('<td>' + values.answer + '</td>');

        $('#history').append(table);
    });
    let last = history.length - 1;

    if (last >= 0) { //checks to see if history array has any values in it
        let answer = history[last].answer;
        let screenData = $('#numberText').val(); //gets past calculations from text box
        $('#numberText').val(screenData + answer); //adds answer to text box
    }
}
//DELETEs the history array server side
function clearFromServer() {
    $.ajax({
        url: '/value',
        type: 'DELETE',
        success: function (result) {
            console.log('result');
            clearInputs();
            $('#history').empty();
        }
    });
}
//clears inputs
function clearInputs() {
    $('#numberText').val('');
    $('#output').text('Answer: ');
    storedNumber='';
    calc='';
}
//gets the number data from button clicked, updates the text box
function getNumber() {
    if (computationDone) { //clears the inputs if the computation is Complete, essentially resets if a new calculation
        $('#numberText').val('');
        storedNumber = '';
        computationDone = false;
    }//end if
    if(!allNumbersEntered){
        let num = $(this).data('number'); //gets which number is pressed
        console.log(num);
        let screenText = $('#numberText').val(); //gets any past numbers and operators from text box

        let numString = num.toString();

        console.log(numString);

        $('#numberText').val(screenText + numString); //updates the text box with new value

        storedNumber += numString; //stores the num in the global variable for future use
        console.log('stored number: ', storedNumber);
    }
}
//gets last number, updates the text box and calls sendToServer with complete Calc
function compute() {
    calc.num2 = storedNumber; //adds global number to object
    let screenText = $('#numberText').val(); //updates screen
    $('#numberText').val(screenText + '=');
    sendToServer(calc); //sends calc object to server
    computationDone = true; //sets global to true so other functions know to clear inputs on next number click
    calc = " "; //clears the global calc variable after it's sent to the server
}
//gets past data object from histor     table
function getTheData() {
    let pastCalc = $(this).data('calculation'); //gets the object data stored i     table
    console.log(pastCalc);
    $('#numberText').val(pastCalc.num1 + pastCalc.operator + pastCalc.num2 + '=' + pastCalc.answer); //puts data in text box
}