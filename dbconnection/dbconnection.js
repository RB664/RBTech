require('dotenv').config()
const mysql = require('mysql')
var con = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    multipleStatements: true
})

con.connect((err) => {
    if(err) throw err
    console.log(`Sever is up and running`)
})

module.exports = con