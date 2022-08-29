require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('../dbconnection/dbconnection.js');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const e = require('express');

// SHOW ALL USERS
router.get('/user',(req,res) => {
    let users = `SELECT * FROM User`
    con.query(users,(err,results) => {
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
    let user = `SELECT * FROM User WHERE userID = ${req.params.id};`;
    con.query(user,(err,results) => {
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

// DELETE SINGLE USER
router.delete('/user/:id',(req,res) => {
    let user = `DELETE FROM User WHERE userID = ${req.params.id};`;
    con.query(user,(err,results) => {
        if(err){
            console.log(err)
            res.redirect('/error')
        }else{
            res.json({
                status: 200,
                msg : `U gone`
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
    let products = `SELECT * FROM Products WHERE productID = ${req.params.id};`;
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
            if(err) throw err
            res.json({
                msg: "Lets go"
            })
            // console.log(newProduct)
        })
})

//  DELETE PRODUCT
router.delete('/products/:id',(req, res) => {
    let deleteproduct = `DELETE FROM Products WHERE productID = ${req.params.id}`;
    con.query(deleteproduct, (err) => {
        if (err) throw err 
        res.json({
            msg: "life"
        })
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

module.exports = router