import { Mascota } from './Mascota.js';

/**
 * Clase Gato - Programacion Orientada a Objetos
 * Representa una raza de gato y sus atributos principales.
 */
export class Gato extends Mascota {
    constructor(id, nombre, temperamento, peso, esperanzaVida, imagen, childFriendly = 0) {
        super(id, 'gato', nombre, temperamento, peso, 'N/A', esperanzaVida, imagen);
        this.childFriendly = Number(childFriendly) || 0;
    }

    cumpleChildFriendly(minimo) {
        if (!minimo) return true;
        return this.childFriendly >= Number(minimo);
    }

    getNivelTemperamento() {
        // La API no ofrece una calificacion numerica de "temperament", asi que se estima
        // con base en cantidad de rasgos descritos en el texto.
        const totalRasgos = this.getTemperamentoArray().length;
        if (totalRasgos <= 0) return 0;
        return Math.min(5, Math.max(1, Math.round(totalRasgos / 2)));
    }

    crearRegistroAdopcion(nombreMascota, nombreAdoptante) {
        const base = super.crearRegistroAdopcion(nombreMascota, nombreAdoptante);
        return { ...base, childFriendly: this.childFriendly };
    }
}
