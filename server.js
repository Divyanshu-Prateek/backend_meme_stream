const express = require('express');
const app = express();
let db = require("./database.js")

let PORT = 8081;

// Init Middleware
app.use(express.json({extended:false}));

// Route files 
app.use('/memes',require('./routes/backendRoutes'));


app.listen(PORT, () =>{
  console.log(`Backend Server running successfully on ${PORT}....\n`);
})