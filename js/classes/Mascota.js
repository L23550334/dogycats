/**
 * Clase base Mascota - Programacion Orientada a Objetos
 * Define propiedades y comportamientos comunes para perros y gatos.
 */
export class Mascota {
    constructor(id, especie, nombre, temperamento, peso, altura, esperanzaVida, imagen) {
        this.id = id;
        this.especie = especie;
        this.nombre = nombre;
        this.temperamento = temperamento || 'No especificado';
        this.peso = peso || 'N/A';
        this.altura = altura || 'N/A';
        this.esperanzaVida = esperanzaVida || 'N/A';
        this.imagen = imagen;
        this.fechaCreacion = new Date();
    }

    getTemperamentoArray() {
        if (!this.temperamento || this.temperamento === 'No especificado') {
            return [];
        }
        return this.temperamento.split(',').map(item => item.trim()).filter(Boolean);
    }

    coincideConNombre(busqueda) {
        return this.nombre.toLowerCase().includes((busqueda || '').toLowerCase());
    }

    tieneTemperamento(temperamento) {
        if (!temperamento) return true;
        return this.getTemperamentoArray().some(item =>
            item.toLowerCase().includes(temperamento.toLowerCase())
        );
    }

    getPesoPromedio() {
        if (!this.peso || this.peso === 'N/A') return 0;
        const numeros = this.peso.match(/\d+/g);
        if (!numeros || numeros.length === 0) return 0;
        const suma = numeros.reduce((acc, num) => acc + parseInt(num, 10), 0);
        return suma / numeros.length;
    }

    getAlturaPromedio() {
        if (!this.altura || this.altura === 'N/A') return 0;
        const numeros = this.altura.match(/\d+/g);
        if (!numeros || numeros.length === 0) return 0;
        const suma = numeros.reduce((acc, num) => acc + parseInt(num, 10), 0);
        return suma / numeros.length;
    }

    crearRegistroAdopcion(nombreMascota, nombreAdoptante) {
        return {
            id: `${this.especie}-${this.id}-${Date.now()}`,
            mascotaId: this.id,
            especie: this.especie,
            razaNombre: this.nombre,
            nombreMascota,
            nombreAdoptante,
            imagen: this.imagen,
            fechaAdopcion: new Date().toISOString()
        };
    }
}
