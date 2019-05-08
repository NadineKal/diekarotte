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
            db.run(`CREATE TABLE vorschlaege (gericht TEXT NOT NULL, ranking INTEGER)`,(error)=>{
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


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.post("/eingabe", function(req, res){
    const username = req.body.username;
    const passwort = req.body.passwort;
    if(db.get(`SELECT name FROM mitarbeiter WHERE user = '${username}'`) == username){
        if(db.get(`SELECT passwort FROM mitarbeiter WHERE user = '${username}'`) == passwort){
            res.render('administration')
        } else {
            res.render('login')
        }           
    } else {
        res.render('login')
    }
});