require('dotenv').config()
const express = require("express")
const mysql = require('mysql')
const connection = require('./dbconnection/dbconnection.js')
const cors = require("cors")
const app = express()

app.set("port",process.env.PORT)
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT

app.get("/",(req,res) => {
    res.json({
        msg:"Nani!!!!"
    })
})

app.get('/products',(req,res) => {
    let sql = `select * from Products`
    db.query(sql,(err,results) => {
        if(err){
            console.log(err)
        }else{
            res.json({
                status: 200,
                results : results
            })
        }
    })
})

app.listen(PORT,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${PORT}`)
})