/**
 * PerroFactory - Patron Factory
 * Fabrica para crear instancias de Perro a partir de datos de la API
 */
import { Perro } from './Perro.js';

export class PerroFactory {
    // URL de imagen placeholder cuando no hay imagen disponible
    static PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=Sin+Imagen';

    /**
     * Crea una instancia de Perro a partir de los datos crudos de la API
     * @param {Object} datosAPI - Datos crudos de The Dog API
     * @returns {Perro} Nueva instancia de Perro
     */
    static crearDesdeAPI(datosAPI) {
        // Validar que tengamos datos
        if (!datosAPI) {
            throw new Error('No se proporcionaron datos para crear el Perro');
        }

        // Extraer y limpiar los datos de la API
        const id = datosAPI.id;
        const nombre = datosAPI.name || 'Raza desconocida';
        const grupoRaza = datosAPI.breed_group || 'Sin grupo';
        const temperamento = datosAPI.temperament || 'No especificado';
        
        // Manejar peso y altura (vienen en formato { imperial: "...", metric: "..." })
        const peso = datosAPI.weight?.metric || 'N/A';
        const altura = datosAPI.height?.metric || 'N/A';
        
        const esperanzaVida = datosAPI.life_span || 'N/A';
        const criadoPara = datosAPI.bred_for || '';
        
        // Obtener URL de imagen
        let imagen = this.PLACEHOLDER_IMAGE;
        if (datosAPI.image?.url) {
            imagen = datosAPI.image.url;
        } else if (datosAPI.reference_image_id) {
            // Construir URL si solo tenemos el ID de referencia
            imagen = `https://cdn2.thedogapi.com/images/${datosAPI.reference_image_id}.jpg`;
        }

        // Crear y retornar nueva instancia de Perro
        return new Perro(
            id,
            nombre,
            grupoRaza,
            temperamento,
            peso,
            altura,
            esperanzaVida,
            imagen,
            criadoPara
        );
    }

    /**
     * Crea multiples instancias de Perro a partir de un array de datos de API
     * @param {Array} arrayDatos - Array de datos crudos de The Dog API
     * @returns {Perro[]} Array de instancias de Perro
     */
    static crearMultiples(arrayDatos) {
        if (!Array.isArray(arrayDatos)) {
            console.error('Se esperaba un array de datos');
            return [];
        }

        return arrayDatos
            .filter(datos => datos && datos.id) // Filtrar datos invalidos
            .map(datos => {
                try {
                    return this.crearDesdeAPI(datos);
                } catch (error) {
                    console.warn(`Error al crear perro con ID ${datos.id}:`, error.message);
                    return null;
                }
            })
            .filter(perro => perro !== null); // Filtrar los que fallaron
    }

    /**
     * Crea un Perro con datos personalizados (para pruebas o datos locales)
     * @param {Object} datos - Objeto con datos del perro
     * @returns {Perro} Nueva instancia de Perro
     */
    static crearPersonalizado(datos) {
        return new Perro(
            datos.id || Date.now(),
            datos.nombre || 'Sin nombre',
            datos.grupoRaza || 'Sin grupo',
            datos.temperamento || 'No especificado',
            datos.peso || 'N/A',
            datos.altura || 'N/A',
            datos.esperanzaVida || 'N/A',
            datos.imagen || this.PLACEHOLDER_IMAGE,
            datos.criadoPara || ''
        );
    }

    /**
     * Extrae todos los grupos de raza unicos de un array de perros
     * @param {Perro[]} perros - Array de instancias de Perro
     * @returns {string[]} Array de grupos de raza unicos ordenados
     */
    static extraerGruposUnicos(perros) {
        const grupos = new Set();
        
        perros.forEach(perro => {
            if (perro.grupoRaza && perro.grupoRaza !== 'Sin grupo') {
                grupos.add(perro.grupoRaza);
            }
        });

        return Array.from(grupos).sort();
    }

    /**
     * Extrae todos los temperamentos unicos de un array de perros
     * @param {Perro[]} perros - Array de instancias de Perro
     * @returns {string[]} Array de temperamentos unicos ordenados
     */
    static extraerTemperamentosUnicos(perros) {
        const temperamentos = new Set();
        
        perros.forEach(perro => {
            const temps = perro.getTemperamentoArray();
            temps.forEach(t => temperamentos.add(t));
        });

        return Array.from(temperamentos).sort();
    }

    /**
     * Filtra perros segun criterios especificos
     * @param {Perro[]} perros - Array de perros a filtrar
     * @param {Object} filtros - Objeto con criterios de filtrado
     * @returns {Perro[]} Array de perros filtrados
     */
    static filtrar(perros, filtros) {
        return perros.filter(perro => {
            // Filtrar por nombre
            if (filtros.nombre && !perro.coincideConNombre(filtros.nombre)) {
                return false;
            }

            // Filtrar por grupo de raza
            if (filtros.principal && !perro.perteneceAGrupo(filtros.principal)) {
                return false;
            }

            // Filtrar por temperamento
            if (filtros.temperamento && !perro.tieneTemperamento(filtros.temperamento)) {
                return false;
            }

            return true;
        });
    }

    /**
     * Ordena perros segun un criterio especifico
     * @param {Perro[]} perros - Array de perros a ordenar
     * @param {string} criterio - Criterio de ordenamiento (nombre, peso, altura)
     * @param {boolean} ascendente - True para orden ascendente
     * @returns {Perro[]} Array de perros ordenados
     */
    static ordenar(perros, criterio = 'nombre', ascendente = true) {
        const copia = [...perros];
        
        copia.sort((a, b) => {
            let valorA, valorB;
            
            switch (criterio) {
                case 'nombre':
                    valorA = a.nombre.toLowerCase();
                    valorB = b.nombre.toLowerCase();
                    break;
                case 'peso':
                    valorA = a.getPesoPromedio();
                    valorB = b.getPesoPromedio();
                    break;
                case 'altura':
                    valorA = a.getAlturaPromedio();
                    valorB = b.getAlturaPromedio();
                    break;
                default:
                    valorA = a.nombre.toLowerCase();
                    valorB = b.nombre.toLowerCase();
            }

            if (valorA < valorB) return ascendente ? -1 : 1;
            if (valorA > valorB) return ascendente ? 1 : -1;
            return 0;
        });

        return copia;
    }
}
