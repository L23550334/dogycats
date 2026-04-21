/**
 * Servicio API - Consumo de The Dog API y The Cat API
 * Maneja todas las peticiones asincronas para perros y gatos.
 */

const DOG_API_BASE_URL = 'https://api.thedogapi.com/v1';
const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';

const DOG_API_KEY = 'live_cODIvcHhjuEeZ0o017xMfQvS18Z27Xsv27aJLExSSy2Yb02gKHQ0C6BQixEHAddP';
const CAT_API_KEY = 'live_3ucjOSCaru399FsKg64IFpo7Dvm7Ovw5b2gGAxnDxDRXRsxWtPtIF3ZiYMEsrB1r';

/**
 * Obtiene todas las razas de perros disponibles
 * @returns {Promise<Array>} Array con datos de todas las razas
 * @throws {Error} Error si falla la peticion
 */
export async function obtenerTodasLasRazas() {
    try {
        const response = await fetch(`${DOG_API_BASE_URL}/breeds`, {
            headers: {
                'x-api-key': DOG_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error('No se pudieron cargar las razas de perros. Por favor, verifica tu conexion a internet y que tu API key sea correcta.');
    }
}

export async function obtenerTodasLasRazasGato() {
    try {
        const response = await fetch(`${CAT_API_BASE_URL}/breeds`, {
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error('No se pudieron cargar las razas de gatos. Verifica tu conexion a internet y la API key de gatos.');
    }
}

/**
 * Busca razas de perros por nombre
 * @param {string} nombre - Nombre o parte del nombre a buscar
 * @returns {Promise<Array>} Array con razas que coinciden
 * @throws {Error} Error si falla la peticion
 */
export async function buscarPorNombre(nombre) {
    try {
        if (!nombre || nombre.trim() === '') {
            return [];
        }
        
        const response = await fetch(`${DOG_API_BASE_URL}/breeds/search?q=${encodeURIComponent(nombre)}`, {
            headers: {
                'x-api-key': DOG_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error al buscar razas. Intenta de nuevo.');
    }
}

/**
 * Obtiene una raza especifica por su ID
 * @param {number} id - ID de la raza
 * @returns {Promise<Object>} Datos de la raza
 * @throws {Error} Error si falla la peticion
 */
export async function obtenerRazaPorId(id) {
    try {
        const response = await fetch(`${DOG_API_BASE_URL}/breeds/${id}`, {
            headers: {
                'x-api-key': DOG_API_KEY
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Raza no encontrada');
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Obtiene imagenes de una raza especifica
 * @param {number} breedId - ID de la raza
 * @param {number} limite - Numero maximo de imagenes (default: 5)
 * @returns {Promise<Array>} Array con URLs de imagenes
 */
export async function obtenerImagenesRaza(breedId, limite = 5) {
    try {
        const response = await fetch(
            `${DOG_API_BASE_URL}/images/search?breed_ids=${breedId}&limit=${limite}`,
            {
                headers: {
                    'x-api-key': DOG_API_KEY
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data.map(img => img.url);
    } catch (error) {
        return [];
    }
}

/**
 * Objeto API para exportar todas las funciones como un servicio unificado
 */
export const DogAPI = {
    obtenerTodasLasRazas,
    buscarPorNombre,
    obtenerRazaPorId,
    obtenerImagenesRaza,
    
    // Metodo de utilidad para verificar la conexion
    async verificarConexion() {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breeds?limit=1`, {
                headers: {
                    'x-api-key': DOG_API_KEY
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
};

export const CatAPI = {
    obtenerTodasLasRazas: obtenerTodasLasRazasGato,
    async verificarConexion() {
        try {
            const response = await fetch(`${CAT_API_BASE_URL}/breeds?limit=1`, {
                headers: {
                    'x-api-key': CAT_API_KEY
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
};
