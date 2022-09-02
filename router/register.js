require('dotenv').config();
const express = require("express");
const mysql = require('mysql');
const con = require('../dbconnection/dbconnection');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const aroute = require("./admin")

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
      let bd = req.body;
    hash = await bcrypt.hash(bd.Password, 10)
    bd.JoinDate = `${new Date().toISOString().slice(0, 10)}`;
    if (bd.Role === '' || bd.Role === null) {
      bd.Role = 'user'
    }
    let sql = `INSERT INTO User (Name, Email,Password, Role, JoinDate)VALUES (?, ?, ?, ?, ?);`
    con.query(sql, [bd.Name, bd.Email, hash, bd.Role, bd.JoinDate], (err, results) => {
      if (err) throw err
      // else {
      //   res.send(con)
      // }
      res.json({
        msg : 'U are in our db',
        userData : results
      })
    })};
    })
  });

  module.exports = router