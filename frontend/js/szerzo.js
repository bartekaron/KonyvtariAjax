
var xhrSzerzo = new XMLHttpRequest();
function onSzerzoLoad(){
    xhrSzerzo.open('GET', 'http://localhost:5000/authors', true);
    xhrSzerzo.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhrSzerzo.send();
    xhrSzerzo.onreadystatechange = function(){
        if(xhrSzerzo.readyState == 4){
            var responseData = JSON.parse(xhrSzerzo.responseText);
            console.log(responseData);
            
            // Tábla feltöltés
            let tbody = document.querySelector('#authorTbody');
            tbody.innerHTML = '';
            
            
      
           // egyseg.innerHTML = '<option selected>Válaszd ki az egységet</option>'; 

            responseData.forEach((item) =>{
                let tr = document.createElement('tr');
                let td0 = document.createElement('td')
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                
               

                td0.innerHTML = item.id;
                td1.innerHTML = item.name;    
                td2.innerHTML = moment(item.birthdate).format('YYYY-MM-DD');
               
               

                
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
                    // Hívjuk meg a frissítést a kiválasztott szerző ID-jével
                    updateSzerzo(item.id); // Pass the item ID to the updateSzerzo function
                    render("updateAuthor");
                };
                
                
                let tdUpdate = document.createElement('td');
                tdUpdate.appendChild(updateButton);
                tdUpdate.classList.add('text-end')
                
                
                let tdDelete = document.createElement('td');
                tdDelete.appendChild(deleteButton);
              
                

                tr.appendChild(td0);
                tr.appendChild(td1);    
                tr.appendChild(td2);
                tr.appendChild(tdUpdate);
                tr.appendChild(tdDelete);
                tbody.appendChild(tr);
            });
            
          
        }
    }
}
onSzerzoLoad();


function szerzoFeltoltes(event) {
    event.preventDefault(); // Prevent the default form submission

    var data = JSON.stringify({
        name: document.querySelector('#name').value,
        birthdate: document.querySelector('#birthdate').value        
    });

    var xhrSzerzo = new XMLHttpRequest();
    xhrSzerzo.open('POST', 'http://localhost:5000/authors', true);
    xhrSzerzo.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhrSzerzo.onreadystatechange = function() {
        if (xhrSzerzo.readyState === 4) {
            alert(xhrSzerzo.responseText);
            onSzerzoLoad(); // Reload author list after adding a new author
        }
    };

    xhrSzerzo.send(data);
}

function deleteRow(item) {
    
        var xhrSzerzoDelete = new XMLHttpRequest();
        xhrSzerzoDelete.open('DELETE', `http://localhost:5000/authors/${item.id}`, true); 
        xhrSzerzoDelete.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        
        xhrSzerzoDelete.onreadystatechange = function() {
            if (xhrSzerzoDelete.readyState === 4) {
                if (xhrSzerzoDelete.status === 202) {
                    alert('Sikeres törlés!'); 
                   
                    const rows = document.querySelectorAll('.table tbody tr');
                    rows.forEach(row => {
                        if (row.cells[1].innerText === item.termek) { 
                            row.remove();
                        }
                    });
                } else {
                    alert(xhrSzerzoDelete.responseText);
                }
            }
        };
        
        xhrSzerzoDelete.send();
        onSzerzoLoad();
    
}

function updateSzerzo(id) {
    var data = JSON.stringify({
        name: document.querySelector('#name').value,
        birthdate: document.querySelector('#birthdate').value
    });

    var xhrSzerzoUpdate = new XMLHttpRequest();
    xhrSzerzoUpdate.open('PATCH', `http://localhost:5000/authors/${id}`, true);
    xhrSzerzoUpdate.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhrSzerzoUpdate.onreadystatechange = function() {
        if (xhrSzerzoUpdate.readyState === 4) {
            if (xhrSzerzoUpdate.status === 200) {
                alert('Frissítés sikeres!');
                onSzerzoLoad(); // Reload author list after updating
            } else {
                alert('Hiba történt: ' + xhrSzerzoUpdate.responseText);
            }
        }
    };

    xhrSzerzoUpdate.send(data);
}
