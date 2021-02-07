var sqlite3 = require('sqlite3').verbose()
//var md5 = require('md5')  // for encrypting the storage data

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE memes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            url text , 
            caption text 
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log('Table already Created');
            }else{
                // Table just created, creating some rows
                // var insert = 'INSERT INTO memes (name, url, caption) VALUES (?,?,?)'
                // db.run(insert, ["Prateek Divyanshu","https://3yp0303qkdfy33z8u6dra4ty-wpengine.netdna-ssl.com/wp-content/uploads/Brands’-Meme-Marketing-Makes-Sentiment-Analysis-More-Important-Than-Ever.png","Good Memes Only"])
                console.log('Table memes created');
            }
        });  
    }
});


module.exports = db