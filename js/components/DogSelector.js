/**
 * DogSelector - Componente para filtros y busqueda
 * Maneja la logica de filtrado de perros
 */

/**
 * Pobla un elemento select con opciones
 * @param {HTMLSelectElement} selectElement - Elemento select del DOM
 * @param {string[]} opciones - Array de opciones
 * @param {string} placeholder - Texto de la opcion por defecto
 */
export function poblarSelect(selectElement, opciones, placeholder = 'Todos') {
    // Limpiar opciones existentes excepto la primera
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    
    // Agregar nuevas opciones
    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        selectElement.appendChild(option);
    });
}

/**
 * Obtiene los valores actuales de los filtros
 * @returns {Object} Objeto con los valores de los filtros
 */
export function obtenerFiltros() {
    const searchNombre = document.getElementById('searchNombre');
    const filterGrupo = document.getElementById('filterGrupo');
    const filterTemperamento = document.getElementById('filterTemperamento');
    
    return {
        nombre: searchNombre ? searchNombre.value.trim() : '',
        grupoRaza: filterGrupo ? filterGrupo.value : '',
        temperamento: filterTemperamento ? filterTemperamento.value : ''
    };
}

/**
 * Limpia todos los filtros
 */
export function limpiarFiltros() {
    const searchNombre = document.getElementById('searchNombre');
    const filterGrupo = document.getElementById('filterGrupo');
    const filterTemperamento = document.getElementById('filterTemperamento');
    
    if (searchNombre) searchNombre.value = '';
    if (filterGrupo) filterGrupo.value = '';
    if (filterTemperamento) filterTemperamento.value = '';
}

/**
 * Verifica si hay algun filtro activo
 * @returns {boolean} True si hay filtros activos
 */
export function hayFiltrosActivos() {
    const filtros = obtenerFiltros();
    return filtros.nombre !== '' || filtros.grupoRaza !== '' || filtros.temperamento !== '';
}

/**
 * Inicializa los selectores con datos de los perros
 * @param {Perro[]} perros - Array de perros para extraer opciones
 * @param {Function} extraerGrupos - Funcion para extraer grupos unicos
 * @param {Function} extraerTemperamentos - Funcion para extraer temperamentos unicos
 */
export function inicializarSelectores(perros, extraerGrupos, extraerTemperamentos) {
    const filterGrupo = document.getElementById('filterGrupo');
    const filterTemperamento = document.getElementById('filterTemperamento');
    
    // Poblar grupos de raza
    const grupos = extraerGrupos(perros);
    poblarSelect(filterGrupo, grupos, 'Todos los grupos');
    
    // Poblar temperamentos (limitar a los mas comunes)
    const temperamentos = extraerTemperamentos(perros).slice(0, 30);
    poblarSelect(filterTemperamento, temperamentos, 'Todos los temperamentos');
}

/**
 * Configura los event listeners para los filtros
 * @param {Function} onFiltrar - Callback que se ejecuta cuando cambian los filtros
 */
export function configurarEventListeners(onFiltrar) {
    const searchNombre = document.getElementById('searchNombre');
    const filterGrupo = document.getElementById('filterGrupo');
    const filterTemperamento = document.getElementById('filterTemperamento');
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    
    // Debounce para el campo de busqueda
    let timeoutId;
    
    if (searchNombre) {
        searchNombre.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                onFiltrar();
            }, 300);
        });
    }
    
    if (filterGrupo) {
        filterGrupo.addEventListener('change', onFiltrar);
    }
    
    if (filterTemperamento) {
        filterTemperamento.addEventListener('change', onFiltrar);
    }
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            limpiarFiltros();
            onFiltrar();
        });
    }
}

export const DogSelector = {
    poblarSelect,
    obtenerFiltros,
    limpiarFiltros,
    hayFiltrosActivos,
    inicializarSelectores,
    configurarEventListeners
};
