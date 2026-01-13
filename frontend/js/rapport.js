import { CONFIG } from "../config/constants.js";

function postItem(name, quantity, barcode) {
    const modalContent = document.querySelector('.modal-content');

    const form = `
        <form id="rapport-form">
            <div class="labelinput">
                <label for="place">Lieu de consommation :</label>
                <input type="text" id="place" name="place" placeholder="Salle 4">
            </div>

            <div class="labelinput">
                <label for="note">Notes</label>
                <input type="text" name="note" id="note" placeholder="Amed semble malade">
            </div>

            <button type="submit">Balancer mon Amed !</button>
        </form>
    `;

    modalContent.innerHTML = form;

    // On attache l'event ici (pas dans postConsumption)
    const formEl = document.querySelector("#rapport-form");
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        postConsumption(barcode, name, quantity);
    });
}

async function postConsumption(barcode, name, quantity) {
    const place = document.getElementById('place').value;
    const note = document.getElementById('note').value;

    quantity = toMilliliters(quantity);

    const data = {
        barcode,
        name,
        quantity,
        place,
        note,
        when: new Date()
    };

    try {
        const response = await fetch(`${CONFIG.API_URL}/api/consumptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        document.querySelector('.modal').style.top = '-100%';
        document.querySelector('.error').textContent = "Poucave réussie !";
        document.querySelector('.error').style.color = "var(--accent)";

        setTimeout(() => {
            window.location = "/";
        }, 5000);

    } catch (err) {
        document.querySelector('.error').textContent = err.message;
    }
}



function rechercherProduit() {
    const input = document.getElementById('product').value;
    const error = document.querySelector('.error');

    if (input.length < 3) {
        error.textContent = "Le produit doit contenir au moins 3 caractères";
        return;
    }

    const modal = document.querySelector('.modal');
    modal.style.top = '50%';

    const modalContent = document.querySelector('.modal-content');
    modalContent.textContent = "Chargement en cours...";

    fetch(`${CONFIG.API_URL}/api/products/search?name=${input}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(async response => {
        modalContent.innerHTML = "";

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            if (contentType && contentType.includes("text/html")) {
                const errorText = await response.text();
                modalContent.textContent = "Erreur HTML reçue :\n" + errorText;
                return;
            }

            const errorJson = await response.json().catch(() => null);
            modalContent.textContent = "Erreur : " + JSON.stringify(errorJson);
            return;
        }

        const json = await response.json();

        if (!json.products || json.products.length === 0) {
            modalContent.textContent = "Aucun produit trouvé.";
            return;
        }

        const container = document.createElement("div");
        container.classList.add("modal-container");

        json.products.forEach(product => {
            const card = document.createElement("div");
            const img = document.createElement("img");

            img.src = product.image_url;
            img.alt = product.product_name;

            const title = document.createElement("p");
            title.textContent = product.name + " - " + product.quantity;

            // CORRECTION DES ARGUMENTS :
            card.onclick = () => {
                postItem(
                    product.name,         // name
                    product.quantity,     // quantity
                    product.barcode       // barcode
                );
            };

            card.appendChild(img);
            card.appendChild(title);

            container.appendChild(card);
        });

        modalContent.appendChild(container);
    })
    .catch(err => {
        modalContent.textContent = "Erreur réseau : " + err.message;
    });
}

document.getElementById('rechercherProduit').addEventListener('click', rechercherProduit);

function closeModal() {
    document.querySelector('.modal').style.top = '-100%';
}

document.getElementById('closeModal').addEventListener('click', closeModal);

function toMilliliters(input) {

  const value = parseFloat(input.replace(',', '.'));
  const unit = input.replace(/[0-9.,]/g, '').trim().toLowerCase();

  if (isNaN(value)) {
    throw new Error(`Valeur numérique invalide dans "${input}"`);
  }

  switch (unit) {
    case 'L':
    case 'l':
    case 'kg':
      return Math.round(value * 1000);
    case 'cL':
    case 'cl':
      return Math.round(value * 10);
    case 'ml':
    case 'mL':
    case 'g':
    case 'G':
      return Math.round(value);
    default:
      return 0;
  }
}

//Historique

async function openHistorique(){

    try{
        const response = await fetch(`${CONFIG.API_URL}/api/consumptions`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        const container = document.querySelector('.historique-container');
        let i = 0;

        result.forEach(consumption => {

            if(i >= 10){
                return;
            } 
            const card = document.createElement('div');
            card.classList.add('card');

            const product = document.createElement('p');
            product.textContent = `${formatDate(consumption.when)} : ${consumption.   name} - ${consumption.quantity} ml dans ${consumption.place}, ${consumption.note}`;

            card.appendChild(product);

            container.appendChild(card);
            i++;
        });
    }

    catch (err) {
        console.error(err.message);
    }
}

function formatDate(isoString) {
  const date = new Date(isoString);

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${heures}:${minutes} le ${jour}/${mois}/${annee}`;
}


openHistorique();
