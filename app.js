require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');
const app=express();
mongoose.set('strictQuery', false);


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB");

var userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"]});

const User=mongoose.model("User",userSchema);


app.listen(3000,function(){
  console.log("Server started");
})

app.get("/",function(req,res){
  res.render("home");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.post("/register",function(req,res){
  const username=new User({
    email:req.body.username,
    password:req.body.password
  })

  username.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
})


app.post("/login",function(req,res){
  const uname=req.body.username;
  const upass=req.body.password;

  User.findOne({email:uname},function(err,foundlist){
    if(err){
      console.log(err);
    }else{
      if(foundlist){
        if(foundlist.password === upass){
          res.render("secrets");
        }
      }
    }
  })
})
