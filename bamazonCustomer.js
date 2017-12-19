

// NPM package require statements
var mysql = require("mysql");
var inquirer = require("inquirer");


// create connection using the bamazon database informaiton so the app can get access to the data
var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,

	user: "root",
	password: "MySQLPswd",
	database: "bamazon"

});


// connect using the specified information to the database -- asynchronous function
connection.connect( function(error) {

	if (error) throw error;
	console.log("connection as ID = " + connection.threadId);
	// console.log(connection);

	// function called when connection to the database made
	displayInventory();
	// connection.end();  // might need to put this elsewhere to get the connection to run properly
});



function displayInventory() {

	connection.query("SELECT * FROM `products`", function (err, results, fields) {
		if (err) throw err;
		
		console.log("-------------------------------------------");
		console.log(results);
		console.log("-------------------------------------------");
		connection.end();  // might need to put this elsewhere to get the connection to run properly
	});

}