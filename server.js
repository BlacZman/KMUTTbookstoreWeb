var http = require('http'),
fs = require('fs'),
url = require('url'),
mysql = require('mysql');
myquery = require("./queryCon"),
dec = require('atob'),
account = require('./database');
pass = account.data.pass,//your password

express = require('express'),
app = express();
app.use(express.static('pic'));
app.get('/', function(req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
app.get('/?*', function(req, res) {
    setTimeout(()=>{
        var query = url.parse(req.url, true).query;
        var arr = [];
        var txtstr = "<div id=\"parentDiv\">";
        mydb = myquery.connectquery;
        mydb.createquery(account.data.user/*your username*/, dec(account.data.pass)/*decoding password if it's encoded*/);
        mydb.selector("book", "isbn, title, author, translator, publisher, price, timestamp", "(isbn LIKE '%" + query.search + "%' OR title LIKE '%" + query.search + "%' OR author LIKE '%" + query.search + "%' OR translator LIKE '%" + query.search + "%' OR publisher LIKE '%" + query.search + "%')", function(err, result) {
            if(err) throw err;
            arr = result;
            Object.keys(arr).forEach(function(key) {
                var row = arr[key];
                console.log("Search for " + query.search + " Result: " + row.isbn);
                txtstr = txtstr + "<div id=\"Bookcontent\"><img id=\"pic\" src=\"" + row.isbn + ".jpg\" alt=\"No picture\" onError=\"this.onerror=null;this.src='404.jpg'\"><p>ISBN: " + row.isbn + ", Title: " + row.title + ", Author: " + row.author + ", Translator: " + row.translator + ", Publisher: " + row.publisher + ", Price: " + row.price + ", Timestamp: " + row.timestamp + "</p></div>";
            });
            txtstr = txtstr + "</div>";
        });
        setTimeout(()=>{ res.writeHead(200, {"Content-Type": "text/html"});
            res.write("Result for " + mysql.escape(query.search) + " is:");
            if(txtstr != "<div id=\"parentDiv\"></div>")res.end(txtstr);
            else res.end("<p>No result</p>");
        }, 100);
    },300);
});
var server = app.listen(80);
