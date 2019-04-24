const express = require('express');
const app = express();

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const port = 3000;
app.listen(port, function() {
    console.log("Listening on 3000");
});

// HTML-Dateien im Ordner public "sichtbar" machen
app.use(express.static(__dirname + '/'));


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

