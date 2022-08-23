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
app.use(router,express.json(),cors(),express.urlencoded({
    extended : true
}))

const PORT = process.env.PORT;

app.listen(PORT,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${PORT}`)
})

router.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
router.get("/error",(req,res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})
router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

router.get('/user',(req,res) => {
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

router.get('/products',(req,res) => {
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

router.get('/products/:id',(req,res) => {
    let products = `SELECT * FROM Products WHERE ID = ${req.params.id};`;
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

// ADD PRODUCT
router.post('/products',bodyParser.json(),(req,res)=>{
    let {
        Name,
        Image,
        Information,
        Category,
        Price,
    } = req.body
    let addproduct = `Insert into Products(Name,
        Image,
        Information,
        Category,
        Price)
        Values(?,?,?,?,?)`

        connection.query(addproduct,[
            Name,
            Image,
            Information,
            Category,
            Price,
        ],(err,newProduct) => {
            if(err){
                res.redirect('/error')
                console.log(err)
            }
            console.log(newProduct)
        })
})

//  DELETE PRODUCT
router.delete('/products/:id',(req, res) => {
    let deleteproduct = `DELETE FROM Products WHERE ID = ${req.params.id}`;
    connection.query(deleteproduct, (err) => {
        if (err) {
            res.redirect('/error')
            console.log(err)
        }
    })
})

// EDIT PRODUCT
router.put('/products/:id',bodyParser.json(), (req,res) => {
    let{
        Name,
        Image,
        Information,
        Category,
        Price,
    } = req.body
    let editproduct = `UPDATE Products SET
    Name = ?,
    Image = ?,
    Information = ?,
    Category = ?,
    Price = ?
    WHERE ID = ${req.params.id}`;

    connection.query(editproduct, [
        Name,
        Image,
        Information,
        Category,
        Price,
    ],(err,editproduct) => {
        if (err) {
            res.redirect('/error')
            console.log(err)
        }
        res.end(JSON.stringify(editproduct))
    })
})

// LOGIN
router.post('/login',bodyParser.json(), (req,res) => {
    let email = {
        Email: req.body.Email
    };
    let password ={
        Password: req.body.Password
    }
    const login = `SELECT * FROM User WHERE ?`
    connection.query(login, email, async(err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            res.send('Email not found')
        } else {
            const Match = await bycrypt.compare(req.body.password,results[0].password);
        }
    })
})