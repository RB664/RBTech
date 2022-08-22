const app = require("express")
const router = express.router()
const connection = require('../dbconnection/dbconnection.js')
router.get("/"), (req,res) => { 
    try{
        con.quer('select * from Products',(err,result) =>{
            if(err) throw err
            res.send(result)
        })
    }catch (error){
        console.log(error)
        res.status(400).send(error)
    }
}
module.exports = router