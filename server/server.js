let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let history = [];

//sets up bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
//sets port
const PORT = process.env.PORT || 8080;
//sets html
app.use(express.static('server/public'));
//post 
app.post('/value', (req,res)=>{
    let value = req.body;//gets what client sent
    console.log(value);
    calculate(value);//calculates the object
    history.push(value);//adds to the array
    res.sendStatus(200);
});
//returns history array
app.get('/value', (req, res)=>{
    res.send(history);
});
//empties history array
app.delete('/value', (req, res)=>{
    history = [];
    res.send(history);
});
//spin up server
app.listen(PORT, () => {
    console.log('server is running on ' + PORT);
});

//checks the operator, turns values to integers and set it equal to asnwer 
function calculate(values){
    if(values.operator === '+'){
        values.answer = parseInt(values.num1) + parseInt(values.num2);
    }
    else if(values.operator === '-'){
        values.answer = parseInt(values.num1) - parseInt(values.num2);
    }
    else if (values.operator === '*') {
        values.answer = parseInt(values.num1) * parseInt(values.num2);
    } 
    else if (values.operator === '/') {
        values.answer = parseInt(values.num1) / parseInt(values.num2);
        values.answer = values.answer.toFixed(2);
    }
}