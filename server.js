const express=require('express')
const bodyparser=require('body-parser')

const app=express()
const port=8000

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.listen(port,()=>{
    console.log('App running on Server http://localhost:'+port)
})
app.get('/home',function(req,res){
    res.send("This Is Home Page")
})