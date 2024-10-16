

async function render(view){
    let main = document.querySelector('main')
    if(view=="addAuthor" || view=="updateAuthor"){
        main.innerHTML = await (await fetch(`${view}.html`)).text()
    }
    else{
        main.innerHTML = await (await fetch(`views/${view}.html`)).text()
    }
    switch(view){
        case 'addBook' : {
            authorToltes();
            break;
        }
        case 'updateBook' : {
            authorToltes();
            break;
        }
    } 
    
}



