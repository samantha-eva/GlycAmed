const burger = document.querySelector('.burgermenu');
const nav = document.querySelector('.header-nav');
const bar = document.querySelectorAll('.bar');
let isOpen = false;

burger.addEventListener('click', () => {
    if(!isOpen){
        bar[0].style.transform = 'rotate(45deg)';
        bar[0].style.marginBottom = '-29.5px';
        bar[1].style.transform = 'rotate(-45deg)';
        bar[2].style.display = 'none';
        nav.style.display = 'flex';
    }
    else{
        bar[0].style.transform = 'rotate(0)';
        bar[0].style.marginBottom = 'auto';
        bar[1].style.transform = 'rotate(0)';
        bar[2].style.display = 'block';
        nav.style.display = 'none';
    }

    isOpen = !isOpen;
});

