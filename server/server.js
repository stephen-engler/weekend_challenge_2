let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let history = [];

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.use(express.static('server/public'));

app.post('/value', (req,res)=>{
    let value = req.body
    console.log(value);
    calculate(value);
    history.push(value);
    res.sendStatus(200);
});

app.get('/value', (req, res)=>{
    res.send(history);
});






//spin up server
app.listen(PORT, () => {
    console.log('server is running on ' + PORT);
});


function calculate(values){
    if(values.operator === 'add'){
        values.answer = parseInt(values.num1) + parseInt(values.num2);
    }
    else if(values.operator === 'subtract'){
        values.answer = parseInt(values.num1) - parseInt(values.num2);
    }
    else if (values.operator === 'multiply') {
        values.answer = parseInt(values.num1) * parseInt(values.num2);
    } 
    else if (values.operator === 'divide') {
        values.answer = parseInt(values.num1) / parseInt(values.num2);
    }
}