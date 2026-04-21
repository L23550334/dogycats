import { Gato } from './Gato.js';

/**
 * GatoFactory - Patron Factory
 * Fabrica para crear instancias de Gato desde datos de The Cat API.
 */
export class GatoFactory {
    static PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=Sin+Imagen';

    static crearDesdeAPI(datosAPI) {
        if (!datosAPI) {
            throw new Error('No se proporcionaron datos para crear el Gato');
        }

        const id = datosAPI.id;
        const nombre = datosAPI.name || 'Raza desconocida';
        const temperamento = datosAPI.temperament || 'No especificado';
        const peso = datosAPI.weight?.metric || 'N/A';
        const esperanzaVida = datosAPI.life_span || 'N/A';
        const childFriendly = datosAPI.child_friendly || 0;

        let imagen = this.PLACEHOLDER_IMAGE;
        if (datosAPI.image?.url) {
            imagen = datosAPI.image.url;
        } else if (datosAPI.reference_image_id) {
            imagen = `https://cdn2.thecatapi.com/images/${datosAPI.reference_image_id}.jpg`;
        }

        return new Gato(
            id,
            nombre,
            temperamento,
            peso,
            esperanzaVida,
            imagen,
            childFriendly
        );
    }

    static crearMultiples(arrayDatos) {
        if (!Array.isArray(arrayDatos)) return [];
        return arrayDatos
            .filter(datos => datos && datos.id)
            .map(datos => {
                try {
                    return this.crearDesdeAPI(datos);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
    }

    static extraerTemperamentosUnicos(gatos) {
        const temperamentos = new Set();
        gatos.forEach(gato => {
            gato.getTemperamentoArray().forEach(item => temperamentos.add(item));
        });
        return Array.from(temperamentos).sort();
    }

    static filtrar(gatos, filtros) {
        return gatos.filter(gato => {
            if (filtros.nombre && !gato.coincideConNombre(filtros.nombre)) return false;
            if (filtros.temperamento && !gato.tieneTemperamento(filtros.temperamento)) return false;
            if (filtros.childFriendly && !gato.cumpleChildFriendly(filtros.childFriendly)) return false;
            return true;
        });
    }

    static ordenar(gatos, ascendente = true) {
        const copia = [...gatos];
        copia.sort((a, b) => {
            const valorA = a.nombre.toLowerCase();
            const valorB = b.nombre.toLowerCase();
            if (valorA < valorB) return ascendente ? -1 : 1;
            if (valorA > valorB) return ascendente ? 1 : -1;
            return 0;
        });
        return copia;
    }
}
