const express = require('express');
const router = express.Router();
let db = require('../database.js');

// functions
let getSQLResults = (res,sql,params)=>{
  sql = 'SELECT * from memes ORDER BY ';
  sql = sql + String(params.sortBy)+' ';
  if(params.order=='desc') sql=  sql + String(params.order)+' ';
  let tmp = 'LIMIT '+String(params.take)+' OFFSET '+String(params.skip);
  sql = sql + tmp;
  console.log(sql);
  return db.all(sql,[],(err,rows) =>{
    if(err){
      res.status(400).json({error:err.message});
      return;
    }
      res.status(200).json({data: rows});
      return;
  })
}


router.get('/memes',(req,res) =>{
  res.status(200).json({msg:'Welcome to the Backend API'});
})

router.get('/memes/display',(req,res) =>{
  console.log('api route called\n');
  let {sortBy,order,skip,take} = req.query;
  if(!sortBy || !(sortBy=='id' || sortBy=='caption' || sortBy=='name'))sortBy ='id';
  if(!order || !(order=='desc' || order=='asc')) order='asc';
  if(!skip) skip=0;
  if(!take) take=100;
  let params = {sortBy,order,skip,take};
  return getSQLResults(res,'',params);
  /* Need to seperate params of order by clause because of
      Github issue: https://github.com/mapbox/node-sqlite3/issues/178
  */
})

module.exports = router;