const express = require('express');
const app = express();

let PORT = 8081;

app.listen(PORT, () =>{
  console.log(`Backend Server running successfully on ${PORT}....\n`);
})