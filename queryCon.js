exports.connectquery =  {
    con : null,
    createquery : function(user, pass) {
        var mysql = require('mysql');
        con = mysql.createConnection({
            host: "localhost",
            user: user,
            password: pass,
            database: "kmuttbookstore"
        });
        console.log("Connected to '" + user + "'");
    },
    createDB : function(name) {
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("CREATE DATABASE " + name, function (err, result) {
                if (err) throw err;
                console.log("Database " + name + " created");
            });
        });
    },
    deleteDB: function(name) {
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("DELETE DATABASE " + name, function (err, result) {
                if (err) throw err;
                console.log("Database " + name + " deleted");
            });
        });
    },
    createTable: function(name, properties) {
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("CREATE TABLE " + name + " (" + properties + ")", function (err, result) {
                if (err) throw err;
                console.log("Table " + name + " created");
            });
        });
    },
    deleteTable:  function(name) {
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("DROP TABLE " + name, function (err, result) {
                if (err) throw err;
                console.log("Table " + name + " deleted");
            });
        });
    },
    insertTable: function(table, keys, values) {
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")", function (err, result) {
                if (err) throw err;
                console.log("Keys: " + keys + " Values: " + values + " added to " + table);
            });
        });
    },
    //queryResult: [{isbn:"111"}],
    selector: function(table, prop, whrcommand, passValue_callback) { //selection(tb, prop, cmd, function(err, result) {})
        var dummy = "ggwp";
        //this.queryResult.splice(0,this.queryResult.length-1);
        if(con == null) throw "Error: not connect to mysql";
        con.connect(function(err) {
            if(err) throw err;
            con.query("SELECT " + prop + " FROM " + table + " WHERE " + whrcommand, function (err, result, field) {
                if (err) throw err;
                var childarr = [];
                Object.keys(result).forEach(function(key) {
                    var arr = result[key];
                    var placeholder = {isbn: arr.isbn, title: arr.title, author: arr.author, translator: arr.translator, publisher: arr.publisher, price: arr.price, timestamp: arr.timestamp};
                    var format = JSON.stringify(placeholder);
                    var op = JSON.parse(format)
                    childarr.push(op);
                });
                passValue_callback(null, childarr);
            });
        });
    }
}