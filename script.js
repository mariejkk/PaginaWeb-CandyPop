//MENU HAMBURGUESA PARA CELULARES
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


//CARRUSEL DE COMBOS

function activarCarrusel(trackId, flechaIzqId, flechaDerId) {
    const track = document.getElementById(trackId);
    const flechaIzq = document.getElementById(flechaIzqId);
    const flechaDer = document.getElementById(flechaDerId);

    if (!track || !flechaIzq || !flechaDer) return;

    const getScrollAmount = () => {
        const item = track.querySelector('.carrusel-item');
        return item ? item.offsetWidth + 20 : 300;
    };

    flechaDer.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    flechaIzq.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
}

activarCarrusel('comboTrack', 'flechaComboIzq', 'flechaComboDer');


//SCROLL REVEAL

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


//PRODUCTOS: FILTROS POR CATEGORIA

const filtroBotones = document.querySelectorAll('.filtro-btn');
const productoCards = document.querySelectorAll('.producto-card');

function filtrarProductos(filtro) {
    productoCards.forEach(card => {
        const categoria = card.dataset.categoria;
        const coincide = categoria === filtro;
        card.classList.toggle('oculto', !coincide);
    });
}

filtroBotones.forEach(boton => {
    boton.addEventListener('click', () => {
        filtroBotones.forEach(b => b.classList.remove('active'));
        boton.classList.add('active');

        const filtro = boton.dataset.filtro;
        filtrarProductos(filtro);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const botonActivo = document.querySelector('.filtro-btn.active');
    const filtroInicial = botonActivo ? botonActivo.dataset.filtro : 'palomitas';
    filtrarProductos(filtroInicial);

    actualizarContadorCarrito();
    renderizarCarrito();
});


// CARRITO DE COMPRAS Y PANEL DE CHECKOUT

let carrito = JSON.parse(localStorage.getItem('candypop_carrito')) || [];
const contadorCarritoElement = document.getElementById('contador-carrito');

const btnCarrito = document.getElementById('btn-carrito');
const carritoOverlay = document.getElementById('carritoOverlay');
const cerrarCarritoBtn = document.getElementById('cerrarCarrito');
const listaProductosCarrito = document.getElementById('listaProductosCarrito');
const carritoTotalMonto = document.getElementById('carritoTotalMonto');
const formCheckout = document.getElementById('formCheckout');
const toastMensaje = document.getElementById('toastMensaje');

function guardarCarrito() {
    localStorage.setItem('candypop_carrito', JSON.stringify(carrito));
}

// Notificación tipo "toast" al agregar un producto                 
let timeoutToast;                                                   
function mostrarToast(mensaje) {                                     
    const toast = document.getElementById('toastCarrito');           
    if (!toast || !toastMensaje) return;                             

    toastMensaje.textContent = mensaje;                             
    toast.classList.add('mostrar');                                  

    clearTimeout(timeoutToast);                                     
    timeoutToast = setTimeout(() => {                                
        toast.classList.remove('mostrar');                          
    }, 2000);                                                         
}        

if (btnCarrito) {
    btnCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        carritoOverlay.classList.add('activo');
    });
}

if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener('click', () => {
        carritoOverlay.classList.remove('activo');
    });
}

if (carritoOverlay) {
    carritoOverlay.addEventListener('click', (e) => {
        if (e.target === carritoOverlay) {
            carritoOverlay.classList.remove('activo');
        }
    });
}

function agregarAlCarrito(nombreProducto, precioProducto) {
    const precioNumerico = parseFloat(precioProducto) || 0;
    const productoExistente = carrito.find(item => item.nombre === nombreProducto);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombreProducto,
            precio: precioNumerico,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarToast(`${nombreProducto} agregado al carrito 🛒`);  
    actualizarContadorCarrito();
    renderizarCarrito();
}

function actualizarContadorCarrito() {
    if (!contadorCarritoElement) return;

    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarritoElement.textContent = totalItems;

    contadorCarritoElement.style.transform = 'scale(1.4)';
    contadorCarritoElement.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
        contadorCarritoElement.style.transform = 'scale(1)';
    }, 200);
}


