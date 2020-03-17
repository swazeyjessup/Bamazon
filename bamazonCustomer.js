var Table = require("cli-table");
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
            var query = "SELECT item_id, product_name, department_id, price, stock_quantity FROM products";
            connection.query(query, function (err, res){
                var table = new Table({
                    head: [
                        "Product ID",
                        "Product Name",
                        "Department",
                        "Price",
                        "Stock Quantity"],
                colWidths: [20, 20, 20, 20, 20]
                });
                for (var i = 0; i < res.length; i++){
                    table.push([
                        res[i].item_id,
                        res[i].product_name,
                        res[i].department_id,
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

function purchaseItems() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the Product ID of the item you wish to purchase: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "units",
            type: "input",
            message: "Enter the amount of units you would like to purchase: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                };
                return false;
            }
          }    
    ])

        .then(function (answer) {
            var query = "SELECT item_id, stock_quantity, price, product_sales FROM products WHERE ?";
            connection.query(query, {
                item_id: answer.id
            },
            function (err,res) {
                if (err) throw err
                var checkStock = res[0].stock_quantity
                var purchasedStock = answer.units

                if (checkStock < purchasedStock) {
                    console.log("Insufficient Quantity!")
                    start();
                } else {
                    var updateStock = checkStock - purchasedStock;
                    connection.query("UPDATE products SET stock_quantity = " + updateStock + " WHERE ?",{
                        item_id: answer.id
                    });
                    var priceCalculator = res[0].price
                    var checkout = priceCalculator * purchasedStock;
                    connection.query("UPDATE products SET product_sales = product_sales + " + checkout + " WHERE ?",{
                        item_id: answer.id
                    });
                    console.log("Your order total is: $" + checkout);
                    console.log("============================================================");
                    start();
                };
            });
        });
};