const express = require('express');
const app = express();

var fs = require('fs');
if(!fs.existsSync('./db')){
    fs.mkdirSync('./db')
}

const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

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
            db.run(`CREATE TABLE vorschlaege (gid INTEGER PRIMARY KEY AUTOINCREMENT, gericht TEXT NOT NULL, ranking INTEGER DEFAULT 0)`,(error)=>{
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

sql = `SELECT * FROM studis`;
db.all(sql, (error,rows) => {
    if (error){
        if (rows == null){
            db.run(`CREATE TABLE studis (uid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, passwort TEXT NOT NULL)`,(error)=>{
                if(error){
                    console.log(error.message);
                } else {
                    console.log('Initialized table studis');
                }
            });
        }
    }
});

sql = `SELECT * FROM ranking`;
db.all(sql, (error,rows) => {
    if (error){
        if (rows == null){
            db.run(`CREATE TABLE ranking (uid INTEGER, gid INTEGER, FOREIGN KEY (uid) REFERENCES studis(uid), FOREIGN KEY (gid) REFERENCES vorschlage(gid))`,(error)=>{
                if(error){
                    console.log(error.message);
                } else {
                    console.log('Initialized table ranking');
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

app.post("/eingabe", function(req, res){
    const name = req.body.name;
    const passwort = req.body.passwort;
    db.get(`SELECT * FROM mitarbeiter WHERE name = '${name}'`,(err,row)=>{
        if(row == null){
            res.render('login', {message: "Name unbekannt!"});
            return;  
        }
        if(row.passwort == passwort){
            res.render('administration');
            return;
        } else {
            res.render('login', {message: "Name und Passwort stimmen nicht überein!"});
            return;
        }
    });
});

app.post("/vorschlagSenden", function(req, res){
    const vorschlag = req.body.vorschlag;
    const sql = `insert into vorschlaege (gericht) values('${vorschlag}')`;
    db.run(sql);
    
    db.get(`select * from vorschlaege where gericht = '${vorschlag}'`,(err, row) =>{
        const gid = row.gid;
        const sql1 = `insert into ranking (gid) values (${gid})`;
        db.run(sql1);
    });
    db.all(`SELECT gericht,ranking FROM vorschlaege`,(err,rows)=>{ 
        res.render('ranking', {"all": rows});
    });
    return;
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

app.post("/registrieren", function(req, res){
    const name = req.body.name;
    const passwort = req.body.passwort;
    const passwortwdh = req.body.passwortwdh;
    if(passwort != passwortwdh){
        res.render('registrierung', {message: "Passwörter stimmen nicht überein!"});
        return;
    }
    db.get(`select name from studis where name = '${name}'`, (err,row)=>{
        if(row != null){
            res.render('registrierung', {message: "Name bereits registriert!"})
            return;
        } else{
            const sql = `insert into studis (name, passwort) values('${name}','${passwort}')`
            db.run(sql);
        }
    });
    req.session.authenticated = true;
    req.session.username = name;
    res.render('vorschlag');
    return;
});

app.post("/studiLogin", function(req,res){
    const name = req.body.name;
    const passwort = req.body.passwort;
    db.get(`SELECT * FROM studis WHERE name = '${name}'`,(err,rows)=>{
        if(rows == null){
            res.render('vorschlag-login', {message: "Name unbekannt!"});
            return;
        }
        if(rows.passwort == passwort){
            req.session.authenticated = true;
            req.session.username = name;
            res.render('vorschlag');
            return;
        } else {
            res.render('vorschlag-login', {message: "Name und Passwort stimmen nicht überein!"});
            return;
        }
    });
});

app.get("/registrierung", function(req, res){
    res.render('registrierung', {message: "Hier als Student mit Namen und Passwort registrieren:"})
});

app.get("/plaene", function(req, res){
    res.render('plaene');
});

app.get("/ranking", function(req, res){
    if(!req.session.authenticated) {
        db.all(`SELECT gericht,ranking FROM vorschlaege`,(err,rows)=>{ 
            res.render('ranking', {"all": rows, "loggedin": 0});
            return;
        });
    } else{
        db.all(`SELECT gericht,ranking FROM vorschlaege`,(err,rows)=>{ 
            res.render('ranking', {"all": rows, "loggedin": 1});
            return;
        });
    }
});

app.get("/vorschlage", function(req, res){
    if (!req.session.authenticated) {
        res.render('vorschlag-login', {message: "Hier einloggen:"});
        return;
    }
    res.render('vorschlag');
});

app.get("/login", function(req, res){
    res.render('login', {message: "Melden Sie sich hier mit ihrem Namen und Ihrem Passwort an!"});
});

app.get("/administration", function(req, res){
    res.render('administration');
});

app.get("/wochenuebersicht", function(req, res){
    db.all(`SELECT tag,gericht,preis,eigenschaft FROM gerichte`,(err,rows)=>{ 
        res.render('wochenuebersicht', {"all":rows});
    });
});
app.get("/montag", function(req, res){
    db.all(`SELECT gericht,preis,eigenschaft FROM gerichte where tag = "Montag"`, (err,rows)=>{
        res.render('montag', {"mon": rows});
    }); 
});
app.get("/dienstag", function(req, res){
    db.all(`SELECT gericht,preis,eigenschaft FROM gerichte where tag = "Dienstag"`, (err,rows)=>{
        res.render('dienstag', {"die": rows});
    });
});
app.get("/mittwoch", function(req, res){
    db.all(`SELECT gericht,preis,eigenschaft FROM gerichte where tag = "Mittwoch"`, (err,rows)=>{
        res.render('mittwoch', {"mit": rows});
    });
});
app.get("/donnerstag", function(req, res){
    db.all(`SELECT gericht,preis,eigenschaft FROM gerichte where tag = "Donnerstag"`, (err,rows)=>{
        res.render('donnerstag', {"don": rows});
    });
});
app.get("/freitag", function(req, res){
    db.all(`SELECT gericht,preis,eigenschaft FROM gerichte where tag = "Freitag"`, (err,rows)=>{
        res.render('freitag', {"fre": rows});
    });
});
app.get("/impressum", function(req, res){
    res.render('impressum');
});
app.get("/datenschutz", function(req, res){
    res.render('datenschutz');
});

app.get("/upvote", function(req, res){
    const gericht = req.body.gericht;
    const sql = `update vorschlaege ranking = ranking + 1 where gericht = ${gericht}`;
    if (!req.session.authenticated) { 
        db.all(`SELECT gericht,ranking FROM vorschlaege`,(err,rows)=>{ 
            res.render('ranking', {"all": rows, "loggedin": 2});
        });
    } else {
        db.all(`SELECT gericht,ranking FROM vorschlaege`,(err,rows)=>{ 
            res.render('ranking', {"all": rows, "loggedin": 1});
        });
    }
});