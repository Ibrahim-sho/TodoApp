const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// //models
// const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");

app.listen(3000, () => console.log("Server Up and running"));
});



// View engine configuration

app.set("view engine", "ejs");

// Get method
app.get('/',(req, res) => {
    res.render('todo.ejs');
    });

// //POST METHOD
// app.post('/',async (req, res) => {
//     const todoTask = new TodoTask({
//     content: req.body.content
//     });
//     try {
//     await todoTask.save();
//     res.redirect("/");
//     } catch (err) {
//     res.redirect("/");
//     }
//     });
    
