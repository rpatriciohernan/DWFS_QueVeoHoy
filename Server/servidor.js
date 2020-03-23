//DEPENDENCIES
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require("./router");
const port = 8080;

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", routes);

//BASE ENDPOINT
app.get("/", function(req, res) {
    res.send("Welcome to QueVeoHoy 1.0 \n Connection started at port "+port);
});


//APP LISTENER
app.listen(port, function(){
    console.log("Listening at port "+port);
});