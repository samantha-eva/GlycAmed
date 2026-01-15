class ProductCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const name = this.getAttribute('name') || '';
        const quantity = this.getAttribute('quantity') || '';
        const image = this.getAttribute('image') || '';
        const barcode = this.getAttribute('barcode') || '';

        this.innerHTML = `
            <div class="product-card" style="cursor: pointer;">
                <img src="${image}" alt="${name}" />
                <p>${name} - ${quantity}</p>
            </div>
        `;

        this.onclick = () => {
            if (typeof postItem === 'function') {
                postItem(name, quantity, barcode);
            }
        };
    }
}

customElements.define('product-card', ProductCard);