function renderizarCarrito() {
    if (!listaProductosCarrito) return;

    if (carrito.length === 0) {
        listaProductosCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
        carritoTotalMonto.textContent = "RD$0";
        return;
    }

    listaProductosCarrito.innerHTML = '';
    let totalGeneral = 0;

    carrito.forEach((item, index) => {
        const precioUnitario = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 0;

        const subtotal = precioUnitario * cantidad;
        totalGeneral += subtotal;

        const tarjetaItem = document.createElement('div');
        tarjetaItem.className = 'carrito-item-card';
        tarjetaItem.innerHTML = `
            <div class="carrito-item-info">
                <strong>${item.nombre}</strong>
                <small>RD$${subtotal}</small>
            </div>
            <div class="carrito-item-controles">
                <button type="button" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
        `;
        listaProductosCarrito.appendChild(tarjetaItem);
    });

    carritoTotalMonto.textContent = `RD$${totalGeneral}`;
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Mostrar/ocultar el campo de dirección según el tipo de entrega
const radiosEntrega = document.querySelectorAll('input[name="tipoEntrega"]');
const seccionDireccion = document.getElementById('seccionDireccion');
const direccionCliente = document.getElementById('direccionCliente');

function actualizarVisibilidadDireccion() {
    const tipoSeleccionado = document.querySelector('input[name="tipoEntrega"]:checked').value;

    if (tipoSeleccionado === 'Retiro') {
        seccionDireccion.style.display = 'none';
        direccionCliente.required = false;
    } else {
        seccionDireccion.style.display = '';
        direccionCliente.required = true;
    }
}

radiosEntrega.forEach(radio => {
    radio.addEventListener('change', actualizarVisibilidadDireccion);
});

actualizarVisibilidadDireccion();

// Envío del pedido final formateado hacia WhatsApp
if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert('Agrega al menos un producto a tu carrito antes de enviar el pedido.');
            return;
        }

        const nombre = document.getElementById('nombreCliente').value;
        const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
        const direccion = document.getElementById('direccionCliente').value;
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
        const nota = document.getElementById('notaCliente').value;

        let totalGeneral = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        let mensaje = `*¡Hola, Candy Pop!* \nQuiero realizar el siguiente pedido:\n\n`;

        carrito.forEach(item => {
            mensaje += `▪️ ${item.cantidad}x ${item.nombre} (RD$${item.precio * item.cantidad})\n`;
        });

        mensaje += `\n*Total estimado:* RD$${totalGeneral}`;
        mensaje += `\n\n *Nombre:* ${nombre}`;
        mensaje += `\n *Método:* ${tipoEntrega}`;
        if (tipoEntrega === 'Delivery') {
            mensaje += `\n *Dirección:* ${direccion}`;
        }
        mensaje += `\n *Pago:* ${metodoPago}`;
        if (nota) {
            mensaje += `\n *Nota:* ${nota}`;
        }

        const telefonoNegocio = "18094868433";
        const urlWhatsApp = `https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensaje)}`;

        window.open(urlWhatsApp, '_blank');

        carrito = [];
        guardarCarrito();
        actualizarContadorCarrito();
        renderizarCarrito();
    });
}

// CONTROLADOR DE MODAL DINÁMICO (PASTELES EN HOJA Y PALOMITAS)

const modalVasosOverlay = document.getElementById('modalVasosOverlay');
const cerrarModalVasosBtn = document.getElementById('cerrarModalVasos');
const tituloModalPalomitas = document.getElementById('tituloModalPalomitas');
const descripcionModalTexto = document.getElementById('descripcionModalTexto');
const btnConfirmarModal = document.getElementById('btnConfirmarModal');

const grupoSelectPalomitas = document.getElementById('grupoSelectPalomitas');
const grupoSelectPastel = document.getElementById('grupoSelectPastel');
const selectPalomitasVasos = document.getElementById('selectPalomitasVasos');
const selectPastelRelleno = document.getElementById('selectPastelRelleno');

let productoSeleccionadoActual = '';
let tipoProductoActual = '';

function abrirModalOpciones(nombreProducto) {
    productoSeleccionadoActual = nombreProducto;
    const nombreLower = nombreProducto.toLowerCase();

    if (nombreLower.includes('palomitas')) {
        tipoProductoActual = 'palomitas';
        if (tituloModalPalomitas) tituloModalPalomitas.textContent = "Elige tu vaso";
        if (descripcionModalTexto) descripcionModalTexto.textContent = "Selecciona el tamaño de vaso que prefieres:";

        grupoSelectPalomitas.style.display = 'flex';
        grupoSelectPastel.style.display = 'none';

    } else if (nombreLower.includes('pastel en hoja')) {
        tipoProductoActual = 'pastel';
        if (tituloModalPalomitas) tituloModalPalomitas.textContent = "Elige tu relleno";
        if (descripcionModalTexto) descripcionModalTexto.textContent = "Selecciona el tipo de carne o preparación:";

        grupoSelectPalomitas.style.display = 'none';
        grupoSelectPastel.style.display = 'flex';
    }

    if (modalVasosOverlay) {
        modalVasosOverlay.classList.add('activo');
    }
}

if (cerrarModalVasosBtn) {
    cerrarModalVasosBtn.addEventListener('click', () => {
        modalVasosOverlay.classList.remove('activo');
    });
}

if (modalVasosOverlay) {
    modalVasosOverlay.addEventListener('click', (e) => {
        if (e.target === modalVasosOverlay) {
            modalVasosOverlay.classList.remove('activo');
        }
    });
}

if (btnConfirmarModal) {
    btnConfirmarModal.addEventListener('click', () => {
        let selectActivo = null;

        if (tipoProductoActual === 'palomitas') {
            selectActivo = selectPalomitasVasos;
        } else if (tipoProductoActual === 'pastel') {
            selectActivo = selectPastelRelleno;
        }

        if (!selectActivo) return;

        const opcionSeleccionada = selectActivo.options[selectActivo.selectedIndex];
        const detalleOpcion = opcionSeleccionada.getAttribute('data-tamanio');
        const precioOpcion = parseFloat(opcionSeleccionada.value) || 0;

        const nombreCompletoFinal = `${productoSeleccionadoActual} (${detalleOpcion})`;

        // Envía al carrito principal
        agregarAlCarrito(nombreCompletoFinal, precioOpcion);

        // Cierra el modal
        modalVasosOverlay.classList.remove('activo');
    });
}