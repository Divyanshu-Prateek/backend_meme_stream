const express = require('express');
const router = express.Router();
let db = require('../database.js');

// functions:
let checkIfIdExists = (res,given_id) =>{
  let sql = 'SELECT * from memes where id = ?';
  let params = [given_id];
  return db.get(sql,params,(err,row) =>{
    if(err){
      res.status(400).json({"error":err.message});
      return ;
    }
    if(!row){
      res.status(400).json({msg:'Bad Request, Id does not exist'});
      return ;
    }
    res.status(200).json({msg:'success',data:row});
    return;
  })
}

let getAllMemes = (res) =>{
  var sql = "select * from memes"
  var params = []
  return db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        rows =rows.reverse();
        let data = [];
        let length = Math.min(rows.length,100);
        for(let i=0;i<length;i++) data.push(rows[i]);
        res.status(200).json({
            "message":"success",
            "data":data
        })
  });
}

let postMeme = (res,data) =>{
  let sql = 'INSERT INTO memes (name,url,caption) VALUES(?,?,?)';
  let params =[data.name,data.url,data.caption];
  return db.run(sql,params,function (err,result){
    if(err){
      res.status(400).json({err});
      return;
    }
    res.status(200).json({
      msg: "success",
      data: {id: this.lastID}
    })
    return;
  })
}

let postIfDuplicateDoesNotExist = (req,res) =>{
  let {name,url,caption} = req.body;
  //name = name.touppercase();
  let data = {name,url,caption};
  let sql = 'SELECT * from memes WHERE name=? AND url=? AND caption=?';
  let params = [data.name,data.url,data.caption];
  return db.get(sql,params, (err,row) =>{
    if(err){
      res.status(400).json({"error":err.message});
    }
    if(!row){
      return postMeme(res,data);
    }
    res.status(409).json({"error":'This meme post already exists'});
    return;
  })
}

let updateMeme = (res,name,url,caption,id) =>{
  const sql =`UPDATE memes set name = name , url = ? ,  caption = ? WHERE id = ?` ;
  const params = [url,caption,id];
  return db.run( sql,params,
  function (err) {
    if (err){
      res.status(400).json({"error": res.message})
      return;
    }
    res.status(200).json({msg:'updated'});
    return;
  });
}

let patchIfDuplicateDoesNotExist = (res,data,newData) => {
  let sql = `SELECT * from memes 
                 WHERE name = ? 
                 AND url = ? 
                 AND caption = ?`;
    let {id,url,caption} = newData;
    let name = data.name;  // as name cannot be changed
    params = [name,url,caption];
    return db.get(sql,params,(err,row2) => {
       if(err){
          // do nothing
          res.status(500).json({msg:err.message});
          return;
      }
      else{
       // (name, newUrll , newCaption) already exists in the db
        if(row2){
          res.status(409).json({msg:'This meme already exists, cannot update'});
          return ;
        }

        // function updateMeme(res,name,url,caption,id);
        return updateMeme(res,name,url,caption,id);
        }
      })
}

router.get('/',async (req,res)=>{
  console.log("console log-- GET REQUEST")
  return getAllMemes(res);
  // res.status(200).json({msg:'Get All memes'});
})

router.post('/', async (req,res)=>{
  console.log("console log-- POST REQUEST");
  const {name,url,caption} = req.body;
  const data = {name,url,caption};
  return postIfDuplicateDoesNotExist(req,res);
})

router.patch('/:id',async (req,res)=>{
  console.log("PATCH request");
  const id = req.params.id;
  const {url,caption} = req.body;
  let newData = {id,url,caption};
  if(!url && !caption){
    res.status(400).json({"error":"Bad Request from client"});
    return;
  }
  
  let data;
  let sql = 'SELECT * from memes where id = ?';
  let params =[id];
   db.get(sql,params, (err,row) =>{
    if(err){
      res.status(400).json({msg:'Client Error'});
      return ;
    }
    else{
      data = row;
      if(!row){
        res.status(404).json({msg:'Id does not exist'});
        return ;
      }
      return patchIfDuplicateDoesNotExist(res,data,newData);
    }
  })

})

router.get('/:id',async (req,res)=>{
  console.log('GET request single meme');
  const id = req.params.id;
  return checkIfIdExists(res,id);
})

router.delete('/:id', async (req,res) => {
  console.log('Delete a meme with id: ');
  const id = req.params.id;
  const sql = 'DELETE FROM memes WHERE id = ?'; 
  db.run(
    sql,
    id,
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.status(200).json({"message":"deleted", changes: this.changes})
});
  console.log('Delete a single meme' +`with id: ${id}`);
  //res.status(200).json({msg:'Delete a meme'});
})

module.exports = router;