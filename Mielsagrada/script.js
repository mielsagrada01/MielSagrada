/* =====================================================
   1. CONFIGURACIÓN: AQUÍ PONES TUS DATOS
   ===================================================== */
const CONFIG = {
  whatsapp: '573023199920',          // código de país + número, sin + ni espacios (ej: 573001234567)
  instagram: '00.velasquez',           // tu usuario de Instagram, sin @
  mensajeWhatsapp: 'Hola, quiero información sobre sus bolsos'
};
 
/* =====================================================
   2. PRODUCTOS: AQUÍ MONTAS LOS BOLSOS
   Copia y pega un bloque { ... } por cada bolso.
   - imagen: ruta de la foto (ponla en la carpeta "img")
   - categoria: bandoleras, tote, mochilas o clutch (igual que en el menú)
   - etiqueta: texto opcional (ej: 'Nuevo'); déjalo '' si no quieres
   ===================================================== */
const PRODUCTOS = [
  { id: 1, nombre: 'Bandolera Aura',  precio: 129000, categoria: 'bandoleras', imagen: 'img/jajajaja.jpeg', etiqueta: 'Nuevo' },
  { id: 2, nombre: 'Tote Fungi',      precio: 198000, categoria: 'tote',       imagen: 'img/jaja.jpeg', etiqueta: '' },
  { id: 3, nombre: 'Mochila Texas',   precio: 189000, categoria: 'mochilas',   imagen: 'img/jajaja.jpeg', etiqueta: 'Nuevo' },
  { id: 4, nombre: 'Clutch Vlada',    precio: 139900, categoria: 'clutch',     imagen: 'img/jajajaja.jpeg', etiqueta: '' },
  { id: 5, nombre: 'Bandolera Anita', precio: 119000, categoria: 'bandoleras', imagen: 'img/ja.jpeg', etiqueta: '' },
  { id: 6, nombre: 'Tote Mía',        precio: 175000, categoria: 'tote',       imagen: 'img/jaja.jpg', etiqueta: '' },
  { id: 7, nombre: 'Mochila Selva',   precio: 210000, categoria: 'mochilas',   imagen: 'img/jajaja.jpeg', etiqueta: '' },
  { id: 8, nombre: 'Clutch Luna',     precio: 99000,  categoria: 'clutch',     imagen: 'img/jajajaja.jpeg', etiqueta: 'Nuevo' }
];
 
/* =====================================================
   3. UTILIDADES (no necesitas tocar esto)
   ===================================================== */
const $ = id => document.getElementById(id);
const leer = (clave, defecto) => JSON.parse(localStorage.getItem(clave)) ?? defecto;      // leer datos guardados en el navegador
const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));    // guardar datos en el navegador
const dinero = n => '$' + n.toLocaleString('es-CO');                                     // 129000 -> $129.000
 
/* =====================================================
   4. REDES SOCIALES (usa los datos de CONFIG)
   ===================================================== */
const urlWhatsapp = texto => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
$('linkWhatsapp').href = $('wsFlotante').href = urlWhatsapp(CONFIG.mensajeWhatsapp);
$('linkInstagram').href = `https://instagram.com/${CONFIG.instagram}`;
 
/* =====================================================
   5. PRODUCTOS: mostrar, filtrar por categoría y buscar
   ===================================================== */
let categoria = 'todos', busqueda = '';
 
function mostrarProductos() {
  const lista = PRODUCTOS.filter(p =>
    (categoria === 'todos' || p.categoria === categoria) &&
    p.nombre.toLowerCase().includes(busqueda));
  $('grid').innerHTML = lista.map(p => `
    <article class="card">
      <div class="foto">
        ${p.etiqueta ? `<span class="tag">${p.etiqueta}</span>` : ''}
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="this.style.display='none'">
        <button class="compra" data-id="${p.id}">🛒 Compra rápida</button>
      </div>
      <h3>${p.nombre}</h3>
      <p class="precio">${dinero(p.precio)}</p>
    </article>`).join('') || '<p class="vacio">No encontramos bolsos con esa búsqueda.</p>';
}
 
