const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/expresstest',function(err,db){
    if(err) throw err
    console.log("Data Base Connected Successfully")
});
