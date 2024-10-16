function onLoad(){
    console.log('xhr request')
    xhr.open('GET', 'http://127.0.0.1:5500/frontend/index.html', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            
            // Tábla feltöltés
            let tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            let szamlalo = 0;
            
      
            egyseg.innerHTML = '<option selected>Válaszd ki az egységet</option>'; 

            responseData.forEach((item) =>{
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');
               

                td1.innerHTML = item.title;    
                td2.innerHTML = item.releaseDate;
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
                    updateRow(item);
                };
                
                let tdUpdate = document.createElement('td');
                tdUpdate.appendChild(updateButton);
                
                
                let tdDelete = document.createElement('td');
                tdDelete.appendChild(deleteButton);
              
                

       
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
onLoad();


function konyvFeltoltes(){
    var data = JSON.stringify({
        title: document.querySelector('#title').value,  
        releaseDate: document.querySelector('#releaseDate').value,      
        ISBN: document.querySelector('#isbn').value,  
    });

    xhr.open('POST', 'http://127.0.0.1:5500/frontend/index.html', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            alert(xhr.responseText);  
        }
    };
    
    xhr.send(data);
    onLoad();
    
}

function deleteRow(item) {
    
        var xhrDelete = new XMLHttpRequest();
        xhrDelete.open('DELETE', `http://127.0.0.1:5500/frontend/index.html/${item.id}`, true); 
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
        onLoad();
    
}

function updateKonyv(item) {
       
        var data = JSON.stringify({
            title: document.querySelector('title'),
            releaseDate: document.querySelector('releaseDate'),
            ISBN: document.querySelector('isbn')

        });

        
        var xhrUpdate = new XMLHttpRequest();
        xhrUpdate.open('PATCH', `http://127.0.0.1:5500/frontend/index.html/${item.id}`, true);
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
        onLoad();
    
}