require('dotenv').config();
var cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT;


app.use(cors())
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
    const query = `
        SELECT 
            b.id AS book_id,
            b.title AS title,
            b.releaseDate AS releaseDate,
            b.ISBN AS ISBN,
            GROUP_CONCAT(a.name SEPARATOR ', ') AS authors
        FROM 
            books b
        LEFT JOIN 
            book_authors ba ON b.id = ba.bookID
        LEFT JOIN 
            authors a ON ba.authorID = a.id
        GROUP BY 
            b.id
    `;

    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Hiba történt az adatbázishoz való csatlakozás során!");
            return;
        }
        res.status(200).send(results);
    });
});


app.post('/books', (req, res) => {
    if (!req.body.title) {
        return res.status(400).send("A könyv címe kötelező!");
    }

    // Új könyv hozzáadása
    pool.query(`INSERT INTO books (title, releaseDate, ISBN) VALUES (?, ?, ?)`, 
    [req.body.title, req.body.releaseDate, req.body.ISBN], (err, results) => {
        if (err) {
            return res.status(500).send("Hiba történt az adatbázishoz való csatlakozás során!");
        }

        // Könyv ID-jának lekérése
        const bookId = results.insertId;

        // Szerző hozzárendelése, ha van
        if (req.body.authorId) {
            pool.query(`INSERT INTO book_authors (bookID, authorID) VALUES (?, ?)`, 
            [bookId, req.body.authorId], (err) => {
                if (err) {
                    return res.status(500).send("Hiba történt a szerző hozzárendelésekor!");
                }
            });
        }

        return res.status(202).send({ id: bookId, message: "Sikeres regisztráció!" });
    });
});


app.patch('/books/:id', (req, res) => {
    if (!req.params.id) {
        res.status(203).send("Hiányzó azonosító!");
        return;
    }

    const { title, releaseDate, ISBN, authorId } = req.body;

    if (!title || !ISBN) {
        res.status(203).send('Hiányzó adatok!');
        return;
    }

    // Update book details
    pool.query(`UPDATE books SET title=?, releaseDate=?, ISBN=? WHERE id=?`, 
    [title, releaseDate, ISBN, req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }

        if (results.affectedRows == 0) {
            res.status(203).send('Hibás azonosító!');
            return;
        }

        // Update the book_authors table
        if (authorId) {
            pool.query(`DELETE FROM book_authors WHERE bookID=?`, [req.params.id], (err) => {
                if (err) {
                    return res.status(500).send("Hiba történt a szerző törlésekor!");
                }

                pool.query(`INSERT INTO book_authors (bookID, authorID) VALUES (?, ?)`, 
                [req.params.id, authorId], (err) => {
                    if (err) {
                        return res.status(500).send("Hiba történt a szerző hozzárendelésekor!");
                    }
                });
            });
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


app.post('/books/:book_id/authors/:author_id', async (req, res) => {
  const { book_id, author_id } = req.params;
  await pool.query('INSERT INTO book_authors (bookID, authorID) VALUES (?, ?)', [book_id, author_id]);
  res.status(201).send('Author assigned to book!');
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
app.post('/authors', (req, res) => {
  if (!req.body.name || !req.body.birthdate) {
    res.status(203).send('Nem adtál meg minden kötelező adatot');
    return;
  }
  pool.query(`INSERT INTO authors VALUES('', '${req.body.name}', '${req.body.birthdate}')`, (err, results) => {
    if (err) {
      res.status(500).send('Hiba történt az adatbázis művelet közben!');
      return;
    }
    res.status(202).send('Sikeres felvétel!');
    return;
  });
});


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
app.patch('/authors/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).send('Hiányzó azonosító!');
    }
    if (!req.body.name || !req.body.birthdate) {
        return res.status(400).send('Hiányzó adatok!');
    }
    pool.query(`UPDATE authors SET name=?, birthdate=? WHERE id=?`, [req.body.name, req.body.birthdate, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).send('Hiba történt az adatbázis elérése közben!');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Hibás azonosító!');
        }
        return res.status(200).send('Sikeres módosítás!');
    });
});



app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});