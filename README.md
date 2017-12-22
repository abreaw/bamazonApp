# bamazonApp
## *Simple Command Line Inventory App using Node.js and MySQL*


There are two node apps in this repo.

1. bamazonCustomer.js
1. bamazonManager.js

_To view a demo of the app workflow -->_ [YouTube](https://youtu.be/Zz_jsAa7WEc)

**bamazonCustomer.js** allows the user to view the items that are in the _**bamazon**_ MySQL database within the _**products**_
	table.  It is a command line Node.js app that shows all items available for sale at _bamazon_ and prompts the user for an
	_Item Id_ that they would like to purchase.  After the user enters an _Item Id_ the user is then prompted for the quantity
	of the item to be purchased.  The app queries the _**products**_ table to make sure the item id exists and that there are
	enough of that quantity in stock.  If these are both true then an update is made to the _**products**_ table to adjust the
	existing inventory for the amount purchased and the total amount charged is displayed to the user.  The user can then 
	continue shopping or decide to quit.

**bamazonManager.js** allows the user to choose various functions to work with the _**bamazon**_ MySQL database within the _**products**_
	table.  It is a command line Node.js app that has the following options available:

		* View Products for Sale
		* View Low Inventory
		* Add to Inventory
		* Add New Product
		* Quit


_**View Products for Sale**_ shows a list of all the items in the database with all the details including quantity in stock.
	After the list is displayed the user is then prompted to choose another option from the _Main Menu_.

_**View Low Inventory**_ shows a list of item in inventory that have a _stock_quantity_ of 5 or below.  After the list is
	displayed the user is then prompted to choose another option from the _Main Menu_.

_**Add to Inventory**_ allows the user to adjust the stock quantity of a specified item.  The user is prompted to enter the
	_Item Id_ of the product that they would like adjust.  The user is then prompted on how many items should be added to 
	the existing inventory amount.  Once the process is complete, the _**products**_ table is updated with the amount added
	plus the existing amount to show the true current inventory in stock.  After the adjustment is made to the database, the
	user is then prompted to either _Continue Adding to Inventory_, _Return to the Main Menu_ or _Quit the application_.

_**Add to Inventory**_ allows the user to add a new product to the _**products**_ table.  The user is prompted to enter the
	_Item Description_, the _Item Department_, the _Price of the Item_ and the existing _Quantity in Stock_.  Once the user
	enters all the information, an insert statement is used to add the new product with the information from the user to the
	_**products**_ table in the database.  After the new row / product is added, the user is then prompted to either 
	_Continue Adding to Inventory_, _Return to the Main Menu_ or _Quit the application_.



To start the app please use the following instructions:

		* Make sure you have Node.js installed on your machine
		* Run *bamazon-db.sql* in MySQL Workbench *(to create a mock db for the app with tables populated)*
		* In your terminal or GitBash session:
			* Run `npm install`  *(to install all the npm dependencies needed for the app)*
			* Run `node bamazonCustomer.js` *(for the customer app version)*
			* Run `node bamazonManager.js` *(for the manager app version)*