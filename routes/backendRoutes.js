const express = require('express');
const router = express.Router();
let db = require('../database.js');

router.get('/',async (req,res)=>{
  console.log("console log-- GET REQUEST")
  var sql = "select * from memes"
  var params = []
  await db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({
            "message":"success",
            "data":rows
        })
  });
  // res.status(200).json({msg:'Get All memes'});
})

router.post('/', async (req,res)=>{
  console.log("console log-- POST REQUEST");
  const {name,url,caption} = req.body;
  const data = {name,url,caption};
  const sql = 'INSERT INTO memes (name,url,caption) VALUES(?,?,?)';
  const params = [name,url,caption];
  await db.run(sql,params,function (err,result) {
    if(err){
      res.status(400).json({"error": err.message});
      return ;
    }
    res.status(200).json({
      "message":"success",
      "data":data,
      "id": this.lastID
    })
  })
  console.log(name+" "+url+' '+caption+"\n");
  //res.status(200).json({msg:'POST A meme'});
})
/*
let checkIfIdExists = async (id) => {
  let sql = 'SELECT * from memes where id = ?';
  let params =[id];
   db.get(sql,params, (err,row) =>{
    if(err){
      //res.status(400).json({msg:'Client Error'});
      return "400/ClientError",{};
    }
    if(!row){
      console.log("ID does not exist\n");
      return "404/Id does not Exist",{};
    }
    else{
      return "200/Id Exists",row;
    }
  });
}
*/
router.patch('/:id',async (req,res)=>{
  console.log("PATCH request");
  const id = req.params.id;
  const {url,caption} = req.body;
  if(!url && !caption){
    res.status(400).json({"error":"Bad Request from client"});
    return;
  }
  // only update no error checking 
  const name = null;
  let sql =`UPDATE memes set 
                name = COALESCE(?,name) ,
                url = COALESCE(?,url) ,  
                caption = COALESCE(?,caption) 
                WHERE id = ?`;
  let params = [name,url,caption,id];
  db.run( sql,params,
    function (err,result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.status(200).json({
          message: "success",
          data: {url,caption},
          changes: this.changes
      })
    });
  
/*
  // const resP,row = await checkIfIdExists(id);
  // console.log(resP,row);
  
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
      console.log(row);
      console.log(data);
      return res.status(200);
      
      //console.log("row\n"+row);
    }
  })
  /*
  if(false){
    /*console.log(data);
    // check if the new data i.e (name, newUrl,newCaption) already exists in the db
    sql = `SELECT * from memes 
              WHERE name = ? 
              AND url = ? 
              AND caption = ?`;
    params = [data.name,url,caption];
    await db.run(sql,params,(err,row) => {
      if(err){
        // do nothing
      }
      else{
        // (name, newUrll , newCaption) already exists in the db
        res.status(409).json({msg:'This meme already exists, cannot update'});
        return ;
      }
    })
    */
    // now we have checked that id exists and (name,newUrl,newCaption) does not exist in db already
    // so update it
    /*
    sql =`UPDATE memes set name = name , url = ? ,  caption = ? WHERE id = ?` ;
    params = [url,caption,id];
    await db.run( sql,params,
      function (err) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
      });
    res.status(200);
    return;
    console.log(url+" "+caption);
    console.log('Update a single meme' +`with id: ${id}`);
    // check if id is present in backend
    //res.status(200).json({msg:'Update a meme'});
    
  }
  console.log("data -->\n");
  console.log(data +"OK my bad");
  */
  // res.status(500).json({"error": "how did it reach here"});
  // return ;
})

router.get('/:id',async (req,res)=>{
  console.log('GET request single meme');
  const id = req.params.id;
  var sql = 'select * from memes where id = ?';
  var params = [id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({
            "message":"success",
            "data":row
        })
      });


  console.log('Get a single meme' +`with id: ${id}`);
  //res.status(200).json({msg:'Get a meme'});
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