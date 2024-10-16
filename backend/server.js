require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

var mysql      = require('mysql');
var pool  = mysql.createPool({
  host     : process.env.DBHOST,
  user     : process.env.DBUSER,
  password : process.env.DBPASS,
  database : process.env.DBNAME
});


app.get('/books', (req, res) => {
    pool.query(`SELECT * FROM books`, (err, results) => {
        if(err){
            res.status(500).send("Hiba történt az adatbázishoz való csatlakozás során!");
            return;
        }
        res.status(200).send(results);
        return; 
    })
});

app.post('/books', (req, res) => {
    if(!req.body.title) {
        res.status(400).send("A könyv címe kötelező!");
        return;
    }
    pool.query(`INSERT INTO books VALUES(' ','${req.body.title}', '${req.body.releaseDate}', '${req.body.ISBN}')`, (err, results) => {
        if(err){
            res.status(500).send("Hiba történt az adatbázishoz való csatlakozás során!");
            return;
        }
        res.status(202).send("Sikeres regisztráció!")
        return;
    });
});

app.patch('/books/:id', (req, res) => {
    if(!req.params.id){
        res.status(203).send("Hiányzó azonosító!");
        return;
    }
    if(!req.body.title || !req.body.ISBN){
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    pool.query(`UPDATE books SET title='${req.body.title}', releaseDate='${req.body.releaseDate}', ISBN='${req.body.ISBN}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        if(results.affectedRows == 0){
            res.status(203).send('Hibás azonosító!');
            return;
        }

        res.status(200).send('Sikeres módosítás!');
        return;
    });
});

app.delete('/books/:id', (req, res) => {

    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    pool.query(`DELETE FROM books WHERE ID='${req.params.id}'`, (err, results) => {

        if(err){
            res.status(500).send('Hiba történt az adatbázis lekérése közben!');
            return;
        }

        if(results.affectedRows == 0){
            res.status(203).send('Hibás az azonosító!');
            return;
        }

        res.status(200).send('Felhasználó törölve!');
        return;

    });

});



/*
GET /books - Listázza az összes könyvet.
POST /books - Új könyv hozzáadása.
PUT /books/{id} - Meglévő könyv módosítása.
DELETE /books/{id} - Könyv törlése.
*/

//POST /books/{book_id}/authors/{author_id} - Egy szerzőt hozzárendel egy könyvhöz.

//A szerzőkhez tartozó végpontok:

//GET /authors - Listázza az összes szerzőt.
app.get('/authors', (req, res) =>{
  pool.query(`SELECT id, name, birthdate FROM authors`, (err, results)=>{
    if(err){
      res.status(500).send('HIba történt az adatbázis elérése közben!')
      return;
    }
    res.status(200).send(results);
    return;
  })
})
//POST /authors - Új szerző hozzáadása.
app.post('/authors', (req,res)=>{
  if(!req.body.name || !req.body.birthdate){
    res.status(203).send('Nem adtál meg minden kötelező adatot')
    return;
  }
  pool.query(`INSERT INTO authors VALUES('','${req.body.name}', '${req.body.birthdate}')`, (err,results)=>{
    if(err){
      res.status(500).send('Hiba történt az adatbázis művelet közben!');
      return;
  }
  res.status(202).send('Sikeres felvétel!');
  return;
  })
})

//DELETE /authors/{id} - Szerző törlése.*/
app.delete('/authors/:id', (req, res) =>{
  if(!req.params.id){
    res.status(203).send("Hiányzó azaonosító!")
    return;
  }

  pool.query(`DELETE FROM authors WHERE id='${req.params.id}'`, (err,results)=>{

    if(err){
      res.status(500).send('Hiba történt az adatbázis lekérése közben!');
      return;
    }

    if(results.affectedRows == 0){
        res.status(203).send('Hibás az azonosító!');
        return;
    }

    res.status(200).send('Szerző törölve!');
    return;

  });
})

//PUT /authors/{id} - Meglévő szerző módosítása.
app.patch('/authors/:id', (req,res)=>{
  console.log(req.body);
  if(!req.params.id){
      res.status(203).send('Hiányzó azonosító!');
      return;
  }
  if(!req.body.name || !req.body.birthdate){
      res.status(203).send('Hiányzó adatok!');
      return;
  }
  pool.query(`UPDATE authors SET name='${req.body.name}', birthdate='${req.body.birthdate}' WHERE id='${req.params.id}'`, (err,results)=>{
    if(err){
      res.status(500).send('Hiba történt az adatbázis elérése közben!');
      return;
  }
  if(results.affectedRows == 0){
      res.status(203).send('Hibás azonosító!');
      return;
  }
  res.status(200).send('Sikeres módosítás!');
  return
  })
})



app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});