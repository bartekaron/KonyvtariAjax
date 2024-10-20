
var xhrSzerzo = new XMLHttpRequest();
function onSzerzoLoad() {
    xhrSzerzo.open('GET', 'http://localhost:5000/authors', true);
    xhrSzerzo.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhrSzerzo.send();
    xhrSzerzo.onreadystatechange = function () {
        if (xhrSzerzo.readyState == 4 && xhrSzerzo.status === 200) {
            var responseData = JSON.parse(xhrSzerzo.responseText);
            console.log(responseData);

            let tbody = document.querySelector('#authorTbody');
            tbody.innerHTML = ''; 

            responseData.forEach((item) => {
                let tr = document.createElement('tr');
                let td0 = document.createElement('td');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');

                td0.innerHTML = item.id;
                td1.innerHTML = item.name;
                td2.innerHTML = moment(item.birthdate).format('YYYY-MM-DD');
                let updateButton = document.createElement('button');
                updateButton.innerText = 'Frissítés';
                updateButton.classList.add('btn', 'btn-secondary');
                updateButton.onclick = (event) => {
                    event.stopPropagation();
                    const szerzoId = item.id;
                    window.location.href = `http://127.0.0.1:5500/frontend/views/updateAuthor.html?id=${szerzoId}`;
                };

                let deleteButton = document.createElement('button');
                deleteButton.innerText = 'Törlés';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.onclick = (event) => {
                    event.stopPropagation();
                    deleteRow(item);
                };

                let tdUpdate = document.createElement('td');
                tdUpdate.appendChild(updateButton);
                tdUpdate.classList.add('text-end');

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
    event.preventDefault();
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
            onSzerzoLoad(); 
        }
    };

    xhrSzerzo.send(data);
}

function deleteRow(item) {
    var xhrSzerzoDelete = new XMLHttpRequest();
    xhrSzerzoDelete.open('DELETE', `http://localhost:5000/authors/${item.id}`, true); 
    xhrSzerzoDelete.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhrSzerzoDelete.send();

    xhrSzerzoDelete.onreadystatechange = function() {
        onSzerzoLoad();
        if (xhrSzerzoDelete.readyState === 4) {
            if (xhrSzerzoDelete.status === 202) {
            } else {
                alert(xhrSzerzoDelete.responseText);
            }
        }
    };
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function() {
    const szerzoId = getQueryParam('id');
    console.log(szerzoId);
    if (szerzoId) {
        updateSzerzo(szerzoId); 
    }
});
function updateSzerzo(id) {
    console.log("updateSzerzo függvény fut ID-val: ", id);
    fetch(`http://localhost:5000/authors/${id}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#name').value = data.name;
            document.querySelector('#birthdate').value = data.birthdate;
        });
    document.querySelector('form').onsubmit = function(event) {
        event.preventDefault();
        
        var updatedData = JSON.stringify({
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
                    window.location.href = "../index.html";
                } else {
                    alert('Hiba történt: ' + xhrSzerzoUpdate.responseText);
                }
            }
        };

        xhrSzerzoUpdate.send(updatedData);
    };
}
