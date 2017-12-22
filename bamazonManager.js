
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

var itemID;  // itemID entered by user
var itemQuantity;  // existing quantity of Item selected to update
var itemName;  // item name entered by user
var itemDept;  // item department entered by user
var itemPrice; // item price entered by user

var itemSelectedName;  // item Name from the DB query
var itemUpdateQuantity;  // item quantity from the DB query

// create connection using the bamazon database informaiton so the app can get access to the data
var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,

	user: "root",
	password: "MySQLPswd",
	database: "bamazon"

});

// scroll existing info so it is no longer shown in the console window
clearConsoleWindows();

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
	      message: "\nPlease select a process you would like to complete.",
	      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
	      name: "processSelected"
	    }
	  ])
	  .then(function(answer) {
	    
		// Process the user selection and run that process
		switch(answer.processSelected) {
		    case "View Products for Sale":
		        viewProducts();
		        break;
		    case "View Low Inventory":
		        viewLowInventory();
		        break;
		    case "Add to Inventory":
		    	addInventoryAmt();
		        break;
		    case "Add New Product":
		    	addInventoryItem();
		        break;
	        case "Quit":
	        	endApp();
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

 	connection.query("SELECT * FROM `products`", function (err, results, fields) {

 		if (err) throw err;
		
		console.log("");
		console.log("  ID    Product Name                  Quantity    Price   ".yellow);
		console.log("----------------------------------------------------------");
		
		// loop through the results from the select query on the products table
		for (var i = 0; i < results.length; i++) {
			console.log(formatTableData(results[i].item_id, results[i].product_name, results[i].stock_quantity, results[i].price));
		}

		console.log("----------------------------------------------------------");
		console.log("");
		mainMenuPrompt();

	});

 }


 
// ---------------------------------------------------------------------------------------------------------------
// Process for viewing products that have inventory below the low inventory amount
// Query database and return all items in the products table that match
// Call the display function to output the items properly to the console / user
// ---------------------------------------------------------------------------------------------------------------
 function viewLowInventory() {

 	// lowInventoryNum = 50;  // test to check query for normal quantity amt

 	var query = connection.query("SELECT * FROM `products` WHERE stock_quantity <= ?",[ lowInventoryNum ], function (err, results, fields) {

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
			mainMenuPrompt();
		}
	});

 }


// ---------------------------------------------------------------------------------------------------------------
// add quantity to inventory items using a prompt to determine which and how much should be added
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function addInventoryAmt() {

 	promptUserInventoryItem();

 }


// ---------------------------------------------------------------------------------------------------------------
// add new item to inventory item information for the add
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function addInventoryItem() {

	promptUserNewItem();

 }


// ---------------------------------------------------------------------------------------------------------------
// ask user for inventory item id and how much should be added to existing inventory
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function promptUserInventoryItem() {

	// Create a "Prompt" to get the item ID from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "\nEnter the Item ID of the product for which you would like to increase stock.",
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
	      promptUserInventoryItem();
	    }
	    else {

	      checkIdEntered(parseInt(answer.id));
	    }
	  });

}

// ---------------------------------------------------------------------------------------------------------------
// ask user for inventory item information to add new product to inventory
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function promptUserNewItem() {

	enterItemName();

}



// ---------------------------------------------------------------------------------------------------------------
// ask user for inventory item name to add new product to inventory
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function enterItemName() {

	// Create a "Prompt" to get the item ID from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "\nEnter the Item Name to be added.",
	      name: "name"
	    }
	  ])
	  .then(function(answer) {
	    // Check to see if the user enters their a valid Item id
	    if (answer.name === "") {
	      console.log("\nPlease enter an Item Name.");
	      enterItemName();
	    }
	    else {

	      itemName = answer.name;
	      enterItemDept();
	    }
	  });
}



