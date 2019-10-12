var mysql = require('mysql');
var fs = require("fs")

var content = fs.readFileSync("config.json");
var config = JSON.parse(content);

var db = mysql.createConnection({
    host: config.database["host"],
    user: config.database["user"],
    password: config.database["password"],
    database: config.database["database"]
});

db.connect((err) => {
    if(err) {
        console.log("\nERROR: Error Connecting Database\n\n");
        throw err;
    }
    else
        console.log("\nOKAY: Database is connected\n\n");
});

module.exports = db;