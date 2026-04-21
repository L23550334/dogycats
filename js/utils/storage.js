/**
 * Storage - Utilidades para localStorage
 * Maneja la persistencia de datos de adopciones
 */

// Clave para almacenar adopciones en localStorage
const STORAGE_KEY = 'mascotasAdoptadas';
const LEGACY_STORAGE_KEY = 'perrosAdoptados';

/**
 * Guarda una nueva adopcion en localStorage
 * @param {Object} adopcion - Objeto con datos de la adopcion
 * @returns {boolean} True si se guardo correctamente
 */
export function guardarAdopcion(adopcion) {
    try {
        const adoptados = obtenerAdopciones();
        
        // Agregar la nueva adopcion al inicio del array
        adoptados.unshift(adopcion);
        
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adoptados));
        
        return true;
    } catch (error) {
        console.error('Error al guardar adopcion:', error);
        return false;
    }
}

/**
 * Obtiene todas las adopciones guardadas
 * @returns {Array} Array de adopciones
 */
export function obtenerAdopciones() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);

        // Migracion automatica de clave legacy.
        const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!legacyData) return [];
        const parsed = JSON.parse(legacyData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return parsed;
    } catch (error) {
        console.error('Error al obtener adopciones:', error);
        return [];
    }
}

/**
 * Elimina una adopcion por su ID
 * @param {string} id - ID de la adopcion a eliminar
 * @returns {boolean} True si se elimino correctamente
 */
export function eliminarAdopcion(id) {
    try {
        const adoptados = obtenerAdopciones();
        const filtrados = adoptados.filter(adopcion => adopcion.id !== id);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
        
        return true;
    } catch (error) {
        console.error('Error al eliminar adopcion:', error);
        return false;
    }
}

/**
 * Elimina todas las adopciones
 * @returns {boolean} True si se limpio correctamente
 */
export function limpiarAdopciones() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar adopciones:', error);
        return false;
    }
}

/**
 * Obtiene el numero total de adopciones
 * @returns {number} Cantidad de adopciones
 */
export function contarAdopciones() {
    return obtenerAdopciones().length;
}

/**
 * Verifica si un perro ya fue adoptado (por ID de raza)
 * @param {number} perroId - ID de la raza del perro
 * @returns {boolean} True si ya fue adoptado al menos una vez
 */
export function yaAdoptado(perroId) {
    const adoptados = obtenerAdopciones();
    return adoptados.some(adopcion => adopcion.mascotaId === perroId || adopcion.perroId === perroId);
}

/**
 * Obtiene las ultimas N adopciones
 * @param {number} cantidad - Numero de adopciones a obtener
 * @returns {Array} Array con las ultimas adopciones
 */
export function obtenerUltimasAdopciones(cantidad = 5) {
    const adoptados = obtenerAdopciones();
    return adoptados.slice(0, cantidad);
}

/**
 * Objeto Storage para exportar todas las funciones como servicio unificado
 */
export const Storage = {
    guardarAdopcion,
    obtenerAdopciones,
    eliminarAdopcion,
    limpiarAdopciones,
    contarAdopciones,
    yaAdoptado,
    obtenerUltimasAdopciones
};
