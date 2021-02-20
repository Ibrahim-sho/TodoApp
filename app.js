const express = require('express');
const router = express.Router();
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require("./config/passport")(passport)

//BodyParser
app.use(express.urlencoded({extended : false}));

//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
    app.use(passport.initialize());
    app.use(passport.session());
   //use flash
    app.use(flash());
    app.use((req,res,next)=> {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error  = req.flash('error');
        next();
    })

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));



// //models
const TodoTask = require("./models/TodoTask");

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
app.use(expressEjsLayout);

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });

// //POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

    //UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});
    //DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
