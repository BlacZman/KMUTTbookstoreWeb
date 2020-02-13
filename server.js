var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    //mysql = require('mysql'),
    myquery = require("./queryCon"),
    dec = require('atob'),
    account = require('./database'),
    pass = account.data.pass,//your password
    express = require('express'),
    app = express();
app.use(express.static('pic'));
app.use(express.static('bin'));
app.use(express.static('css'));
app.use(express.static('js'));
app.get('/', function (req, res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});
app.get('/?*', function (req, res) {
    setTimeout(() => {
        var query = url.parse(req.url, true).query;
        var arr = [];
        var txtstr = "<div class=\"col-lg-12 text-center\"><h2>ผลการค้นหา</h2></div>";
        var nu = txtstr;
        mydb = myquery.connectquery;
        mydb.createquery(account.data.user/*your username*/, dec(pass)/*decoding password if it's encoded*/);
        mydb.selector("book", "isbn, title, author, translator, publisher, price, timestamp", "(isbn LIKE '%" + query.search + "%' OR title LIKE '%" + query.search + "%' OR author LIKE '%" + query.search + "%' OR translator LIKE '%" + query.search + "%' OR publisher LIKE '%" + query.search + "%')", function (err, result) {
            if (err) throw err;
            arr = result;
            Object.keys(arr).forEach(function (key) {
                var row = arr[key];
                console.log("Search for " + query.search + " Result: " + row.isbn);
                txtstr = txtstr + "<div class=\"col-xs-4\" id=\"bookcontent\"><div class=\"box-book animate\" onclick=\"showcase(this)\"><img height=\"450px\" width=\"312px\" src=\"" + row.isbn + ".jpg\" class=\"book\" alt=\"No picture\" onError=\"this.onerror=null;this.src='404.jpg'\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>" + row.title + "</h4></div><div class=\"panel-body\"><p>รายละเอียดหนังสือ</p><h6>ราคา :  " + row.price + "</h6><h6>คงเหลือ :  1 เล่ม</h6></div></div></div></div>";
            });
            txtstr = txtstr;
        });
        if (query.search != null) {
            setTimeout(() => {
                res.writeHead(200, { "Content-Type": "text/html" });
                if (txtstr != nu) res.end(txtstr);
                else res.end(txtstr +"<div class=\"col-lg-12 text-center\"><h2>No result</h2></div>");
            }, 30);
        }
        else res.end("<a href=\"../\">Go back</a><p>404 No respond</p>");
    }, 50);
});
var server = app.listen(80);
