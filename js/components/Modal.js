/**
 * Modal - Componente para el modal de adopcion
 * Maneja la interaccion del modal de confirmacion de adopcion
 */

// Referencia al modal de Bootstrap
let modalInstance = null;
let ultimoElementoConFoco = null;

/**
 * Inicializa el modal de Bootstrap
 */
export function inicializarModal() {
    const modalElement = document.getElementById('adoptionModal');
    if (modalElement && window.bootstrap) {
        modalInstance = new bootstrap.Modal(modalElement);
    }
}

/**
 * Abre el modal con los datos de la mascota seleccionada
 * @param {Object} mascota - Instancia de Perro o Gato a adoptar
 */
export function abrirModal(mascota) {
    if (!modalInstance) {
        inicializarModal();
    }

    ultimoElementoConFoco = document.activeElement;
    
    // Actualizar contenido del modal
    const modalPerroImg = document.getElementById('modalPerroImg');
    const modalPerroNombre = document.getElementById('modalPerroNombre');
    const modalPerroGrupo = document.getElementById('modalPerroGrupo');
    const perroIdInput = document.getElementById('perroIdAdoptar');
    const nombreMascota = document.getElementById('nombreMascota');
    const nombreAdoptante = document.getElementById('nombreAdoptante');
    
    if (modalPerroImg) {
        modalPerroImg.src = mascota.imagen;
        modalPerroImg.alt = `Foto de ${mascota.nombre}`;
    }
    if (modalPerroNombre) modalPerroNombre.textContent = mascota.nombre;
    if (modalPerroGrupo) {
        modalPerroGrupo.textContent = mascota.especie === 'perro'
            ? (mascota.grupoRaza || 'Sin grupo')
            : `Child Friendly: ${mascota.childFriendly || 0}/5`;
    }
    if (perroIdInput) perroIdInput.value = mascota.id;
    
    // Limpiar campos del formulario
    if (nombreMascota) nombreMascota.value = '';
    if (nombreAdoptante) nombreAdoptante.value = '';
    
    // Mostrar modal
    if (modalInstance) {
        modalInstance.show();
    }
}

/**
 * Cierra el modal
 */
export function cerrarModal() {
    const modalElement = document.getElementById('adoptionModal');
    const activeElement = document.activeElement;

    // Evita que el foco quede dentro de un modal que sera ocultado.
    if (modalElement && activeElement && modalElement.contains(activeElement)) {
        activeElement.blur();
    }

    if (modalInstance) {
        modalInstance.hide();
    }
}

/**
 * Obtiene los datos del formulario de adopcion
 * @returns {Object|null} Datos del formulario o null si es invalido
 */
export function obtenerDatosFormulario() {
    const perroIdInput = document.getElementById('perroIdAdoptar');
    const nombreMascota = document.getElementById('nombreMascota');
    const nombreAdoptante = document.getElementById('nombreAdoptante');
    
    const perroId = perroIdInput ? perroIdInput.value : null;
    const mascota = nombreMascota ? nombreMascota.value.trim() : '';
    const adoptante = nombreAdoptante ? nombreAdoptante.value.trim() : '';
    
    // Validar campos requeridos
    if (!mascota || !adoptante) {
        return null;
    }
    
    return {
        perroId,
        nombreMascota: mascota,
        nombreAdoptante: adoptante
    };
}

/**
 * Valida el formulario de adopcion
 * @returns {boolean} True si el formulario es valido
 */
export function validarFormulario() {
    const nombreMascota = document.getElementById('nombreMascota');
    const nombreAdoptante = document.getElementById('nombreAdoptante');
    
    let esValido = true;
    
    // Validar nombre de mascota
    if (!nombreMascota.value.trim()) {
        nombreMascota.classList.add('is-invalid');
        esValido = false;
    } else {
        nombreMascota.classList.remove('is-invalid');
    }
    
    // Validar nombre de adoptante
    if (!nombreAdoptante.value.trim()) {
        nombreAdoptante.classList.add('is-invalid');
        esValido = false;
    } else {
        nombreAdoptante.classList.remove('is-invalid');
    }
    
    return esValido;
}

/**
 * Configura los event listeners del modal
 * @param {Function} onConfirmar - Callback cuando se confirma la adopcion
 */
export function configurarEventListeners(onConfirmar) {
    const btnConfirmar = document.getElementById('btnConfirmarAdopcion');
    const form = document.getElementById('adoptionForm');
    const modalElement = document.getElementById('adoptionModal');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            if (validarFormulario()) {
                const datos = obtenerDatosFormulario();
                if (datos && onConfirmar) {
                    onConfirmar(datos);
                }
            }
        });
    }
    
    // Prevenir envio del formulario con Enter
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormulario()) {
                const datos = obtenerDatosFormulario();
                if (datos && onConfirmar) {
                    onConfirmar(datos);
                }
            }
        });
    }
    
    // Limpiar validacion cuando el usuario escribe
    const nombreMascota = document.getElementById('nombreMascota');
    const nombreAdoptante = document.getElementById('nombreAdoptante');
    
    if (nombreMascota) {
        nombreMascota.addEventListener('input', () => {
            nombreMascota.classList.remove('is-invalid');
        });
    }
    
    if (nombreAdoptante) {
        nombreAdoptante.addEventListener('input', () => {
            nombreAdoptante.classList.remove('is-invalid');
        });
    }

    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (ultimoElementoConFoco && typeof ultimoElementoConFoco.focus === 'function') {
                ultimoElementoConFoco.focus();
            } else {
                document.body.focus();
            }
        });
    }
}

export const Modal = {
    inicializarModal,
    abrirModal,
    cerrarModal,
    obtenerDatosFormulario,
    validarFormulario,
    configurarEventListeners
};
