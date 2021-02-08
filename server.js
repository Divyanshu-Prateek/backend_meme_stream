const express = require('express');
const app = express();
let db = require("./database.js")

let PORT = 8081;

// Init Middleware
app.use(express.json({extended:false}));

// Route files 
app.use('/memes',require('./routes/backendRoutes'));
app.use('/api',require('./routes/apiRoutes'));

app.get('/',(req,res) =>{
  res.status(200).json({owner:'Prateek Divyanshu',version:'0.0.1',message:'Welcome to Xmeme API'});
})

app.listen(PORT, () =>{
  console.log(`Backend Server running successfully on ${PORT}....\n`);
})