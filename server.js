var http = require('http'),
fs = require('fs'),
url = require('url'),
mysql = require('mysql');
myquery = require("./queryCon"),
dec = require('atob'),
pass = ""//your password,
mydb = myquery.connectquery,
express = require('express'),
app = express();
app.use(express.static('pic'));
app.get('/*', function(req, res) {
    fs.readFile('index.html', function(err, data) {
        var query = url.parse(req.url, true).query;
        var arr = [];
        if(query.search == null) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        }
        else {
            var txtstr = "<div id=\"parentDiv\">";
            mydb.createquery(""//your username, dec(pass)//decoding password if it's encoded);
            mydb.selector("book", "isbn, title, author, translator, publisher, price, timestamp", "isbn LIKE '%" + query.search + "%'", function(err, result) {
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
                if(txtstr != "")res.end(txtstr);
                else res.end("No result");
            }, 100);
        }
    });
});
var server = app.listen(8080);
