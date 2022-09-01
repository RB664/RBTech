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
      let con = req.body;
    con.Password = await bcrypt.hash(con.Password, 10)
    con.JoinDate = `${new Date().toISOString().slice(0, 10)}`;
    if (con.Role === '' || con.Role === null) {
      con.Role = 'user'
    }
    let sql = `INSERT INTO User (Name, Email,Password, Role, JoinDate)VALUES (?, ?, ?, ?, ?);`
    con.query(sql, [con.Name, con.Email, con.Password, con.Role, con.JoinDate], (err, results) => {
      if (err) throw err
      else {
        res.send(con)
      }
    })};
    })
  });

  module.exports = router