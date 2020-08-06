 var express = require('express');
 var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

//import routes
const productsRoute = require('./apiRoutes/products');
const ordersRoute = require('./apiRoutes/orders');
const categoriesRoute = require('./apiRoutes/categories');
//middleware
app.use(cors({
      origin:'*',
      methods:['POST','GET','DELETE','PATCH','PUT'],
      allowedHeaders:'Content-type,Authorization,Origin,X-Requested-With,Accept'
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//use routes
 app.use("/api/products",productsRoute);
 app.use("/api/orders",ordersRoute);
 app.use("/api/categories",categoriesRoute);

 app.listen(8080);