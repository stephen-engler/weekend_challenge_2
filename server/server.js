let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.use(express.static('server/public'));








//spin up server
app.listen(PORT, () => {
    console.log('server is running on ' + PORT);
});


