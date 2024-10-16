



async function render(view){
    let main = document.querySelector('main')
    if(view=="addAuthor"){
        main.innerHTML = await (await fetch(`${view}.html`)).text()
    }
    else{
        main.innerHTML = await (await fetch(`views/${view}.html`)).text()
    }
    
}



