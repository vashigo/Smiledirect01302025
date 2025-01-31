async function fetchData() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}

// Renderizar accesorios
function renderAccesories(accesories) {
  const container = document.getElementById('accesories-cards');
  accesories.forEach(acc => {
    // Usamos col de Bootstrap para el grid
    const col = document.createElement('div');
    // Para mobile, ocupa 12 columnas; en tablets (md) 6, en desktop (lg) 3
    col.className = 'col-12 col-md-6 col-lg-3';

    // Tarjeta personalizada
    const card = document.createElement('div');
    card.className = 'custom-card';

    const title = document.createElement('h3');
    title.textContent = acc.name;

    const desc = document.createElement('p');
    desc.textContent = acc.description;

    card.appendChild(title);
    card.appendChild(desc);
    col.appendChild(card);
    container.appendChild(col);
  });
}

// Renderizar juegos (cada consola en un accordion-item)
function renderGamesByConsole(gamesObj) {
  const container = document.getElementById('consolesAccordion');
  let index = 0; // Para IDs únicos

  for (const consoleName in gamesObj) {
    index++;
    const itemId = `consoleItem_${index}`;
    const headingId = `consoleHeading_${index}`;
    const collapseId = `consoleCollapse_${index}`;

    // Accordion item para esta consola
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    // Encabezado (accordion-header + button)
    const header = document.createElement('h2');
    header.className = 'accordion-header';
    header.id = headingId;

    const btn = document.createElement('button');
    btn.className = 'accordion-button collapsed';
    btn.type = 'button';
    btn.setAttribute('data-bs-toggle', 'collapse');
    btn.setAttribute('data-bs-target', `#${collapseId}`);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', collapseId);
    btn.textContent = consoleName;

    header.appendChild(btn);

    // Contenido (accordion-collapse + body)
    const collapseDiv = document.createElement('div');
    collapseDiv.id = collapseId;
    collapseDiv.className = 'accordion-collapse collapse';
    collapseDiv.setAttribute('aria-labelledby', headingId);
    collapseDiv.setAttribute('data-bs-parent', '#consolesAccordion');

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'accordion-body';

    // Convertimos cada juego en una “pill”
    const games = gamesObj[consoleName];
    games.forEach(game => {
      const pill = document.createElement('div');
      pill.className = 'game-item';

      pill.innerHTML = `
        <strong>${game.title}</strong>
        <span class="region">- ${game.region}</span>
      `;
      bodyDiv.appendChild(pill);
    });

    // Estructura final
    collapseDiv.appendChild(bodyDiv);
    accordionItem.appendChild(header);
    accordionItem.appendChild(collapseDiv);

    container.appendChild(accordionItem);
  }
}

async function init() {
  try {
    const data = await fetchData();
    // Render categorías
    renderAccesories(data.accesories);
    // Render juegos con accordion anidado
    renderGamesByConsole(data.games);
  } catch (error) {
    console.error('Error al cargar data.json:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
