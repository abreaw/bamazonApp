DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(10),
  PRIMARY KEY (item_id)
);

USE bamazon;

INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES
  ('Christmas Lights','Seasonal',25.99,250), ('Snowman Ornament','Seasonal',4.99,100), ('Glitter Stocking', 'Seasonal',15.99,50), ('Harry Potter Sock Advent Calendar','Seasonal',19.99,10),
  ('5 Foot Christmas Tree','Seasonal',63.99,25), ('Very Merry Felt Banner','Seasonal',5.00,30), ('Awkward Turtle','Toys',5.99,15), ('Panic Button Desk Bell','Toys',2.99,15),
  ('Caramel Pieces - 10 pack','Candy',4.89,25), ('Holiday Santa Gift Bag','Seasonal',1.99,35), ('Merlot','Alcohol',12.99,400), ('Shiraz','Alcohol',9.99,250), ('Pinot Noir','Alcohol',10.99,250),
  ('Spiral Cut Ham','Meat',19.99,25), ('Pecans - Whole','Produce',3.99,20), ('Walnuts - Whole','Produce',3.99,20), ('Gift Cards','Gifts',25.00,200);
  
SELECT * FROM products;
