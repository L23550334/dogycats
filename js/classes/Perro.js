import { Mascota } from './Mascota.js';

/**
 * Clase Perro - Programacion Orientada a Objetos
 * Representa una raza de perro con todas sus caracteristicas
 */
export class Perro extends Mascota {
    /**
     * Constructor de la clase Perro
     * @param {number} id - ID unico de la raza
     * @param {string} nombre - Nombre de la raza
     * @param {string} grupoRaza - Grupo al que pertenece (Herding, Working, etc.)
     * @param {string} temperamento - Temperamentos del perro
     * @param {string} peso - Peso en kg
     * @param {string} altura - Altura en cm
     * @param {string} esperanzaVida - Esperanza de vida
     * @param {string} imagen - URL de la imagen
     * @param {string} criado_para - Proposito original de la raza
     */
    constructor(id, nombre, grupoRaza, temperamento, peso, altura, esperanzaVida, imagen, criadoPara = '') {
        super(id, 'perro', nombre, temperamento, peso, altura, esperanzaVida, imagen);
        this.grupoRaza = grupoRaza;
        this.criadoPara = criadoPara;
    }

    /**
     * Obtiene informacion resumida del perro
     * @returns {string} Informacion basica del perro
     */
    getInfo() {
        return `${this.nombre} - ${this.grupoRaza || 'Sin grupo especificado'}`;
    }

    /**
     * Convierte el temperamento en un array
     * @returns {string[]} Array de temperamentos
     */
    getTemperamentoArray() {
        return super.getTemperamentoArray();
    }

    /**
     * Determina si el perro es de tamano grande basado en el peso
     * @returns {boolean} True si es grande (mas de 25kg)
     */
    esGrande() {
        const pesoNumerico = this.getPesoPromedio();
        return pesoNumerico > 25;
    }

    /**
     * Determina si el perro es de tamano mediano
     * @returns {boolean} True si es mediano (entre 10kg y 25kg)
     */
    esMediano() {
        const pesoNumerico = this.getPesoPromedio();
        return pesoNumerico >= 10 && pesoNumerico <= 25;
    }

    /**
     * Determina si el perro es de tamano pequeno
     * @returns {boolean} True si es pequeno (menos de 10kg)
     */
    esPequeno() {
        const pesoNumerico = this.getPesoPromedio();
        return pesoNumerico < 10;
    }

    /**
     * Obtiene el peso promedio del perro
     * @returns {number} Peso promedio en kg
     */
    getPesoPromedio() {
        return super.getPesoPromedio();
    }

    /**
     * Obtiene la altura promedio del perro
     * @returns {number} Altura promedio en cm
     */
    getAlturaPromedio() {
        return super.getAlturaPromedio();
    }

    /**
     * Obtiene la categoria de tamano del perro
     * @returns {string} Categoria (Pequeno, Mediano, Grande)
     */
    getCategoriaTamano() {
        if (this.esPequeno()) return 'Pequeno';
        if (this.esMediano()) return 'Mediano';
        if (this.esGrande()) return 'Grande';
        return 'Desconocido';
    }

    /**
     * Verifica si el perro tiene un temperamento especifico
     * @param {string} temperamento - Temperamento a buscar
     * @returns {boolean} True si tiene ese temperamento
     */
    tieneTemperamento(temperamento) {
        return super.tieneTemperamento(temperamento);
    }

    /**
     * Verifica si el nombre de la raza coincide con la busqueda
     * @param {string} busqueda - Texto a buscar
     * @returns {boolean} True si coincide
     */
    coincideConNombre(busqueda) {
        return super.coincideConNombre(busqueda);
    }

    /**
     * Verifica si pertenece a un grupo de raza especifico
     * @param {string} grupo - Grupo de raza a verificar
     * @returns {boolean} True si pertenece al grupo
     */
    perteneceAGrupo(grupo) {
        if (!grupo) return true;
        return this.grupoRaza.toLowerCase() === grupo.toLowerCase();
    }

    /**
     * Genera un objeto con los datos para guardar en localStorage
     * @param {string} nombreMascota - Nombre dado por el adoptante
     * @param {string} nombreAdoptante - Nombre del adoptante
     * @returns {Object} Objeto con datos de adopcion
     */
    crearRegistroAdopcion(nombreMascota, nombreAdoptante) {
        const base = super.crearRegistroAdopcion(nombreMascota, nombreAdoptante);
        return { ...base, grupoRaza: this.grupoRaza };
    }

    /**
     * Convierte el objeto Perro a formato JSON
     * @returns {Object} Objeto plano con los datos del perro
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            grupoRaza: this.grupoRaza,
            temperamento: this.temperamento,
            peso: this.peso,
            altura: this.altura,
            esperanzaVida: this.esperanzaVida,
            imagen: this.imagen,
            criadoPara: this.criadoPara,
            fechaCreacion: this.fechaCreacion.toISOString()
        };
    }

    /**
     * Metodo estatico para crear un Perro desde un objeto JSON
     * @param {Object} json - Objeto con datos del perro
     * @returns {Perro} Nueva instancia de Perro
     */
    static fromJSON(json) {
        const perro = new Perro(
            json.id,
            json.nombre,
            json.grupoRaza,
            json.temperamento,
            json.peso,
            json.altura,
            json.esperanzaVida,
            json.imagen,
            json.criadoPara
        );
        if (json.fechaCreacion) {
            perro.fechaCreacion = new Date(json.fechaCreacion);
        }
        return perro;
    }
}
