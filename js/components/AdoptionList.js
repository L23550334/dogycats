/**
 * AdoptionList - Componente para la lista de adopciones
 * Renderiza y maneja la lista de perros adoptados
 */

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

/**
 * Genera el HTML de un item de adopcion
 * @param {Object} adopcion - Datos de la adopcion
 * @returns {string} HTML del item
 */
export function crearAdopcionItem(adopcion) {
    return `
        <div class="adoption-item new" data-adopcion-id="${adopcion.id}">
            <img 
                src="${adopcion.imagen}" 
                alt="${adopcion.nombreMascota}"
                onerror="this.src='https://via.placeholder.com/50?text=?'"
            >
            <div class="adoption-info">
                <p class="adoption-name">${adopcion.nombreMascota}</p>
                <p class="adoption-details">
                    ${adopcion.razaNombre} - Por ${adopcion.nombreAdoptante}
                </p>
                <small class="text-muted">${formatearFecha(adopcion.fechaAdopcion)}</small>
            </div>
            <button 
                class="btn btn-outline-danger btn-remove" 
                data-adopcion-id="${adopcion.id}"
                data-action="eliminar"
                title="Eliminar adopcion"
            >
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
}

/**
 * Renderiza la lista completa de adopciones
 * @param {Array} adopciones - Array de adopciones
 * @returns {string} HTML de la lista
 */
export function renderizarLista(adopciones) {
    if (!adopciones || adopciones.length === 0) {
        return '';
    }
    
    return adopciones.map(adopcion => crearAdopcionItem(adopcion)).join('');
}

/**
 * Actualiza la vista de la lista de adopciones
 * @param {Array} adopciones - Array de adopciones
 */
export function actualizarVista(adopciones) {
    const listaContainer = document.getElementById('listaAdopciones');
    const noAdopciones = document.getElementById('noAdopciones');
    const footer = document.getElementById('adopcionesFooter');
    const badgeTotal = document.getElementById('totalAdopciones');
    
    if (!listaContainer) return;
    
    const hayAdopciones = adopciones && adopciones.length > 0;
    
    // Actualizar lista
    listaContainer.innerHTML = hayAdopciones ? renderizarLista(adopciones) : '';
    
    // Mostrar/ocultar mensaje de "sin adopciones"
    if (noAdopciones) {
        noAdopciones.style.display = hayAdopciones ? 'none' : 'block';
    }
    
    // Mostrar/ocultar footer con boton de limpiar
    if (footer) {
        footer.style.display = hayAdopciones ? 'block' : 'none';
    }
    
    // Actualizar badge en el header
    if (badgeTotal) {
        badgeTotal.textContent = `${adopciones.length} adopcion${adopciones.length !== 1 ? 'es' : ''}`;
    }
    
    // Remover clase "new" despues de la animacion
    setTimeout(() => {
        const items = listaContainer.querySelectorAll('.adoption-item.new');
        items.forEach(item => item.classList.remove('new'));
    }, 500);
}

/**
 * Configura los event listeners para la lista de adopciones
 * @param {Function} onEliminar - Callback cuando se elimina una adopcion
 * @param {Function} onLimpiarTodo - Callback cuando se limpian todas las adopciones
 */
export function configurarEventListeners(onEliminar, onLimpiarTodo) {
    const listaContainer = document.getElementById('listaAdopciones');
    const btnLimpiar = document.getElementById('btnLimpiarAdopciones');
    
    // Delegacion de eventos para botones de eliminar
    if (listaContainer) {
        listaContainer.addEventListener('click', (e) => {
            const btnEliminar = e.target.closest('[data-action="eliminar"]');
            if (btnEliminar) {
                const adopcionId = btnEliminar.dataset.adopcionId;
                if (adopcionId && onEliminar) {
                    onEliminar(adopcionId);
                }
            }
        });
    }
    
    // Boton limpiar todas las adopciones
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Estas seguro de que quieres eliminar todas las adopciones?')) {
                if (onLimpiarTodo) {
                    onLimpiarTodo();
                }
            }
        });
    }
}

export const AdoptionList = {
    crearAdopcionItem,
    renderizarLista,
    actualizarVista,
    configurarEventListeners
};
