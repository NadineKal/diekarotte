const express = require('express');
const app = express();

var fs = require('fs');
if(!fs.existsSync('./db')){
    fs.mkdirSync('./db')
}

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db/shop.db', (error) => {
    if(error){
        console.log(error.message);
    } else {
        console.log('connected to the database');
    }
});

let sql = `SELECT * FROM vorschlaege`;
db.all(sql, (error,rows) => {
    if (error){
        if (rows == null){
            db.run(`CREATE TABLE vorschlaege (gericht TEXT NOT NULL, ranking INTEGER DEFAULT 0)`,(error)=>{
                if(error){
                    console.log(error.message);
                } else {
                    console.log('Initialized table vorschlaege');
                }
            });
        }
    }
});

sql = `SELECT * FROM mitarbeiter`;
db.all(sql, (error,rows) => {
    if (error){
        if (rows == null){
            db.run(`CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, passwort TEXT NOT NULL)`,(error)=>{
                if(error){
                    console.log(error.message);
                } else {
                    console.log('Initialized table mitarbeiter');
                }
            });
        }
    }
});

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const port = 3000;
app.listen(port, function() {
    console.log("Listening on 3000");
});

// HTML-Dateien im Ordner public "sichtbar" machen
app.use(express.static(__dirname + '/'));

app.get("/", function(req, res){
    res.render('index');
});


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// Funktioniert so noch nicht, weil alle db-Funktionen keinen String sondern etwas Anderes ausgeben
app.post("/eingabe", function(req, res){
    const name = req.body.name;
    const passwort = req.body.passwort;
    console.log(name);
    if(db.get(`SELECT name FROM mitarbeiter WHERE name = '${name}'`) == name){
        if(db.get(`SELECT passwort FROM mitarbeiter WHERE name = '${name}'`) == passwort){
            res.render('administration');
        } else {
            res.render('login', {message: "Name und Passwort stimmen nicht überein!"});
        }           
    } else {
        res.render('login', {message: "Name unbekannt!"});
    }
});

app.post("/vorschlagSenden", function(req, res){
    const vorschlag = req.body.vorschlag;
    const sql = `insert into vorschlaege (gericht) values('${vorschlag}')`;
    db.run(sql);
    res.render('vorschlag');
});

app.get("/plaene", function(req, res){
    res.render('plaene');
});

app.get("/ranking", function(req, res){
    res.render('ranking');
});

app.get("/vorschlage", function(req, res){
    res.render('vorschlag');
});

app.get("/login", function(req, res){
    res.render('login', {message: "Melden Sie sich hier mit ihrem Namen und Ihrem Passwort an!"});
});