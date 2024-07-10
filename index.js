// Importing Express js
const express = require("express");
// Initializing app with express
const app = express();
//Importing Body Parser to json body parse 
const bodyParser = require("body-parser");
// Product controller 
const productsController = require("./controllers/productController");
const userController = require("./controllers/userController");
const cartController=require('./controllers/cartControllers')
const adminController=require('./controllers/adminController')
// Importing Cors
const cors = require("cors");
// initializing app with cors 
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
const db = require("./db");
const dotenv=require('dotenv')
dotenv.config();
app.post("/products/add-products", productsController.addProducts);
app.get("/products/get-products", productsController.getProducts);
app.get("/products/get-product/:id", productsController.getProductById);
app.patch("/products/edit-product", productsController.updateOneProduct);
app.post("/products/delete-products", productsController.deleteProducts); 
app.post("/products/reviews/:id",productsController.giveReview)
app.get("/products/filters",productsController.filteredProducts)
app.post("/signup",userController.signup)
app.post("/login",userController.login)
app.post("/admin-signup",adminController.adminSignup)
app.post("/admin-login",adminController.adminLogin)
app.post("/add-to-cart",userController.addToCart)
app.get("/get-user-cart",userController.getCartItem)
app.post('/update-cart-quantity',userController.updateQuantiy)
app.delete("/delete-cart-item",userController.deleteCartItem)
app.listen(process.env.PORT, () => {
  console.log(`App listening on port`);
});

