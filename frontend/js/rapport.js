function rechercherProduit(){
    

    const input = document.getElementById('product').value;
    const error = document.querySelector('.error');

    if(input.length < 3){
        error.textContent = "Le produit doit contenir au moins 3 caractères";
        return;
    }

    const modal = document.querySelector('.modal');
    modal.style.top = '50%';

    const modalContent = document.querySelector('.modal-content');

    modalContent.textContent = "Chargement en cours...";

    try{
        fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${input}&page_size=&10&json=1`)
        .then(response => response.json())
        .then(data => {
            modalContent.textContent = "";
            modalContent.textContent = JSON.stringify(data.products[0]);
        });
    }
    catch{
        modalContent.textContent = "Le produit n'a pas été trouvé";
    }
}

function closeModal(){
    const modal = document.querySelector('.modal');
    modal.style.top = '-100%';
}