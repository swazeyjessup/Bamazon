var table = require("cli-table");
var mysql = require("mysql")
var inquirer = require("inquirer")

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
});


function start() {
    inquirer.prompt([{
        name: "confirm",
        type: "confirm",
        message: "Would you like to see our products today?",
        default: true
    }]).then(function (answer){
        if (answer.confirm) {
            var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
            connection.query(query, function (err, res){
                var table = new Table({
                    head: [
                        "Product ID",
                        "Product Name",
                        "Department",
                        "Price",
                        "Stock Quantity"
                ],
                colWidths: [20, 20, 20, 20, 20]
                });
                for (var i = 0; i < res.length; i++){
                    table.push([
                        res[i].item_id,
                        res[i].product_name,
                        res[i].department_name,
                        "$" + res[i].price,
                        res[i].stock_quantity
                    ]);
                }
                console.log("\n" + table.toString() + "\n");
                purchaseItems();
            });
        } else {
            console.log("Come back soon!");
            connection.end();
        };
    });
};