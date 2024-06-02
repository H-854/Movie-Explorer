const express = require("express");
const app = express();
const axios = require('axios');
const path = require('path');
const ExpressError = require("./ExpressError.js");
const wrapAsync = require("./wrapAsync.js");
const { copyFileSync } = require("fs");
const engine = require('ejs-mate')
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine('ejs', engine);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res,next)=>{
    try{
        res.render("index.ejs");
    }
    catch(e){
        next(e);
    }
})

app.get('/search', wrapAsync(async (req, res)=>{
    let { title } = req.query;
    const response = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey`);
    if(response.data.Error){
        throw new ExpressError(404,response.data.Error);
    }
    else{
        let movie = response.data;
        res.render("movie.ejs",{ movie });
    }
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let {status= 500,message="SOME ERROR"} = err;
    res.status(status).render("error.ejs",{message});
})
app.listen(3000,()=>{
    console.log("Server listening to port : ",3000);
})
