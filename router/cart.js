require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('../dbconnection/dbconnection.js');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const e = require('express');

// ADD TO CART
let cart = [];
router.post('/user/:id/cart', bodyParser.json(), (req, res) => {
    let bd = req.body
    const cartQ = `
            SELECT Cart FROM User
            WHERE userID = ${req.params.id}
        `
    con.query(cartQ, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            if (results[0].cart == null) {
                // cart = []
            } else {
                cart = JSON.parse(results[0].cart)
            }
            let product = {
                "cart_id": cart.length + 1,
                "Name": bd.Name,
                "Image": bd.Image,
                "Information": bd.Information,
                "Category": bd.Category,
                "Price": bd.Price,
            }
            cart.push(product);
            const query = `
                    UPDATE User
                    SET Cart = ?
                    WHERE userID = ${req.params.id}
                `
            con.query(query, JSON.stringify(cart), (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    results: 'Product successfully added into cart'
                })
            })
        } else {
            res.json({
                status: 404,
                results: 'There is no user with that id'
            })
        }
    })
})

// SHOW USER CART
router.get('/user/:id/cart', (req, res) => {
    let cart = `SELECT Cart FROM User WHERE userID = ${req.params.id};`;
    con.query(cart, (err, cart) => {
        if (err) {
            console.log(err)
            res.redirect('/error')
        } else {
            res.json({
                status: 200,
                product: JSON.parse(cart[0].Cart)
            })
        }
    })
})

// DELETE PRODUCTS FROM CART
router.delete('/user/:id/cart', (req, res) => {
    const delCart = `
        SELECT Cart FROM User
        WHERE UserID = ${req.params.id}
    `
    con.query(delCart, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const query = `
                UPDATE User
                SET Cart = null
                WHERE userID = ${req.params.id}
            `
            con.query(query, (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    results: `Successfully cleared the cart`
                })
            });
        } else {
            res.json({
                status: 400,
                result: `There is no user with that ID`
            });
        }
    })
})

// DELETE PRODUCT FROM CART
router.delete('/user/:id/cart/:cartId', (req, res) => {
    const delSingleCartId = `
        SELECT Cart FROM User
        WHERE userID = ${req.params.id}
    `
    con.query(delSingleCartId, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            if (results[0].Cart != null) {
                const result = JSON.parse(results[0].Cart).filter((Cart) => {
                    return Cart.cart_id != req.params.cartId;
                })
                result.forEach((cart, i) => {
                    cart.cart_id = i + 1
                });
                const query = `
                    UPDATE User
                    SET Cart = ?
                    WHERE userID = ${req.params.id}
                `
                con.query(query, [JSON.stringify(result)], (err, results) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        result: "Successfully deleted item from cart"
                    });
                })
            } else {
                res.json({
                    status: 400,
                    result: "This user has an empty cart"
                })
            }
        } else {
            res.json({
                status: 400,
                result: "There is no user with that id"
            });
        }
    })
})

module.exports = router