var chalk = require("chalk");
var table = require("cli-table");
var readline = require("linebyline");
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    else console.log ("\nWelcome to the Bamazon store");
    console.log("============================================================");
    start();
})