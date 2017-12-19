

// NPM package require statements
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

// global variables 
var itemID;  // itemID entered by user
var itemQuantity;  // item Quantity to purchase entered by user
var numProducts;  // number of rows returned from the database

// var itemSelectedId;  // item ID from the DB query
var itemSelectedName;  // item Name from the DB query
var itemSelectedQuantity;  // item quantity from the DB query


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
	getInventory();
	// connection.end();  // might need to put this elsewhere to get the connection to run properly
});


// ---------------------------------------------------------------------------------------------------------------
// Grab Inventory Data from the Database Table
// ---------------------------------------------------------------------------------------------------------------
function getInventory() {

	connection.query("SELECT * FROM `products`", function (err, results, fields) {
		if (err) throw err;
		
		// set global variable to the # of records in the db for validation later with user prompts
		numProducts = results.length;

		console.log("");
		console.log("  ID    Product Name                 Price   ".yellow);
		console.log("----------------------------------------------");
		// console.log(results);

		// loop through the results from the select query on the products table
		for (var i = 0; i < results.length; i++) {
			console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].price));
		}

		console.log("----------------------------------------------");
		// connection.end();  // might need to put this elsewhere to get the connection to run properly

		promptUserID();

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
	return `  ${idString}    ${name}  ` + "$ " + `${price}	`;

}


// ---------------------------------------------------------------------------------------------------------------
// Prompt User via command line for the item ID they would like to purchase
// arguments: none
// returns: item ID
// ---------------------------------------------------------------------------------------------------------------
function promptUserID() {

	// Create a "Prompt" to get the item ID from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "Enter the Item ID of the product you would like to purchase.",
	      name: "id",
	      validate: function(value) 
	      	  {
	            // regular expression (regexp) used to make sure all the characters entered by the user are numbers
	            var pass = value.match(/^\d+$/);  // ^ means beginning - \d means digits - + means must contain at least one digit - $ means to the end
	            if (pass) {
	              return true;
	            } else {
		          console.log('  -- Please enter a valid number.');
		        }
	          }
	    }
	  ])
	  .then(function(answer) {
	    // Check to see if the user enters their a valid Item id
	    if (answer.id === "" || answer.id === "0") {
	      console.log("\nPlease enter a valid Item ID.");
	      promptUserID();
	    }
	    else {

	      // console.log("answer entered = " + answer.id);
	      checkIdEntered(parseInt(answer.id));
	    }
	  });

}


function checkIdEntered(id) {


	// using the numProducts global variable to validate the item id instead of calling another query to be more efficient
	// if (id > numProducts ) {

	// 	console.log("Item ID " + id + " is not a valid product Id.")
	// 	promptUserID();
	// }
	// else {

	// 	console.log("no problem w/ item ID entered");
	// 	itemID = id;
	// 	promptUserQuantity();
	// }


	// decided to go w/ the query statement so app could have access to the information from the db about the item selected
	// first run checks w/ a query but if the ids are generated automatically we can get the number of records from the 
	// first query run to display the inventory and use that to validate instead of using another call to the db
	var query = connection.query("SELECT * FROM `products` WHERE item_id = ?", [id], function (err, results, fields) {

		// console.log(query.sql);
		console.log(results);

		if (err || results[0] === undefined) {

			console.log("issue w/ query = " + err);
			console.log("Item ID " + id + " is not a valid product Id.")
			promptUserID();
		}
		else {

			console.log("no problem w/ query");
			itemID = id;
			itemSelectedName = results[0].product_name;
			console.log("Thank you.  You have selected '" + itemSelectedName.cyan + "' for your purchase.");
			promptUserQuantity();
		}

	});
}

// ---------------------------------------------------------------------------------------------------------------
// Prompt User via command line for the quantity they would like to purchase
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function promptUserQuantity() {

	// Create a "Prompt" to get the quantity from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "Enter the quantity you would like to purchase.",
	      name: "amount",
	      validate: function(value) 
	      	  {
	            // regular expression (regexp) used to make sure all the characters entered by the user are numbers
	            var pass = value.match(/^\d+$/);  // ^ means beginning - \d means digits - + means must contain at least one digit - $ means to the end
	            if (pass) {
	              return true;
	            } else {
		          console.log('  -- Please enter a valid quantity');
		        }
	          }
	    }
	  ])
	  .then(function(answer) {
	    // Check to see if the user a quantity
	    if (answer.amount === "") {
	      console.log("\nPlease enter a valid quantity.");
	      promptUserQuantity();
	    }
	    else {

	      console.log("answer entered = " + answer.amount);
	      checkQuantityEntered(parseInt(answer.amount));
	    }
	  });

}



// ---------------------------------------------------------------------------------------------------------------
// Check the quantity in inventory of the item the user would like to purchase
// arguments: quantity from user
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function checkQuantityEntered(amt) {


	var query = connection.query("SELECT stock_quantity FROM `products` WHERE item_id = ?", [itemID], function (err, results, fields) {

		console.log(query.sql);

		if (err) {

			console.log("issue w/ query = " + err);
			console.log("Quantity " + amt + " is not a valid amount.")
			promptUserQuantity();
		}
		else {

			console.log("no problem w/ query");
			// console.log(results);

			itemQuantity = results[0].stock_quantity;
			// console.log(itemQuantity);

			// check to see if quantity entered by user is larger than the quantity in inventory
			if (amt > itemQuantity) {

				console.log("Only " + itemQuantity + " are in stock.  Please enter a valid quantity.");
				promptUserQuantity();
			}
			else {

				updateInventoryAmt();
			}
		}

	});

}


// ---------------------------------------------------------------------------------------------------------------
// Update the db for the inventory quantity for the item the user is purchasing
// arguments: quantity from user
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function updateInventoryAmt() {

	console.log("updating inventory now ... ");


}

