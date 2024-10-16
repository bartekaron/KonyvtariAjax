const { title } = require("process");

var xhr = new XMLHttpRequest();

async function render(view){
    let main = document.querySelector('main')
    main.innerHTML = await (await fetch(`views/${view}.html`)).text()
    
    switch(view){
        case 'updateBook':{
          //  getMyProfile()
            break
        }
        case 'addBook': {
           // getUsers()
            break
        }
    }
}



