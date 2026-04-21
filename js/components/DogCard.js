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
    const mascota = perro;
    const temperamentos = mascota.getTemperamentoArray().slice(0, 3);
    const temperamentoHTML = temperamentos.length > 0 
        ? temperamentos.join(', ') 
        : 'No especificado';

    const esPerro = mascota.especie === 'perro';
    const detallePrincipal = esPerro
        ? `<p class="breed-group"><i class="bi bi-tag-fill me-1"></i>${mascota.grupoRaza}</p>`
        : `<p class="breed-group"><i class="bi bi-stars me-1"></i>Child Friendly: ${mascota.childFriendly || 0}/5</p>`;

    const statsHtml = esPerro
        ? `
            <span title="Peso">
                <i class="bi bi-speedometer2"></i> ${mascota.peso} kg
            </span>
            <span title="Altura">
                <i class="bi bi-rulers"></i> ${mascota.altura} cm
            </span>
            <span title="Esperanza de vida">
                <i class="bi bi-heart-pulse"></i> ${mascota.esperanzaVida}
            </span>
        `
        : `
            <span title="Peso">
                <i class="bi bi-speedometer2"></i> ${mascota.peso} kg
            </span>
            <span title="Esperanza de vida">
                <i class="bi bi-heart-pulse"></i> ${mascota.esperanzaVida}
            </span>
        `;

    const estrellasTemperamento = renderStars(esPerro ? 0 : mascota.getNivelTemperamento());
    const estrellasNinos = renderStars(esPerro ? 0 : mascota.childFriendly);
    const bloqueEstrellas = esPerro
        ? ''
        : `
            <div class="cat-ratings mt-2">
                <small class="d-block"><strong>Temperamento:</strong> ${estrellasTemperamento}</small>
                <small class="d-block"><strong>Child Friendly:</strong> ${estrellasNinos}</small>
            </div>
        `;

    return `
        <div class="col-md-6 col-lg-4">
            <article class="card dog-card shadow-sm h-100" data-mascota-id="${mascota.id}">
                <div class="card-img-wrapper">
                    <img 
                        src="${mascota.imagen}" 
                        class="card-img-top" 
                        alt="Foto de ${mascota.nombre}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'"
                    >
                </div>
                <div class="card-body">
                    <h5 class="card-title">${mascota.nombre}</h5>
                    ${detallePrincipal}
                    <p class="temperament">
                        <i class="bi bi-emoji-smile me-1"></i>${temperamentoHTML}
                    </p>
                    ${bloqueEstrellas}
                    <div class="dog-stats">
                        ${statsHtml}
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3 px-3">
                    <button 
                        class="btn btn-adopt w-100" 
                        data-mascota-id="${mascota.id}"
                        data-action="adoptar"
                    >
                        <i class="bi bi-heart me-1"></i>Adoptar
                    </button>
                </div>
            </article>
        </div>
    `;
}

function renderStars(value) {
    const estrellas = Number(value) || 0;
    const llenas = Math.max(0, Math.min(5, estrellas));
    return `${'★'.repeat(llenas)}${'☆'.repeat(5 - llenas)}`;
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
