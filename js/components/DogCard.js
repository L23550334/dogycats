/**
 * DogCard - Componente para renderizar tarjetas de perros
 * Genera el HTML para mostrar la informacion de cada perro
 */

/**
 * Genera el HTML de una tarjeta de perro
 * @param {Perro} perro - Instancia de la clase Perro
 * @returns {string} HTML de la tarjeta
 */
export function crearDogCard(perro) {
    // Limitar temperamentos mostrados
    const temperamentos = perro.getTemperamentoArray().slice(0, 3);
    const temperamentoHTML = temperamentos.length > 0 
        ? temperamentos.join(', ') 
        : 'No especificado';
    
    // Determinar icono de tamano
    const tamano = perro.getCategoriaTamano();
    let tamanoIcon = 'bi-circle';
    if (tamano === 'Grande') tamanoIcon = 'bi-circle-fill';
    if (tamano === 'Mediano') tamanoIcon = 'bi-circle-half';

    return `
        <div class="col-md-6 col-lg-4">
            <article class="card dog-card shadow-sm h-100" data-perro-id="${perro.id}">
                <div class="card-img-wrapper">
                    <img 
                        src="${perro.imagen}" 
                        class="card-img-top" 
                        alt="Foto de ${perro.nombre}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'"
                    >
                </div>
                <div class="card-body">
                    <h5 class="card-title">${perro.nombre}</h5>
                    <p class="breed-group">
                        <i class="bi bi-tag-fill me-1"></i>${perro.grupoRaza}
                    </p>
                    <p class="temperament">
                        <i class="bi bi-emoji-smile me-1"></i>${temperamentoHTML}
                    </p>
                    <div class="dog-stats">
                        <span title="Peso">
                            <i class="bi bi-speedometer2"></i> ${perro.peso} kg
                        </span>
                        <span title="Altura">
                            <i class="bi bi-rulers"></i> ${perro.altura} cm
                        </span>
                        <span title="Esperanza de vida">
                            <i class="bi bi-heart-pulse"></i> ${perro.esperanzaVida}
                        </span>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3 px-3">
                    <button 
                        class="btn btn-adopt w-100" 
                        data-perro-id="${perro.id}"
                        data-action="adoptar"
                    >
                        <i class="bi bi-heart me-1"></i>Adoptar
                    </button>
                </div>
            </article>
        </div>
    `;
}

/**
 * Renderiza multiples tarjetas de perros
 * @param {Perro[]} perros - Array de instancias de Perro
 * @returns {string} HTML de todas las tarjetas
 */
export function renderizarGrid(perros) {
    if (!perros || perros.length === 0) {
        return '';
    }
    
    return perros.map(perro => crearDogCard(perro)).join('');
}

/**
 * Actualiza el contador de resultados
 * @param {number} cantidad - Numero de resultados
 * @returns {string} Texto formateado
 */
export function textoResultados(cantidad) {
    if (cantidad === 0) {
        return 'No se encontraron resultados';
    }
    if (cantidad === 1) {
        return 'Mostrando 1 resultado';
    }
    return `Mostrando ${cantidad} resultados`;
}

export const DogCard = {
    crearDogCard,
    renderizarGrid,
    textoResultados
};
