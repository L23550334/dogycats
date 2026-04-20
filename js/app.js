/**
 * App.js - Punto de entrada principal
 * Inicializa y coordina todos los componentes de la aplicacion
 */

// Importar clases POO
import { Perro } from './classes/Perro.js';
import { PerroFactory } from './classes/PerroFactory.js';

// Importar servicios
import { obtenerTodasLasRazas } from './services/api.js';
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
    perros: [],           // Todas las razas de perros (instancias de Perro)
    perrosFiltrados: [],  // Perros despues de aplicar filtros
    perroSeleccionado: null, // Perro seleccionado para adoptar
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
    totalPerros: document.getElementById('totalPerros')
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
function renderizarPerros(perros) {
    if (!perros || perros.length === 0) {
        mostrarSinResultados();
        DOM.resultadosCount.textContent = DogCard.textoResultados(0);
        return;
    }
    
    ocultarSinResultados();
    DOM.perrosGrid.innerHTML = DogCard.renderizarGrid(perros);
    DOM.resultadosCount.textContent = DogCard.textoResultados(perros.length);
}

/**
 * Actualiza el badge con el total de razas
 */
function actualizarTotalPerros() {
    DOM.totalPerros.textContent = `${AppState.perros.length} razas`;
}

// ============================================
// Logica de Filtrado
// ============================================

/**
 * Aplica los filtros actuales a la lista de perros
 */
function aplicarFiltros() {
    const filtros = DogSelector.obtenerFiltros();
    
    // Usar el metodo filtrar de PerroFactory
    AppState.perrosFiltrados = PerroFactory.filtrar(AppState.perros, filtros);
    
    // Ordenar por nombre
    AppState.perrosFiltrados = PerroFactory.ordenar(AppState.perrosFiltrados, 'nombre', true);
    
    // Renderizar resultados
    renderizarPerros(AppState.perrosFiltrados);
}

// ============================================
// Logica de Adopcion
// ============================================

/**
 * Maneja el clic en el boton de adoptar
 * @param {number} perroId - ID del perro a adoptar
 */
function manejarAdoptar(perroId) {
    // Buscar el perro por ID
    const perro = AppState.perros.find(p => p.id === parseInt(perroId));
    
    if (perro) {
        AppState.perroSeleccionado = perro;
        Modal.abrirModal(perro);
    }
}

/**
 * Confirma la adopcion de un perro
 * @param {Object} datos - Datos del formulario de adopcion
 */
function confirmarAdopcion(datos) {
    if (!AppState.perroSeleccionado) return;
    
    // Crear registro de adopcion usando el metodo de la clase Perro
    const adopcion = AppState.perroSeleccionado.crearRegistroAdopcion(
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
            `¡Felicidades! Has adoptado a ${datos.nombreMascota} (${AppState.perroSeleccionado.nombre})`
        );
        
        // Limpiar seleccion
        AppState.perroSeleccionado = null;
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
            const perroId = btnAdoptar.dataset.perroId;
            manejarAdoptar(perroId);
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
        console.log('[v0] Iniciando cargarDatos()');
        // Obtener datos de la API
        const datosAPI = await obtenerTodasLasRazas();
        console.log('[v0] datosAPI recibido:', datosAPI);
        
        // Usar Factory para crear instancias de Perro
        AppState.perros = PerroFactory.crearMultiples(datosAPI);
        console.log('[v0] Perros creados:', AppState.perros.length);
        AppState.perrosFiltrados = [...AppState.perros];
        
        // Ordenar alfabeticamente
        AppState.perrosFiltrados = PerroFactory.ordenar(AppState.perrosFiltrados, 'nombre', true);
        
        // Inicializar selectores con los datos
        DogSelector.inicializarSelectores(
            AppState.perros,
            PerroFactory.extraerGruposUnicos,
            PerroFactory.extraerTemperamentosUnicos
        );
        
        // Actualizar UI
        actualizarTotalPerros();
        renderizarPerros(AppState.perrosFiltrados);
        
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
    DogSelector.configurarEventListeners(aplicarFiltros);
    Modal.configurarEventListeners(confirmarAdopcion);
    AdoptionList.configurarEventListeners(eliminarAdopcion, limpiarTodasAdopciones);
    
    // Cargar adopciones existentes de localStorage
    actualizarListaAdopciones();
    
    // Cargar datos de la API
    await cargarDatos();
}

// ============================================
// Punto de Entrada
// ============================================

// Ejecutar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', init);