$('grid').addEventListener('click', e => {
  const b = e.target.closest('.compra');
  if (b) agregar(Number(b.dataset.id));
});
$('menu').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  categoria = b.dataset.cat;
  document.querySelectorAll('#menu button').forEach(x => x.classList.toggle('activo', x === b));
  $('menu').classList.remove('visible');
  mostrarProductos();
});
$('buscador').addEventListener('input', e => { busqueda = e.target.value.toLowerCase(); mostrarProductos(); });
$('btnMenu').onclick = () => $('menu').classList.toggle('visible');
 
/* =====================================================
   6. BANNER CON MOVIMIENTO (cambia solo cada 5 segundos)
   ===================================================== */
const slides = document.querySelectorAll('.slide');
let actual = 0, temporizador;
 
slides.forEach((_, i) => {                       // crea los puntitos de abajo
  const p = document.createElement('button');
  p.setAttribute('aria-label', 'Imagen ' + (i + 1));
  p.onclick = () => irA(i);
  $('puntos').appendChild(p);
});
function irA(n) {
  actual = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('activo', i === actual));
  $('puntos').querySelectorAll('button').forEach((p, i) => p.classList.toggle('activo', i === actual));
  clearInterval(temporizador);
  temporizador = setInterval(() => irA(actual + 1), 5000);   // 5000 = 5 segundos
}
$('prev').onclick = () => irA(actual - 1);
$('next').onclick = () => irA(actual + 1);
 
/* =====================================================
   7. INICIO DE SESIÓN Y REGISTRO
   IMPORTANTE: esto guarda los usuarios en el navegador y sirve para
   practicar o hacer una demo. Para una tienda real, las cuentas y
   contraseñas deben guardarse en un servidor con una base de datos.
   ===================================================== */
let modoRegistro = false;
let sesion = leer('sesion', null);               // usuario que tiene la sesión iniciada
 
function actualizarCuenta() {
  $('nombreUsuario').textContent = sesion ? sesion.nombre.split(' ')[0] : '';
}
function cambiarModo(registro) {
  modoRegistro = registro;
  $('tituloCuenta').textContent = registro ? 'Crear cuenta' : 'Iniciar sesión';
  $('cNombre').hidden = !registro;
  $('cNombre').required = registro;
  $('btnEnviarCuenta').textContent = registro ? 'Registrarme' : 'Entrar';
  $('cambiarModo').textContent = registro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate';
  $('msgCuenta').textContent = '';
}
$('cambiarModo').onclick = e => { e.preventDefault(); cambiarModo(!modoRegistro); };
 
$('btnCuenta').onclick = () => {
  if (sesion && confirm('¿Cerrar sesión de ' + sesion.nombre + '?')) {
    sesion = null; localStorage.removeItem('sesion'); actualizarCuenta();
  } else if (!sesion) { cambiarModo(false); abrir('modalCuenta'); }
};
 
$('formCuenta').onsubmit = e => {
  e.preventDefault();
  const correo = $('cCorreo').value.trim().toLowerCase(), clave = $('cClave').value;
  const usuarios = leer('usuarios', []);
  const existente = usuarios.find(u => u.correo === correo);
  if (modoRegistro) {
    if (existente) return $('msgCuenta').textContent = 'Ese correo ya está registrado.';
    const nuevo = { nombre: $('cNombre').value.trim(), correo, clave };
    guardar('usuarios', [...usuarios, nuevo]);
    sesion = nuevo;
  } else {
    if (!existente || existente.clave !== clave) return $('msgCuenta').textContent = 'Correo o contraseña incorrectos.';
    sesion = existente;
  }
  guardar('sesion', sesion);
  actualizarCuenta();
  $('formCuenta').reset();
  cerrar();
};
 
/* =====================================================
   8. CARRITO (se guarda, así no se pierde al recargar)
   ===================================================== */
let carrito = leer('carrito', []);               // lista de { id, cantidad }
 
function agregar(id) {
  const item = carrito.find(c => c.id === id);
  item ? item.cantidad++ : carrito.push({ id, cantidad: 1 });
  dibujarCarrito();
  abrir('carrito');
}
function cambiarCantidad(id, cambio) {
  const item = carrito.find(c => c.id === id);
  item.cantidad += cambio;
  if (item.cantidad <= 0) carrito = carrito.filter(c => c.id !== id);
  dibujarCarrito();
}
const totalCarrito = () => carrito.reduce((s, c) => s + PRODUCTOS.find(p => p.id === c.id).precio * c.cantidad, 0);
 
