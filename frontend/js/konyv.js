
var xhr = new XMLHttpRequest();
function onBookLoad(){
    console.log('xhr request')
    xhr.open('GET', 'http://localhost:5000/books', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            
            // Tábla feltöltés
            let tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            
            
      
           // egyseg.innerHTML = '<option selected>Válaszd ki az egységet</option>'; 

            responseData.forEach((item) =>{
                let tr = document.createElement('tr');
                let td0 = document.createElement('td')
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');
               

                td0.innerHTML = item.id;
                td1.innerHTML = item.title;    
                td2.innerHTML = moment(item.releaseDate).format('YYYY-MM-DD');
                td3.innerHTML = item.ISBN;
                td4.innerHTML = item.name;
               
               
                
                

                
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
                    updateKonyv(item);
                };
                
                let tdUpdate = document.createElement('td');
                tdUpdate.appendChild(updateButton);
                tdUpdate.classList.add('text-end')
                
                
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


function konyvFeltoltes(){
    var data = JSON.stringify({
        title: document.querySelector('#title').value,  
        releaseDate: document.querySelector('#releaseDate').value,      
        ISBN: document.querySelector('#isbn').value,  
    });

    xhr.open('POST', 'http://localhost:5000/books', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            alert(xhr.responseText);  
        }
    };
    
    xhr.send(data);
    onBookLoad();
    
}

function deleteRow(item) {
    
        var xhrDelete = new XMLHttpRequest();
        xhrDelete.open('DELETE', `http://localhost:5000/books/${item.id}`, true); 
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

function updateKonyv(item) {
       
        var data = JSON.stringify({
            title: document.querySelector('title'),
            releaseDate: document.querySelector('releaseDate'),
            ISBN: document.querySelector('isbn')

        });

        
        var xhrUpdate = new XMLHttpRequest();
        xhrUpdate.open('PATCH', `http://localhost:5000/books/${item.id}`, true);
        xhrUpdate.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhrUpdate.onreadystatechange = function() {
            if (xhrUpdate.readyState === 4) {
                if (xhrUpdate.status === 200) {
                    alert('Frissítés sikeres!'); 
                    
                   
                    
                } else {
                    alert('Hiba történt: ' + xhrUpdate.responseText); 
                }
            }
        };

        xhrUpdate.send(data);
        onBookLoad();
    
}