
var xhr = new XMLHttpRequest();
szamlalo = 0;
let titleA;
let releaseDateA;
let ISBNA;
function onBookLoad() {
    console.log('xhr request')
    xhr.open('GET', 'http://localhost:5000/books', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            
            // Tábla feltöltés
            let tbody = document.querySelector('#konyvTbody');
            tbody.innerHTML = '';

            responseData.forEach((item) => {
                let tr = document.createElement('tr');
                let td0 = document.createElement('td')
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');  // Szerzők oszlopa


                td0.innerHTML = item.book_id;   // könyv azonosító
                td1.innerHTML = item.title;       // könyv címe    
                td2.innerHTML = moment(item.releaseDate).format('YYYY-MM-DD'); // kiadási dátum
                td3.innerHTML = item.ISBN;        // ISBN szám
                td4.innerHTML = item.authors;     // szerzők nevei

                let deleteButton = document.createElement('button');
                deleteButton.innerText = 'Törlés';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.onclick = (event) => {
                    event.stopPropagation(); 
                    deleteRow(item);
                };
                let updateButton = document.createElement('button');
                updateButton.innerText = 'Frissítés';
                updateButton.classList.add('btn', 'btn-secondary');
                updateButton.onclick = (event) => {
                    event.stopPropagation(); 
                    // Store the book data in local storage
                    localStorage.setItem('selectedBook', JSON.stringify(item));
                    // Redirect to updateBook.html
                    render('updateBook'); // Or window.location.href = "updateBook.html";
                    titleA = item.title;
                    releaseDateA = moment(item.releaseDate).format('YYYY-MM-DD');
                    ISBNA = item.ISBN;
                    
                };

                

                let tdUpdate = document.createElement('td');
                tdUpdate.appendChild(updateButton);
                tdUpdate.classList.add('text-end');

                let tdDelete = document.createElement('td');
                tdDelete.appendChild(deleteButton);

                tr.appendChild(td0);
                tr.appendChild(td1);    
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(tdUpdate);
                tr.appendChild(tdDelete);
                tbody.appendChild(tr);
            });
        }
    }
}


onBookLoad();

function loadBook(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/books/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var book = JSON.parse(xhr.responseText);
            document.querySelector('#title').value = book.title;
            document.querySelector('#releaseDate').value = book.releaseDate;
            document.querySelector('#isbn').value = book.ISBN;

            // Populate the author dropdown and select the current author
            authorToltes(); // Function to load authors
            document.querySelector('#authorSelect').value = book.authorId; // Select the current author
        }
    };
}
function ModositInicializalas(){
    document.querySelector('#titleB').value = titleA;
    document.querySelector('#releaseDateB').value = releaseDateA;
    document.querySelector('#isbnB').value = ISBNA;
};


function konyvFeltoltes(event) {
    event.preventDefault();

    var data = JSON.stringify({
        title: document.querySelector('#title').value,
        releaseDate: document.querySelector('#releaseDate').value,
        ISBN: document.querySelector('#isbn').value,
        authorId: document.querySelector('#authorSelect').value // Szerző ID
    });

    xhr.open('POST', 'http://localhost:5000/books', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            alert(xhr.responseText);
            window.location.href = 'index.html';
            onBookLoad(); // Itt hívod meg újra a könyvek listájának betöltését
        }
    };

    xhr.send(data);
}



function deleteRow(item) {
    
        var xhrDelete = new XMLHttpRequest();
        xhrDelete.open('DELETE', `http://localhost:5000/books/${item.book_id}`, true); 
        xhrDelete.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        
        xhrDelete.onreadystatechange = function() {
            if (xhrDelete.readyState === 4) {
                if (xhrDelete.status === 202) {
                    alert('Sikeres törlés!'); 
                   
                    const rows = document.querySelectorAll('.table tbody tr');
                    rows.forEach(row => {
                        if (row.cells[1].innerText === item.termek) { 
                            row.remove();
                        }
                    });
                } else {
                    alert(xhrDelete.responseText);
                }
            }
        };
        
        xhrDelete.send();
        onBookLoad();
    
}

function updateKonyv(id) {
    
    

    var data = JSON.stringify({
        title: document.querySelector('#titleB').value,
        releaseDate: document.querySelector('#releaseDateB').value,
        ISBN: document.querySelector('#isbnB').value
        
    });

    var xhrUpdate = new XMLHttpRequest();
    xhrUpdate.open('PATCH', `http://localhost:5000/books/${id}`, true);
    xhrUpdate.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhrUpdate.onreadystatechange = function() {
        if (xhrUpdate.readyState === 4) {
            if (xhrUpdate.status === 200) {
                alert('Frissítés sikeres!');
                window.location.href = 'index.html'; // Redirect to the main page after update
            } else {
                alert('Hiba történt: ' + xhrUpdate.responseText);
            }
        }
    };

    xhrUpdate.send(data);
}



function authorToltes() {
    var xhrAuthor = new XMLHttpRequest();
    xhrAuthor.open('GET', 'http://localhost:5000/authors', true);
    xhrAuthor.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhrAuthor.send();
    
    xhrAuthor.onreadystatechange = function() {
        if (xhrAuthor.readyState == 4) {

            if (xhrAuthor.status === 200) {
                var authorData = JSON.parse(xhrAuthor.responseText);
                
            
                if (Array.isArray(authorData)) {
                    authorData.forEach((item) => {
                        let option = document.createElement('option');
                        option.value = item.id;
                        option.text = item.name;
                        document.querySelector('#authorSelect').appendChild(option);
                    });
                } else {
                    console.error("Expected authorData to be an array.");
                }
            } else {
                console.error("Error fetching authors:", xhrAuthor.statusText);
            }
        }
    }
}




function fetchAuthorsAndSelect(selectedAuthorId) {
    var xhrAuthor = new XMLHttpRequest();
    xhrAuthor.open('GET', 'http://localhost:5000/authors', true);
    xhrAuthor.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhrAuthor.send();

    xhrAuthor.onreadystatechange = function() {
        if (xhrAuthor.readyState === 4 && xhrAuthor.status === 200) {
            var authorData = JSON.parse(xhrAuthor.responseText);
            var authorSelect = document.querySelector('#authorSelect');

            // Clear existing options
            authorSelect.innerHTML = '';

            authorData.forEach((item) => {
                let option = document.createElement('option');
                option.value = item.id;
                option.text = item.name;

                // Check if this author is the selected one
                if (item.id == selectedAuthorId) {
                    option.selected = true; // Mark as selected
                }

                authorSelect.appendChild(option);
            });
        }
    };
}

