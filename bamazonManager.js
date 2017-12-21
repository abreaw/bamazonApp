
// bamazonManager Node app will allow a user to select any of the processes below
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.


// Load the NPM Package inquirer & mysql
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");

// global variable needed
var lowInventoryNum = 5;  // set the amt of what low inventory is considered in this app

// create connection using the bamazon database informaiton so the app can get access to the data
var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,

	user: "root",
	password: "MySQLPswd",
	database: "bamazon"

});

// run the main menu for user to select an option
mainMenuPrompt();



// ---------------------------------------------------------------------------------------------------------------
// Main Menu prompt for user to select the process they would like to carry out
// Prompt user with inquirer NPM package
// go to process based on user selection
// ---------------------------------------------------------------------------------------------------------------
function mainMenuPrompt(){

	// Create a "Prompt" with a series of questions.
	inquirer
	  .prompt([
	    // Here we give the user a list to choose from.
	    {
	      type: "list",
	      message: "Please select a process you would like to complete.",
	      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
	      name: "processSelected"
	    }
	  ])
	  .then(function(answer) {
	    
		// Process the user selection and run that process
		// console.log("answer received = " + answer.processSelected);

		switch(answer.processSelected) {
		    case "View Products for Sale":
		        console.log("view products for sale - selected");
		        viewProducts();
		        break;
		    case "View Low Inventory":
		        console.log("View Low Inventory - selected");
		        viewLowInventory();
		        break;
		    case "Add to Inventory":
		    	console.log("Add to Inventory - selected");
		        break;
		    case "Add New Product":
		    	console.log("Add New Product - selected");
		        break;
		    default:
		        console.log("Selection Invalid. Try again.");
		        mainMenuPrompt()
		}

	  });

 }



// ---------------------------------------------------------------------------------------------------------------
// Process for viewing products that are for sale
// Query database and return all items in the products table
// Call the display function to output the items properly to the console / user
// ---------------------------------------------------------------------------------------------------------------
 function viewProducts() {

 	console.log("view products for sale function started");

 	connection.query("SELECT * FROM `products`", function (err, results, fields) {

 		// console.log("err = " + err);
 		// console.log("results = ", results);
 		// console.log("fields = ", fields);

		if (err) throw err;
		
		console.log("");
		console.log("  ID    Product Name                  Quantity    Price   ".yellow);
		console.log("----------------------------------------------------------");
		
		// loop through the results from the select query on the products table
		for (var i = 0; i < results.length; i++) {
			console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].stock_quantity, results[i].price));
		}

		console.log("----------------------------------------------------------");
		connection.end();  // might need to put this elsewhere to get the connection to run properly

	});

 }


 
// ---------------------------------------------------------------------------------------------------------------
// Process for viewing products that have inventory below the low inventory amount
// Query database and return all items in the products table that match
// Call the display function to output the items properly to the console / user
// ---------------------------------------------------------------------------------------------------------------
 function viewLowInventory() {

 	console.log("view items that have low inventory function started");

 	// lowInventoryNum = 50;  // test to check query for normal quantity amt

 	var query = connection.query("SELECT * FROM `products` WHERE stock_quantity <= ?",[ lowInventoryNum ], function (err, results, fields) {

 		// console.log(query.sql);
 		// console.log("err = " + err);
 		// console.log("results = ", results[0]);
 		// console.log("fields = ", fields);

		if (err != null) {

			console.log("\n Error getting data requested.  Please try again.\n\n");
			mainMenuPrompt();

		} 
		else if (results[0] === undefined) {

			console.log("\nAll items in inventory are at levels above " + lowInventoryNum.toString().cyan + "\n");
			mainMenuPrompt();
		}
		else {
		
			console.log("");
			console.log("  ID    Product Name                  Quantity    Price   ".yellow);
			console.log("----------------------------------------------------------");
			
			// loop through the results from the select query on the products table
			for (var i = 0; i < results.length; i++) {
				console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].stock_quantity, results[i].price));
			}

			console.log("----------------------------------------------------------");
			console.log("");
			connection.end();  // might need to put this elsewhere to get the connection to run properly
		}
	});

 }


// ---------------------------------------------------------------------------------------------------------------
// Create & Format table row data
// arguments: product id, product name, in stock quantity, product price
// returns: string with the data setup and ready to be displayed
// ---------------------------------------------------------------------------------------------------------------
function formatTableData(id, name, amt, price) {

	// setup display fields for table data coming in
	var idString = addProperSpace(id, 2); // make sure the space for the id field display has 2 for output display
	var nameString = addProperSpace(name, 30); // make sure the space for the id field display has 27 for output display
	var amtString = addProperSpace(amt, 5); // make sure the space for the id field display has 5 for output display

	// use ` instead of ' or " to be able to add the variable names into the string and it interpret them for the values passed in
	return `  ${idString}    ${nameString}  ${amtString}     ` + "$ " + `${price}	`;

}


// -----------------------------------------------------------------------------------------------
// add space to the fields to line them up properly for display views
// arguments:  field to be properly spaced, max length of field for the display view
// returns:  string with proper spacing to be displayed
// -----------------------------------------------------------------------------------------------
function addProperSpace(field, maxLength) {

	// change id to a string for length property to work
	var fieldString = field.toString();  

	// check to see if the entry is smaller than the max length
	if (fieldString.length < maxLength) {

		// calculate the right spacing for the column display
		var spacedLength = maxLength - fieldString.length;

		// loop through to add the right amount of space to line up the column information
		for (var i = 0; i < spacedLength; i++) {
			fieldString += " ";
		}
	}

	return fieldString;
}