// ---------------------------------------------------------------------------------------------------------------
// ask user for inventory item deptartment to add new product to inventory
// arguments: 
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function enterItemDept() {

	// Create a "Prompt" to get the item ID from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "\nEnter the Item Department for the new product.",
	      name: "dept"
	    }
	  ])
	  .then(function(answer) {
	    // Check to see if the user enters their a valid Item id
	    if (answer.dept === "") {
	      console.log("\nPlease enter an Item dept.");
	      enterItemDept();
	    }
	    else {

	      itemDept = answer.dept;
	      enterItemPrice();
	    }
	  });

}

// ---------------------------------------------------------------------------------------------------------------
// Prompt User via command line for the price of the item they would like to add to existing inventory
// ---------------------------------------------------------------------------------------------------------------
function enterItemPrice() {

	// Create a "Prompt" to get the quantity from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "\nEnter the price of the new product you would like to add to inventory.",
	      name: "price",
	      validate: function(value) 
	      	  {
	            
	      	  	// regular expression (regexp) used to make sure all the characters entered by the user are numbers
	            var pass = value.match(/^\d+.\d+$/);  // ^ means beginning - \d means digits - + means must contain at least one digit - $ means to the end
	            
	            if (pass != null) {
	              return true;
	            } else {
		          console.log('  -- Please enter a valid price (ex. 3.99)');
		        }
	          }
	    }
	  ])
	  .then(function(answer) {
	    // Check to see if the user a quantity
	    if (answer.price === "") {
	      console.log("\nPlease enter a valid price.");
	      enterItemPrice();
	    }
	    else {

	      itemPrice = parseFloat(answer.price);
	      promptUserQuantity(false);
	    }
	  });

}


// ---------------------------------------------------------------------------------------------------------------
// Check the ID of the item the user would like to increase inventory quantity
// arguments: item id from user
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function checkIdEntered(id) {

	// query used to validate if the item id input from the user is valid
	var query = connection.query("SELECT * FROM `products` WHERE item_id = ?", [id], function (err, results, fields) {

		if (err || results[0] === undefined) {

			console.log("Item ID " + id + " is not a valid product Id.")
			promptUserInventoryItem();
		}
		else {

			itemID = id;
			itemSelectedName = results[0].product_name;
			itemSelectedPrice = results[0].price;
			
			console.log("\n\nYou have selected '" + itemSelectedName.cyan + "' for quantity increase.");
			promptUserQuantity(true); // do not check existing quantity in db sinc this is a new item
		}

	});
}

// ---------------------------------------------------------------------------------------------------------------
// Prompt User via command line for the quantity they would like to add to existing inventory amount
// arguments: true or false (true to check existing quantity or false to not check since it is a new item being added)
// ---------------------------------------------------------------------------------------------------------------
function promptUserQuantity(checkQuantity) {

	// Create a "Prompt" to get the quantity from the user 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "\nEnter the quantity of the item.",
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
	      promptUserQuantity(checkQuantity);
	    }
	    else {

	      if (checkQuantity) {
		 
		 	checkExistingQuantity(parseInt(answer.amount), checkQuantity);
		  }
		  else {

		  	// set global variable quantity to amount from user
		  	itemQuantity = parseInt(answer.amount);
		  	
		  	addNewProduct();
		  }
	    }
	  });

}



// ---------------------------------------------------------------------------------------------------------------
// Check the quantity in inventory of the item the user would like to update
// arguments: quantity from user
// returns: 
// ---------------------------------------------------------------------------------------------------------------
function checkExistingQuantity(amt, checkQuantity) {


	// query the DB to validate if the quantity entered by the user is available
	var query = connection.query("SELECT stock_quantity FROM `products` WHERE item_id = ?", [itemID], function (err, results, fields) {

		if (err) {

			console.log("\nQuantity " + amt + " is not a valid amount.");
			promptUserQuantity(checkQuantity);
		}
		else {

			// set global variable quantity to amount in stock from DB query
			itemQuantity = results[0].stock_quantity;
			
			// set global variable to item quantity requested by user
			itemUpdateQuantity = amt;
			updateInventoryAmt();
		}

	});

}

