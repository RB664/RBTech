require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('./dbconnection/dbconnection');
const cors = require("cors");
const app = express();
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const port = parseInt(process.env.port) || 4000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});



const admin = require('./router/admin')
const cart = require('./router/cart')
const login = require('./router/login')
const register = require('./router/register')

app.set("port",process.env.PORT)
app.use(router,express.json(),cors(),express.urlencoded({
    extended : true
}))

const PORT = process.env.PORT;

app.listen(PORT,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${PORT}`)
})

app.use(admin)
app.use(cart)
app.use(login)
app.use(register)

router.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
router.get("/error",(req,res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

module.exports = router