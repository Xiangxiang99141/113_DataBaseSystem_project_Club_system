const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send("HEllo WOrld");
});


app.listen('3000',()=>{
    console.log(">> Server is Start on 3000 <<")
});