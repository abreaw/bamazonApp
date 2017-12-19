

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
	// console.log("connection as ID = " + connection.threadId);
	// console.log(connection);

	// function called when connection to the database made
	displayInventory();
	// connection.end();  // might need to put this elsewhere to get the connection to run properly
});



function displayInventory() {

	connection.query("SELECT * FROM `products`", function (err, results, fields) {
		if (err) throw err;
		
		console.log("");
		console.log("ID    Product Name                 Price   ");
		console.log("-------------------------------------------");
		// console.log(results);

		// loop through the results from the select query on the products table
		for (var i = 0; i < results.length; i++) {
			console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].price));
		}

		console.log("-------------------------------------------");
		connection.end();  // might need to put this elsewhere to get the connection to run properly

		// console.log(formatTableData(results[0].item_id, results[0].product_name, results[0].price));

	});

}


// ---------------------------------------------------------------------------------------------------------------
// Create & Format table row data
// arguments: product id, product name, product price
// returns: string with the data setup and ready to be displayed
// ---------------------------------------------------------------------------------------------------------------
function formatTableData(id, name, price) {

	// set the max length for the id column on the display view
	var maxIdLength = 2;

	// change id to a string for length property to work
	var idString = id.toString();  

	// console.log("length for id " + idString + " = " + idString.length);

	// check to see if the entry is smaller than the max length
	if (idString.length < maxIdLength) {

		// calculate the right spacing for the column display
		var spaceIdLength = maxIdLength - idString.length;

		// console.log("spaceIdLength for " + idString + " = " + spaceIdLength);

		// loop through to add the right amount of space to line up the column information
		for (var i = 0; i < spaceIdLength; i++) {
			idString += " ";
		}
	}


	// set the max length for the name column on the display view
	var maxNameLength = 27;

	// check to see if the entry is smaller than the max length
	if (name.length < maxNameLength) {

		// calculate the right spacing for the column display
		var spaceLength = maxNameLength - name.length;

		// console.log("spaceLength for " + name + " = " + spaceLength);

		// loop through to add the right amount of space to line up the column information
		for (var i = 0; i < spaceLength; i++) {
			name += " ";
		}
	}
	
	// use ` instead of ' or " to be able to add the variable names into the string and it interpret them for the values passed in
	return `${idString}    ${name}  ${price}	`;

}


