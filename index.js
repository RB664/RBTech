require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('./dbconnection/dbconnection.js');
const cors = require("cors");
const app = express();
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const e = require('express');
const port = parseInt(process.env.port) || 4000;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


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

// SHOW ALL USERS
router.get('/user',(req,res) => {
    let user = `SELECT * FROM User`
    con.query(user,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                users: results
            })
        }
    })
})

// SHOW SINGLE USER
router.get('/user/:id',(req,res) => {
    let products = `SELECT * FROM User WHERE ID = ${req.params.id};`;
    con.query(products,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                user : results
            })
        }
    })
})

// SHOW ALL PRODUCTS
router.get('/products',(req,res) => {
    let products = `SELECT * FROM Products`
    con.query(products,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                products : results
            })
        }
    })
})

// SHOW SINGLE PRODUCT
router.get('/products/:id',(req,res) => {
    let products = `SELECT * FROM Products WHERE ID = ${req.params.id};`;
    con.query(products,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                product : results
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

        con.query(addproduct,[
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
    con.query(deleteproduct, (err) => {
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

    con.query(editproduct, [
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

//REGISTER
router.post('/user/register', bodyParser.json(), async (req, res) => {
    const emails = `SELECT Email FROM User WHERE ?`;
    let details = {
        Email: req.body.Email,
    }
    con.query(emails, details, async (err, results) =>{
      if(results.length > 0){
     res.send("Email Exist");
    console.log(results.length)
      }else{
      let db = req.body;
    db.Password = await bcrypt.hash(db.Password, 10)
    db.JoinDate = `${new Date().toISOString().slice(0, 10)}`;
    if (db.Role === '' || db.Role === null) {
      db.Role = 'user'
    }
    let sql = `INSERT INTO User (Name, Email,Password, Role, JoinDate)VALUES (?, ?, ?, ?, ?);`
    con.query(sql, [db.Name, db.Email, db.Password, db.Role, db.JoinDate], (err, results) => {
      if (err) throw err
      else {
        res.send(db)
      }
    })};
    })
  });

//LOGIN
router.post('/user/login',bodyParser.json(),(req,res) => {
    let sql = `SELECT * FROM User WHERE Email LIKE ?`
    let email = {
      Email : req.body.Email
    }
    con.query(sql,email.Email, async (err,results) => {
      if(err) throw err
      if(results.length === 0){
        res.send(`No email found`)
      }else{
        const isMatch = await bcrypt.compare(req.body.Password, results[0].Password);
        if(!isMatch){
          res.send('Password is Incorrect')
        }else{
          const payload = {
            User: {
                Name: results[0].Name,
                Email: results[0].Email,
                Password: results[0].Password,
                Role: results[0].Role,
                JoinDate: results[0].JoinDate
            },
        };
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: "365d"
        }, (err, token) => {
            if (err) throw err;
            res.send(token)
            res.json({
              msg: results,
              token
            })
        });
        }
      }
    })
  });

// CART  

//   PAYMENTS
