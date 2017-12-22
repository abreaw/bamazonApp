

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
var itemSelectedPrice;  // item price from the DB query


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
	
	// function called when connection to the database made
	getInventory();

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
		
		// loop through the results from the select query on the products table
		for (var i = 0; i < results.length; i++) {
			console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].price));
		}

		console.log("----------------------------------------------");
		
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

	// check to see if the entry is smaller than the max length
	if (idString.length < maxIdLength) {

		// calculate the right spacing for the column display
		var spaceIdLength = maxIdLength - idString.length;

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
// returns: nothing
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

	      checkIdEntered(parseInt(answer.id));
	    }
	  });

}

// ---------------------------------------------------------------------------------------------------------------
// Check the ID of the item the user would like to purchase
// arguments: item id from user
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function checkIdEntered(id) {

	// query used to validate if the item id input from the user is valid
	var query = connection.query("SELECT * FROM `products` WHERE item_id = ?", [id], function (err, results, fields) {

		if (err || results[0] === undefined) {

			console.log("Item ID " + id + " is not a valid product Id.")
			promptUserID();
		}
		else {

			itemID = id;
			itemSelectedName = results[0].product_name;
			itemSelectedPrice = results[0].price;
			console.log("\n\nThank you.  You have selected '" + itemSelectedName.cyan + "' for your purchase.\n");
			promptUserQuantity();
		}

	});
}


// ---------------------------------------------------------------------------------------------------------------
// Prompt User via command line for the quantity they would like to purchase
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


	// query the DB to validate if the quantity entered by the user is available
	var query = connection.query("SELECT stock_quantity FROM `products` WHERE item_id = ?", [itemID], function (err, results, fields) {

		if (err) {

			console.log("\nQuantity " + amt + " is not a valid amount.");
			promptUserQuantity();
		}
		else {

			// set global variable quantity to amount in stock from DB query
			itemQuantity = results[0].stock_quantity;
			
			// check to see if quantity entered by user is larger than the quantity in inventory
			if (amt > itemQuantity) {

				console.log("\nOnly " + itemQuantity + " are in stock.  Please enter a valid quantity.");
				promptUserQuantity();
			}
			else {

				// set global variable to item quantity requested by user
				itemSelectedQuantity = amt;
				updateInventoryAmt();
			}
		}

	});

}


// ---------------------------------------------------------------------------------------------------------------
// Update the db for the inventory quantity for the item the user is purchasing
// ---------------------------------------------------------------------------------------------------------------
function updateInventoryAmt() {

	var newQuantity = itemQuantity - itemSelectedQuantity;

	var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, itemID], function (err, results, fields) {

		if (err != null || results.affectedRows === 0) {

			console.log("\n\nPurchase not completed.  Please try again.");
			getInventory();
		}
		else {

			// calculate total for user view
			var totalPrice = itemSelectedPrice * itemSelectedQuantity;

			// round totalPrice to the nearest hundreths decimal place
			totalPrice = Math.round(100*totalPrice)/100;

			console.log("\n\nThank you.  Your total purchase is '" + "$".cyan + totalPrice.toFixed(2).cyan + "' you will be billed when your order is shipped. \n\nYour '" + itemSelectedName.cyan + "' will arrive within 7-10 business days.\n");
			promptUserContinueShopping();
		}

	});
}

// ---------------------------------------------------------------------------------------------------------------
// Ask User if they would like to continue shopping at Bamazon
// If they do restart app
// If they do not then end the DB connection and close down the app 
// ---------------------------------------------------------------------------------------------------------------
function promptUserContinueShopping() {

	// Create a "Prompt" to see if user wants to continue shopping 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "confirm",
	      message: "Would you like to continue shopping?",
	      name: "continue"
	    }
	  ])
	  .then(function(inquirerResponse) {
	    
	  	if (inquirerResponse.continue) {
	      console.log("\nGreat!\n".yellow);
	      clearPrevItemData();
	    }
	    else {
	      
	      console.log("\n\nThanks for shopping with Bamazon!  Please come again!\n\n".rainbow);
	      // end the shopping app now
	      connection.end();
	      return;
	    }
	});

}


// ---------------------------------------------------------------------------------------------------------------
// Reset all the global variables being used and display the Inventory to the user again to restart the app 
// ---------------------------------------------------------------------------------------------------------------
function clearPrevItemData() {

	// reset global variables 
	itemID = 0;  // itemID entered by user
	itemQuantity = 0;  // item Quantity to purchase entered by user
	numProducts = 0;  // number of rows returned from the database

	itemSelectedName = "";  // item Name from the DB query
	itemSelectedQuantity = 0;  // item quantity from the DB query
	itemSelectedPrice = 0;  // item price from the DB query

	getInventory();

}

