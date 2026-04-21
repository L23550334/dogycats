/**
 * App.js - Punto de entrada principal
 * Inicializa y coordina todos los componentes de la aplicacion
 */

// Importar clases POO
import { PerroFactory } from './classes/PerroFactory.js';
import { GatoFactory } from './classes/GatoFactory.js';

// Importar servicios
import { obtenerTodasLasRazas, obtenerTodasLasRazasGato } from './services/api.js';
import { Storage } from './utils/storage.js';

// Importar componentes UI
import { DogCard } from './components/DogCard.js';
import { DogSelector } from './components/DogSelector.js';
import { Modal } from './components/Modal.js';
import { AdoptionList } from './components/AdoptionList.js';

// ============================================
// Estado Global de la Aplicacion
// ============================================
const AppState = {
    especieActiva: 'perro',
    mascotas: [],           // Todas las razas cargadas segun especie
    mascotasFiltradas: [],  // Mascotas despues de aplicar filtros
    mascotaSeleccionada: null, // Mascota seleccionada para adoptar
    cargando: true,       // Estado de carga
    error: null           // Mensaje de error si hay
};

// ============================================
// Referencias al DOM
// ============================================
const DOM = {
    perrosGrid: document.getElementById('perrosGrid'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    noResults: document.getElementById('noResults'),
    resultadosCount: document.getElementById('resultadosCount'),
    totalPerros: document.getElementById('totalPerros'),
    tituloBusqueda: document.getElementById('tituloBusqueda'),
    loadingText: document.getElementById('loadingText')
};

// ============================================
// Funciones de UI
// ============================================

/**
 * Muestra el spinner de carga
 */
function mostrarCargando() {
    AppState.cargando = true;
    DOM.loadingSpinner.classList.remove('d-none');
    DOM.perrosGrid.innerHTML = '';
    DOM.errorMessage.classList.add('d-none');
    DOM.noResults.classList.add('d-none');
}

/**
 * Oculta el spinner de carga
 */
function ocultarCargando() {
    AppState.cargando = false;
    DOM.loadingSpinner.classList.add('d-none');
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    DOM.errorText.textContent = mensaje;
    DOM.errorMessage.classList.remove('d-none');
    DOM.noResults.classList.add('d-none');
}

/**
 * Muestra mensaje de "sin resultados"
 */
function mostrarSinResultados() {
    DOM.noResults.classList.remove('d-none');
    DOM.perrosGrid.innerHTML = '';
}

/**
 * Oculta mensaje de "sin resultados"
 */
function ocultarSinResultados() {
    DOM.noResults.classList.add('d-none');
}

/**
 * Renderiza los perros en el grid
 * @param {Perro[]} perros - Array de perros a renderizar
 */
function renderizarMascotas(mascotas) {
    if (!mascotas || mascotas.length === 0) {
        mostrarSinResultados();
        DOM.resultadosCount.textContent = DogCard.textoResultados(0);
        return;
    }
    
    ocultarSinResultados();
    DOM.perrosGrid.innerHTML = DogCard.renderizarGrid(mascotas);
    DOM.resultadosCount.textContent = DogCard.textoResultados(mascotas.length);
}

/**
 * Actualiza el badge con el total de razas
 */
function actualizarTotalPerros() {
    DOM.totalPerros.textContent = `${AppState.mascotas.length} razas`;
    if (DOM.tituloBusqueda) {
        DOM.tituloBusqueda.textContent = AppState.especieActiva === 'perro' ? 'Buscar Razas de Perros' : 'Buscar Razas de Gatos';
    }
    if (DOM.loadingText) {
        DOM.loadingText.textContent = AppState.especieActiva === 'perro'
            ? 'Cargando razas de perros...'
            : 'Cargando razas de gatos...';
    }
}

// ============================================
// Logica de Filtrado
// ============================================

/**
 * Aplica los filtros actuales a la lista de perros
 */
function aplicarFiltros() {
    const filtros = DogSelector.obtenerFiltros();

    if (AppState.especieActiva === 'perro') {
        AppState.mascotasFiltradas = PerroFactory.filtrar(AppState.mascotas, filtros);
        AppState.mascotasFiltradas = PerroFactory.ordenar(AppState.mascotasFiltradas, 'nombre', true);
    } else {
        AppState.mascotasFiltradas = GatoFactory.filtrar(AppState.mascotas, filtros);
        AppState.mascotasFiltradas = GatoFactory.ordenar(AppState.mascotasFiltradas, true);
    }

    renderizarMascotas(AppState.mascotasFiltradas);
}

// ============================================
// Logica de Adopcion
// ============================================

/**
 * Maneja el clic en el boton de adoptar
 * @param {number} perroId - ID del perro a adoptar
 */
function manejarAdoptar(mascotaId) {
    const mascota = AppState.mascotas.find(item => String(item.id) === String(mascotaId));

    if (mascota) {
        AppState.mascotaSeleccionada = mascota;
        Modal.abrirModal(mascota);
    }
}

/**
 * Confirma la adopcion de un perro
 * @param {Object} datos - Datos del formulario de adopcion
 */
function confirmarAdopcion(datos) {
    if (!AppState.mascotaSeleccionada) return;
    
    const adopcion = AppState.mascotaSeleccionada.crearRegistroAdopcion(
        datos.nombreMascota,
        datos.nombreAdoptante
    );
    
    // Guardar en localStorage
    const guardado = Storage.guardarAdopcion(adopcion);
    
    if (guardado) {
        // Cerrar modal
        Modal.cerrarModal();
        
        // Actualizar lista de adopciones
        actualizarListaAdopciones();
        
        // Mostrar mensaje de exito (usando el toast de Bootstrap)
        mostrarNotificacion(
            `¡Felicidades! Has adoptado a ${datos.nombreMascota} (${AppState.mascotaSeleccionada.nombre})`
        );
        
        // Limpiar seleccion
        AppState.mascotaSeleccionada = null;
    }
}

/**
 * Elimina una adopcion
 * @param {string} adopcionId - ID de la adopcion a eliminar
 */
function eliminarAdopcion(adopcionId) {
    Storage.eliminarAdopcion(adopcionId);
    actualizarListaAdopciones();
}

/**
 * Limpia todas las adopciones
 */
function limpiarTodasAdopciones() {
    Storage.limpiarAdopciones();
    actualizarListaAdopciones();
}

/**
 * Actualiza la vista de la lista de adopciones
 */
function actualizarListaAdopciones() {
    const adopciones = Storage.obtenerAdopciones();
    AdoptionList.actualizarVista(adopciones);
}

// ============================================
// Notificaciones
// ============================================

/**
 * Muestra una notificacion temporal
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarNotificacion(mensaje) {
    // Crear toast dinámicamente
    const toastHTML = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <i class="bi bi-check-circle me-2"></i>
                    <strong class="me-auto">Adopcion exitosa</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${mensaje}
                </div>
            </div>
        </div>
    `;
    
    // Agregar al DOM
    const container = document.createElement('div');
    container.innerHTML = toastHTML;
    document.body.appendChild(container);
    
    // Remover despues de 4 segundos
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// ============================================
// Event Listeners Globales
// ============================================

/**
 * Configura el event listener para los botones de adoptar (delegacion de eventos)
 */
function configurarEventosGrid() {
    DOM.perrosGrid.addEventListener('click', (e) => {
        const btnAdoptar = e.target.closest('[data-action="adoptar"]');
        if (btnAdoptar) {
            const mascotaId = btnAdoptar.dataset.mascotaId;
            manejarAdoptar(mascotaId);
        }
    });
}

// ============================================
// Inicializacion
// ============================================

/**
 * Carga inicial de datos desde la API
 */
async function cargarDatos() {
    mostrarCargando();
    
    try {
        if (AppState.especieActiva === 'perro') {
            const datosAPI = await obtenerTodasLasRazas();
            AppState.mascotas = PerroFactory.crearMultiples(datosAPI);
            AppState.mascotasFiltradas = PerroFactory.ordenar([...AppState.mascotas], 'nombre', true);
            DogSelector.inicializarSelectores(
                AppState.mascotas,
                PerroFactory.extraerGruposUnicos,
                PerroFactory.extraerTemperamentosUnicos,
                'perro'
            );
        } else {
            const datosAPI = await obtenerTodasLasRazasGato();
            AppState.mascotas = GatoFactory.crearMultiples(datosAPI);
            AppState.mascotasFiltradas = GatoFactory.ordenar([...AppState.mascotas], true);
            DogSelector.inicializarSelectores(
                AppState.mascotas,
                (gatos) => {
                    const niveles = new Set(gatos.map(gato => String(gato.childFriendly || 0)).filter(item => item !== '0'));
                    return Array.from(niveles).sort((a, b) => Number(a) - Number(b));
                },
                GatoFactory.extraerTemperamentosUnicos,
                'gato'
            );
        }
        
        // Actualizar UI
        actualizarTotalPerros();
        renderizarMascotas(AppState.mascotasFiltradas);
        
    } catch (error) {
        AppState.error = error.message;
        mostrarError(error.message);
    } finally {
        ocultarCargando();
    }
}

/**
 * Inicializa la aplicacion
 */
async function init() {
    // Inicializar modal
    Modal.inicializarModal();
    
    // Configurar event listeners
    configurarEventosGrid();
    DogSelector.configurarEventListeners(aplicarFiltros, async (especie) => {
        AppState.especieActiva = especie;
        await cargarDatos();
    });
    Modal.configurarEventListeners(confirmarAdopcion);
    AdoptionList.configurarEventListeners(eliminarAdopcion, limpiarTodasAdopciones);
    
    // Cargar adopciones existentes de localStorage
    actualizarListaAdopciones();
    
    // Cargar datos de la API (por defecto perros)
    await cargarDatos();
}

// ============================================
// Punto de Entrada
// ============================================

// Ejecutar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', init);
