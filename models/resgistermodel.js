// const mongoose=require('mongoose')
// const Schema = mongoose.Schema;
//
// const student = new Schema({
//     userid: String,
//     username: String,
//     email: String,
//     number: String,
//     password:String,
//     date:{type:Date,default:Date.now}
// });
// var Student = mongoose.model('Student', student);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/expresstest');

const StudentSchema = new mongoose.Schema({
    id:Number,
    name:String,
    number:String,
    email:String,
    password:String,
    token:String
});

module.exports = mongoose.model(
    'students', StudentSchema);