function dibujarCarrito() {
  guardar('carrito', carrito);
  $('contador').textContent = carrito.reduce((s, c) => s + c.cantidad, 0);
  $('total').textContent = dinero(totalCarrito());
  $('items').innerHTML = carrito.map(c => {
    const p = PRODUCTOS.find(x => x.id === c.id);
    return `<div class="item">
      <img src="${p.imagen}" alt="${p.nombre}" onerror="this.style.visibility='hidden'">
      <div><p>${p.nombre}</p><p>${dinero(p.precio)}</p>
        <div class="cant">
          <button data-id="${p.id}" data-c="-1" aria-label="Menos">−</button>
          <span>${c.cantidad}</span>
          <button data-id="${p.id}" data-c="1" aria-label="Más">+</button>
        </div></div>
      <button class="quitar" data-id="${p.id}" data-c="-999">Quitar</button>
    </div>`;
  }).join('') || '<p class="vacio">Tu carrito está vacío.</p>';
}
$('items').addEventListener('click', e => {
  const b = e.target.closest('button[data-id]');
  if (b) cambiarCantidad(Number(b.dataset.id), Number(b.dataset.c));
});
 
/* =====================================================
   9. PAGO (pide iniciar sesión antes de comprar)
   ===================================================== */
$('btnPagar').onclick = () => {
  if (!carrito.length) return;
  if (!sesion) { cerrar(); cambiarModo(false); abrir('modalCuenta'); return $('msgCuenta').textContent = 'Inicia sesión para continuar con tu compra.'; }
  $('pNombre').value = sesion.nombre;
  $('totalPago').textContent = dinero(totalCarrito());
  $('msgPago').textContent = '';
  abrir('modalPago');
};
 
$('formPago').onsubmit = e => {
  e.preventDefault();
  const pedido = {
    fecha: new Date().toLocaleString('es-CO'),
    cliente: sesion.correo,
    datos: { nombre: $('pNombre').value, direccion: $('pDireccion').value, ciudad: $('pCiudad').value, telefono: $('pTelefono').value },
    metodo: $('pMetodo').value,
    productos: carrito.map(c => ({ ...PRODUCTOS.find(p => p.id === c.id), cantidad: c.cantidad })),
    total: totalCarrito()
  };
  procesarPago(pedido);
};
 
/* AQUÍ se conecta la pasarela de pagos real (Wompi, PayU, MercadoPago, etc.).
   Por ahora solo guarda el pedido y vacía el carrito. */
function procesarPago(pedido) {
  guardar('pedidos', [...leer('pedidos', []), pedido]);
  if (pedido.metodo === 'whatsapp') {              // envía el pedido a tu WhatsApp
    const detalle = pedido.productos.map(p => `• ${p.cantidad} x ${p.nombre}`).join('\n');
    const texto = `Hola, quiero hacer este pedido:\n${detalle}\nTotal: ${dinero(pedido.total)}\n` +
                  `Nombre: ${pedido.datos.nombre}\nDirección: ${pedido.datos.direccion}, ${pedido.datos.ciudad}\nTel: ${pedido.datos.telefono}`;
    window.open(urlWhatsapp(texto), '_blank');
  }
  carrito = [];
  dibujarCarrito();
  cerrar();
  alert('¡Gracias por tu compra, ' + pedido.datos.nombre.split(' ')[0] + '! Tu pedido fue registrado.');
}
 
/* =====================================================
   10. ABRIR Y CERRAR VENTANAS
   ===================================================== */
function abrir(id) { cerrar(); $(id).classList.add('visible'); $('fondo').classList.add('visible'); }
function cerrar() {
  document.querySelectorAll('.modal, .carrito').forEach(x => x.classList.remove('visible'));
  $('fondo').classList.remove('visible');
}
$('fondo').onclick = cerrar;
document.querySelectorAll('[data-cerrar]').forEach(b => b.onclick = cerrar);
$('btnCarrito').onclick = () => abrir('carrito');
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
// Cerrar al hacer clic fuera de la caja blanca de una ventana
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) cerrar(); }));
 
/* =====================================================
   11. ARRANQUE: lo que se ejecuta al abrir la página
   ===================================================== */
mostrarProductos();
dibujarCarrito();
actualizarCuenta();
irA(0);