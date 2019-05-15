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

sql = `SELECT * FROM gerichte`;
db.all(sql, (error,rows) => {
    if (error){
        if (rows == null){
            db.run(`CREATE TABLE gerichte (tag TEXT NOT NULL, gericht TEXT NOT NULL, preis TEXT NOT NULL, eigenschaft TEXT NOT NULL)`,(error)=>{
                if(error){
                    console.log(error.message);
                } else {
                    console.log('Initialized table gerichte');
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
    db.get(`SELECT * FROM mitarbeiter WHERE name = '${name}'`,(err,row)=>{
        if(row == null){
            res.render('login', {message: "Name unbekannt!"});
        }
        if(row.passwort == passwort){
            res.render('administration');
        } else {
            res.render('login', {message: "Name und Passwort stimmen nicht überein!"});
        }
    });
});

app.post("/vorschlagSenden", function(req, res){
    const vorschlag = req.body.vorschlag;
    const sql = `insert into vorschlaege (gericht) values('${vorschlag}')`;
    db.run(sql);
    res.render('vorschlag');
});

app.post("/gerichte", function(req, res){
    const tag = req.body.tagauswahl;
    const gericht1 = req.body.gericht1; const preis1 = req.body.preis1; const eig1 = req.body.eigenschaft1;
    const gericht2 = req.body.gericht2; const preis2 = req.body.preis2; const eig2 = req.body.eigenschaft2;
    const gericht3 = req.body.gericht3; const preis3 = req.body.preis3; const eig3 = req.body.eigenschaft3;
    if(tag == "montag"){
        const del = `delete from gerichte where tag = 'Montag'`
        const sql1 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Montag", '${gericht1}', '${preis1}', '${eig1}')`;
        const sql2 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Montag", '${gericht2}', '${preis2}', '${eig2}')`;
        const sql3 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Montag", '${gericht3}', '${preis3}', '${eig3}')`;
        db.run(del);
        db.run(sql1); db.run(sql2); db.run(sql3);
    }
    if(tag == "dienstag"){
        const del = `delete from gerichte where tag = 'Dienstag'`
        const sql1 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Dienstag", '${gericht1}', '${preis1}', '${eig1}')`;
        const sql2 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Dienstag", '${gericht2}', '${preis2}', '${eig2}')`;
        const sql3 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Dienstag", '${gericht3}', '${preis3}', '${eig3}')`;
        db.run(del);
        db.run(sql1); db.run(sql2); db.run(sql3);
    }
    if(tag == "mittwoch"){
        const del = `delete from gerichte where tag = 'Mittwoch'`
        const sql1 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Mittwoch", '${gericht1}', '${preis1}', '${eig1}')`;
        const sql2 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Mittwoch", '${gericht2}', '${preis2}', '${eig2}')`;
        const sql3 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Mittwoch", '${gericht3}', '${preis3}', '${eig3}')`;
        db.run(del);
        db.run(sql1); db.run(sql2); db.run(sql3);
    }
    if(tag == "donnerstag"){
        const del = `delete from gerichte where tag = 'Donnerstag'`
        const sql1 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Donnerstag", '${gericht1}', '${preis1}', '${eig1}')`;
        const sql2 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Donnerstag", '${gericht2}', '${preis2}', '${eig2}')`;
        const sql3 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Donnerstag", '${gericht3}', '${preis3}', '${eig3}')`;
        db.run(del);
        db.run(sql1); db.run(sql2); db.run(sql3);
    }
    if(tag == "freitag"){
        const del = `delete from gerichte where tag = 'Freitag'`
        const sql1 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Freitag", '${gericht1}', '${preis1}', '${eig1}')`;
        const sql2 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Freitag", '${gericht2}', '${preis2}', '${eig2}')`;
        const sql3 = `insert into gerichte (tag, gericht, preis, eigenschaft) values ("Freitag", '${gericht3}', '${preis3}', '${eig3}')`;
        db.run(del);
        db.run(sql1); db.run(sql2); db.run(sql3);
    }
    res.render('plaene');
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

app.get("/administration", function(req, res){
    res.render('administration');
});

app.get("/wochenuebersicht", function(req, res){
    res.render('wochenuebersicht');
});
app.get("/montag", function(req, res){
    res.render('montag');
});
app.get("/dienstag", function(req, res){
    res.render('dienstag');
});
app.get("/mittwoch", function(req, res){
    res.render('mittwoch');
});
app.get("/donnerstag", function(req, res){
    res.render('donnerstag');
});
app.get("/freitag", function(req, res){
    res.render('freitag');
});
app.get("/impressum", function(req, res){
    res.render('impressum');
});
app.get("/datenschutz", function(req, res){
    res.render('datenschutz');
});