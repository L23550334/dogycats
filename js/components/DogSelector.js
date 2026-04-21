/**
 * DogSelector - Componente para filtros y busqueda
 * Maneja filtros para perros y gatos.
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
    const speciesSelect = document.getElementById('speciesSelect');
    const searchNombre = document.getElementById('searchNombre');
    const filterPrincipal = document.getElementById('filterPrincipal');
    const filterTemperamento = document.getElementById('filterTemperamento');
    const filterChildFriendly = document.getElementById('filterChildFriendly');
    
    const especie = speciesSelect ? speciesSelect.value : 'perro';
    const childFriendlyValue = filterChildFriendly ? filterChildFriendly.value : '';

    return {
        especie,
        nombre: searchNombre ? searchNombre.value.trim() : '',
        principal: filterPrincipal ? filterPrincipal.value : '',
        temperamento: filterTemperamento ? filterTemperamento.value : '',
        childFriendly: childFriendlyValue
    };
}

/**
 * Limpia todos los filtros
 */
export function limpiarFiltros() {
    const searchNombre = document.getElementById('searchNombre');
    const filterPrincipal = document.getElementById('filterPrincipal');
    const filterTemperamento = document.getElementById('filterTemperamento');
    const filterChildFriendly = document.getElementById('filterChildFriendly');
    
    if (searchNombre) searchNombre.value = '';
    if (filterPrincipal) filterPrincipal.value = '';
    if (filterTemperamento) filterTemperamento.value = '';
    if (filterChildFriendly) filterChildFriendly.value = '';
}

/**
 * Verifica si hay algun filtro activo
 * @returns {boolean} True si hay filtros activos
 */
export function hayFiltrosActivos() {
    const filtros = obtenerFiltros();
    return filtros.nombre !== '' || filtros.principal !== '' || filtros.temperamento !== '' || filtros.childFriendly !== '';
}

/**
 * Inicializa los selectores con datos de los perros
 * @param {Perro[]} perros - Array de perros para extraer opciones
 * @param {Function} extraerGrupos - Funcion para extraer grupos unicos
 * @param {Function} extraerTemperamentos - Funcion para extraer temperamentos unicos
 */
export function inicializarSelectores(mascotas, extraerPrimario, extraerTemperamentos, especie = 'perro') {
    const filterPrincipal = document.getElementById('filterPrincipal');
    const filterTemperamento = document.getElementById('filterTemperamento');
    const filterChildFriendly = document.getElementById('filterChildFriendly');
    const principalLabel = document.getElementById('filterPrincipalLabel');
    const principalFilterWrap = document.getElementById('principalFilterWrap');
    const childFriendlyWrap = document.getElementById('childFriendlyWrap');
    
    if (principalLabel) {
        principalLabel.textContent = especie === 'perro' ? 'Grupo de Raza' : 'Atributo';
    }

    if (especie === 'perro') {
        if (principalFilterWrap) principalFilterWrap.classList.remove('d-none');
        const primarios = extraerPrimario(mascotas);
        poblarSelect(filterPrincipal, primarios, 'Todos los grupos');
    } else {
        if (principalFilterWrap) principalFilterWrap.classList.add('d-none');
        if (filterPrincipal) filterPrincipal.innerHTML = '<option value="">Todos los grupos</option>';
    }
    
    const temperamentos = extraerTemperamentos(mascotas).slice(0, 30);
    poblarSelect(filterTemperamento, temperamentos, 'Todos los temperamentos');

    if (childFriendlyWrap && filterChildFriendly) {
        if (especie === 'gato') {
            childFriendlyWrap.classList.remove('d-none');
            poblarSelect(filterChildFriendly, ['1', '2', '3', '4', '5'], 'Cualquier nivel');
        } else {
            childFriendlyWrap.classList.add('d-none');
            filterChildFriendly.innerHTML = '<option value="">Cualquier nivel</option>';
        }
    }
}

/**
 * Configura los event listeners para los filtros
 * @param {Function} onFiltrar - Callback que se ejecuta cuando cambian los filtros
 */
export function configurarEventListeners(onFiltrar, onCambiarEspecie) {
    const speciesSelect = document.getElementById('speciesSelect');
    const searchNombre = document.getElementById('searchNombre');
    const filterPrincipal = document.getElementById('filterPrincipal');
    const filterTemperamento = document.getElementById('filterTemperamento');
    const filterChildFriendly = document.getElementById('filterChildFriendly');
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (speciesSelect) {
        speciesSelect.addEventListener('change', () => {
            limpiarFiltros();
            if (onCambiarEspecie) onCambiarEspecie(speciesSelect.value);
        });
    }

    
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
    
    if (filterPrincipal) {
        filterPrincipal.addEventListener('change', onFiltrar);
    }
    
    if (filterTemperamento) {
        filterTemperamento.addEventListener('change', onFiltrar);
    }

    if (filterChildFriendly) {
        filterChildFriendly.addEventListener('change', onFiltrar);
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
