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

 module.exports = router