// ---------------------------------------------------------------------------------------------------------------
// Update the db for the inventory quantity for the item the user is adding inventory for
// ---------------------------------------------------------------------------------------------------------------
function updateInventoryAmt() {

	var newQuantity = itemQuantity + itemUpdateQuantity;

	var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, itemID], function (err, results, fields) {

		if (err != null || results.affectedRows === 0) {

			console.log("\n\nInventory increase not completed.  Please try again.");
			
			addInventoryAmt();
		}
		else {

			console.log("\n\nThe quantity of '" + itemSelectedName.cyan + "' has been increased to '" + newQuantity.toString().yellow + "'.\n");
			promptUserContinue("Update Inventory");
			return;
		}

	});
}

// ---------------------------------------------------------------------------------------------------------------
// use query to insert a new product / row into the existing products database
// arguments: 
// ---------------------------------------------------------------------------------------------------------------
function addNewProduct() {

	var query = connection.query(
		"INSERT INTO products SET ?",
		{
		  product_name: itemName,
		  department_name: itemDept,
		  price: itemPrice,
		  stock_quantity: itemQuantity
		}, function (err, results, fields) {

		if (err != null || results.affectedRows === 0) {

			console.log("\n\nProduct add was not completed.  Please try again.");
			
			addInventoryItem();
		}
		else {

			console.log("\n\nNew Product '" + itemName.cyan + "' has been added with '" + itemQuantity.toString().yellow + "' in stock.\n");
			promptUserContinue("Add Inventory");
			return;
		}

	});

}

// ---------------------------------------------------------------------------------------------------------------
// Ask User if they would like to continue with a new option
// If they do restart app
// If they do not then end the DB connection and close down the app 
// arguments: existing process notation
// ---------------------------------------------------------------------------------------------------------------
function promptUserContinue(process) {

	// Create a "Prompt" with a series of questions.
	inquirer
	  .prompt([
	    // Here we give the user a list to choose from.
	    {
	      type: "list",
	      message: "What would you like to do next?",
	      choices: ["Continue Existing Process", "Return to Main Option Menu", "Quit"],
	      name: "processSelected"
	    }
	  ])
	  .then(function(answer) {
	    
		// Process the user selection and run that process
		switch(answer.processSelected) {
		    case "Continue Existing Process":
		        
		        clearPrevItemData();
		        
		        switch(process) {
		        	case "Update Inventory":
		        		addInventoryAmt();
		        		break;

		        	case "Add Inventory":
		        		addInventoryItem();
		        		break;

		        	default:
		        		mainMenuPrompt();
		        }
		        break;

		    case "Return to Main Option Menu":
		        mainMenuPrompt();
		        break;

		    case "Quit":
		  		endApp();
		        break;

		    default:
		        console.log("Selection Invalid. Try again.");
		        promptUserContinue(process);
		}

	  });

}


function endApp() {
	    	
	console.log("\n\nThanks for helping make Bamazon Great!\n\n".rainbow);
	
	// end the shopping app now
	connection.end();
	return;

}


// ---------------------------------------------------------------------------------------------------------------
// Reset all the global variables being used  
// ---------------------------------------------------------------------------------------------------------------
function clearPrevItemData() {

	// reset global variables 
	itemID = 0;  // itemID entered by user
	itemQuantity = 0;  // item Quantity to purchase entered by user
	itemName = "";  // item name entered by user
	itemDept = "";  // item department entered by user
	itemPrice = 0; // item price entered by user
	
	itemSelectedName = "";  // item Name from the DB query
	itemSelectedQuantity = 0;  // item quantity from the DB query

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


// -----------------------------------------------------------------------------------
// moves the console view so the user only sees the game play happening
// -----------------------------------------------------------------------------------
function clearConsoleWindows() {

	if (process.platform === 'win32') {
		console.log("\u001b[2J\u001b[0;5H");  // moves the console to the 0,0 position (does not clear the history)
	} else {
		console.log("user not windows user");
	}

}
