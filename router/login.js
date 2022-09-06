require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('../dbconnection/dbconnection.js');
const app = express();
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//LOGIN
router.post('/user/login',bodyParser.json(),(req,res) => {
    let sql = `SELECT * FROM User WHERE Email = ?`
    let {email, password} = req.body
    con.query(sql, email, async (err,results) => {
      // console.log(results)
      if(err) throw err
      if(results.length === 0){
        res.send(`No email found`)
      }else{
        const isMatch = await bcrypt.compare(password, results[0].Password);
        if(!isMatch){
          res.send('Password is Incorrect')
        }else{
            user ={
                Name: results[0].Name,
                Image: results[0].Image,
                Email: results[0].Email,
                Password: results[0].Password,
                Role: results[0].Role,
                JoinDate: results[0].JoinDate
            },
        
        jwt.sign(user, process.env.JWTSECRET, {
            expiresIn: "365d"
        }, (err, token) => {
            if (err) throw err;
            res.json({
              user: results,
              msg : "Welcome to RBTech",
              token
            })
        });
        }
      }
    })
  });

 module.exports = router