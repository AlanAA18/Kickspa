/* =========================================================
   KICKSPA — script.js
   Lógica del comparador antes/después y del formulario.
   Se conecta desde index.html (después de styles.css).
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- COMPARADOR ANTES / DESPUÉS ---------- */
  const compareBox = document.getElementById('compareBox');
  const range       = document.getElementById('compareRange');
  const cleanLayer  = document.querySelector('.clean-layer');
  const handle      = document.getElementById('dragHandle');

  let isDragging = false;

  // Mueve la línea divisoria a una posición (0-100).
  // "animated = true" activa una transición suave (usada en el
  // recorrido automático de entrada y en los clics/teclado);
  // mientras el usuario arrastra, se desactiva para que responda al instante.
  function updateCompare(val, animated) {
    val = Math.max(0, Math.min(100, val));
    compareBox.classList.toggle('animated', !!animated);
    cleanLayer.style.clipPath = `inset(0 0 0 ${val}%)`;
    handle.style.left = `${val}%`;
    range.value = val;
  }

  // --- Arrastre con el input range (teclado / accesibilidad) ---
  range.addEventListener('input', (e) => {
    isDragging = true;
    updateCompare(e.target.value, false);
  });

  // --- Arrastre directo con el mouse / dedo sobre toda la tarjeta ---
  function posToPercent(clientX) {
    const rect = compareBox.getBoundingClientRect();
    const x = clientX - rect.left;
    return (x / rect.width) * 100;
  }

  function startDrag(clientX) {
    isDragging = true;
    updateCompare(posToPercent(clientX), false);
  }
  function moveDrag(clientX) {
    if (!isDragging) return;
    updateCompare(posToPercent(clientX), false);
  }
  function endDrag() {
    isDragging = false;
  }

  compareBox.addEventListener('mousedown', (e) => startDrag(e.clientX));
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  compareBox.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  compareBox.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
  compareBox.addEventListener('touchend', endDrag);

  // --- Recorrido automático de bienvenida ---
  // Al cargar la página, el divisor se mueve solo de "antes" (sucio)
  // a "después" (limpio) y se detiene en el centro, para que la persona
  // entienda de inmediato cómo funciona el comparador sin tocarlo.
  function playIntroSweep() {
    updateCompare(15, true);              // arranca del lado "antes" (sucio)
    setTimeout(() => updateCompare(85, true), 700);   // desliza hacia "después" (limpio)
    setTimeout(() => updateCompare(50, true), 1650);  // se acomoda al centro
  }
  setTimeout(playIntroSweep, 500);

  /* ---------- FORMULARIO DE AGENDAMIENTO ---------- */
  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre    = document.getElementById('nombre').value;
    const telefono  = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const servicio  = document.getElementById('servicio').value;
    const fecha     = document.getElementById('fecha').value;

    let msg = `Hola Kickspa, quiero agendar una recogida.%0A`;
    msg += `Nombre: ${nombre}%0A`;
    msg += `Teléfono: ${telefono}%0A`;
    msg += `Dirección: ${direccion}%0A`;
    msg += `Servicio: ${servicio}%0A`;
    if (fecha) { msg += `Fecha preferida: ${fecha}%0A`; }

    window.open(`https://wa.me/573000000000?text=${msg}`, '_blank');
  });

});
