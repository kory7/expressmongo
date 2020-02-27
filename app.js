const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost/nodekb");
//Conexion
let db = mongoose.connection;

//Check connection
db.once("open", () => {
  console.log("Connected to mongodb");
});

//Checa si hay algun error de conexion
db.on("error", err => {
  console.log(err);
});

//Init app
const app = express();

//Trae la estrucutra de la base.
let Articles = require("./models/articles");

//Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Defining public route
app.use(express.static(path.join(__dirname, "public")));

//Home route
app.get("/", (req, res) => {
  Articles.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles
      });
    }
  });
});

// Add GET
app.get("/articles/add", (req, res) => {
  res.render("add_article", { title: "Add Article" });
});

// Add POST Submit route
app.post("/articles/add", (req, res) => {
  let article = new Articles();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

//Start server
app.listen(3000, () => {
  console.log("Running on port 3000");
});
