const express = require('express');
const app = express();

let PORT = 8081;

// Route files 
app.use('/memes',require('./routes/backendRoutes'));


app.listen(PORT, () =>{
  console.log(`Backend Server running successfully on ${PORT}....\n`);
})