class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false; // On garde l'état dans l'instance du composant
    }

    connectedCallback() {
        // 1. On injecte le HTML directement (sans Shadow DOM pour profiter du CSS global)
        this.innerHTML = `
            <header>
                <a href="/">
                    <h1>Glycamed</h1>
                </a>
                <div class="burgermenu">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>

                <nav class="header-nav">
                    <a href="/">
                        <h1>Glycamed</h1>
                    </a>
                    <ul>
                        <li><a href="/index.html">Accueil</a></li>
                        <li><a href="/authentification/login.html">Connexion</a></li>
                        <li><a href="/rapport.html">Rapport</a></li>
                        <li><a href="/statistiques.html">Statistiques</a></li>
                    </ul>
                </nav>
            </header>
        `;

        // 2. On lance la logique JS une fois le HTML inséré
        this.initLogic();
    }

    initLogic() {
        // On utilise 'this.querySelector' pour chercher UNIQUEMENT à l'intérieur de ce header
        const burger = this.querySelector('.burgermenu');
        const nav = this.querySelector('.header-nav');
        const bar = this.querySelectorAll('.bar');

        if (burger) {
            burger.addEventListener('click', () => {
                if (!this.isOpen) {
                    // Logique d'ouverture (Ton code original)
                    bar[0].style.transform = 'rotate(45deg)';
                    bar[0].style.marginBottom = '-29.5px'; // Attention : vérifie que cette valeur correspond bien à ton CSS
                    bar[1].style.transform = 'rotate(-45deg)';
                    bar[2].style.display = 'none';
                    nav.style.display = 'flex';
                } else {
                    // Logique de fermeture (Ton code original)
                    bar[0].style.transform = 'rotate(0)';
                    bar[0].style.marginBottom = 'auto';
                    bar[1].style.transform = 'rotate(0)';
                    bar[2].style.display = 'block';
                    nav.style.display = 'none';
                }

                this.isOpen = !this.isOpen;
            });
        }
    }
}

// Définition du composant
customElements.define('header-component', HeaderComponent);