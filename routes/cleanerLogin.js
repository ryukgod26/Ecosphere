const express = require("express");
const cleanerLoginRouter=express.Router();

cleanerLoginRouter.get("/",function(req,res){
    res.render("cleanerLogin");
})
module.exports =cleanerLoginRouter;