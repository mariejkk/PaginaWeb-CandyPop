
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');

    const isOpen = navMenu.classList.contains('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

//  CARRUSELES (Favoritos y Combos) 
 
function activarCarrusel(trackId, flechaIzqId, flechaDerId) {
    const track = document.getElementById(trackId);
    const flechaIzq = document.getElementById(flechaIzqId);
    const flechaDer = document.getElementById(flechaDerId);
 
    if (!track || !flechaIzq || !flechaDer) return;
 
    const getScrollAmount = () => {
        const item = track.querySelector('.carrusel-item');
        return item ? item.offsetWidth + 24 : 300;
    };
 
    flechaDer.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
 
    flechaIzq.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
}
 
 
activarCarrusel('carruselTrack', 'flechaIzq', 'flechaDer');
activarCarrusel('comboTrack', 'flechaComboIzq', 'flechaComboDer');

//  SCROLL REVEAL (aparecer al bajar) 
 
const revealElements = document.querySelectorAll('.reveal');
 
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.2
});
 
revealElements.forEach(el => revealObserver.observe(el));
 
 
// GALERÍA: ABRIR / CERRAR PANEL
 
const galeriaPanel = document.getElementById('galeriaPanel');
const abrirGaleria = document.getElementById('abrirGaleria');
const cerrarGaleria = document.getElementById('cerrarGaleria');
 
function abrirPanelGaleria() {
    galeriaPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
 
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
}
 
function cerrarPanelGaleria() {
    galeriaPanel.classList.remove('active');
    document.body.style.overflow = '';
}
 
if (abrirGaleria && galeriaPanel) {
    abrirGaleria.addEventListener('click', (e) => {
        e.preventDefault();
        abrirPanelGaleria();
    });
 
    cerrarGaleria.addEventListener('click', cerrarPanelGaleria);
 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarPanelGaleria();
    });
}
 
// GALERÍA: FILTROS POR CATEGORÍA 
 
const filtroBotones = document.querySelectorAll('.filtro-btn');
const galeriaItems = document.querySelectorAll('.galeria-item');
 
filtroBotones.forEach(boton => {
    boton.addEventListener('click', () => {

        filtroBotones.forEach(b => b.classList.remove('active'));
        boton.classList.add('active');
 
        const filtro = boton.dataset.filtro;
 
        galeriaItems.forEach(item => {
            const categoria = item.dataset.categoria;
            const coincide = filtro === 'todos' || categoria === filtro;
            item.classList.toggle('oculto', !coincide);
        });
    });
});
 