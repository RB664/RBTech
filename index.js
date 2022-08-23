require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const connection = require('./dbconnection/dbconnection.js');
const cors = require("cors");
const app = express();
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const port = parseInt(process.env.port) || 4000;


app.set("port",process.env.PORT)
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT

app.get("/",(req,res) => {
    res.json({
        msg:"Nani!!!!"
    })
})

app.get('/user',(req,res) => {
    let user = `SELECT * FROM User`
    connection.query(user,(err,results) => {
        if(err){
            console.log(err)
        }else{
            res.json({
                status: 200,
                user: results
            })
        }
    })
})

app.get('/products',(req,res) => {
    let products = `SELECT * FROM Products`
    connection.query(products,(err,results) => {
        if(err){
            console.log(err)
        }else{
            res.json({
                status: 200,
                products : results
            })
        }
    })
})



app.listen(PORT,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${PORT}`)
})