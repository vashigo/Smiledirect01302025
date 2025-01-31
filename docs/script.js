// Variable para mantener los items en memoria
let personalListItems = [];
let addToastInstance; // variable global para controlar el toast

// Función para guardar en Local Storage
function saveListToLocalStorage() {
  localStorage.setItem('personalList', JSON.stringify(personalListItems));
}

// Cargar la lista desde Local Storage
function loadListFromLocalStorage() {
  const storedList = localStorage.getItem('personalList');
  if (storedList) {
    personalListItems = JSON.parse(storedList);
  } else {
    personalListItems = [];
  }
}

// Función para renderizar la lista en el DOM
function renderPersonalList() {
  const personalList = document.getElementById('personal-list');
  personalList.innerHTML = ''; // Limpia la lista actual

  personalListItems.forEach((itemObj, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${itemObj.name} (${itemObj.type})`;
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.addEventListener('click', () => {
      // Eliminar el item del array
      personalListItems.splice(index, 1);
      // Guardar cambios en Local Storage
      saveListToLocalStorage();
      // Volver a renderizar
      renderPersonalList();
    });

    listItem.appendChild(removeButton);
    personalList.appendChild(listItem);
  });
}

// Función para agregar elementos a la lista personal
function addToPersonalList(itemName, type) {
  // Agregar al array en memoria
  personalListItems.push({ name: itemName, type: type });
  // Guardar en Local Storage
  saveListToLocalStorage();
  // Renderizar lista actualizada
  renderPersonalList();

  // Mostrar el Toast
  if (addToastInstance) {
    addToastInstance.show();
  }

}

// fetchData y funciones de render para accesorios y juegos siguen igual
async function fetchData() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}

function renderAccesories(accesories) {
  const container = document.getElementById('accesories-cards');
  accesories.forEach(acc => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-3';

    const card = document.createElement('div');
    card.className = 'custom-card';

    const title = document.createElement('h3');
    title.textContent = acc.name;

    const desc = document.createElement('p');
    desc.textContent = acc.description;

    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar a lista';
    addButton.className = 'btn btn-primary btn-sm mt-2';
    addButton.addEventListener('click', () => addToPersonalList(acc.name, 'accesorio'));

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(addButton);
    col.appendChild(card);
    container.appendChild(col);
  });
}

function renderGamesByConsole(gamesObj) {
  const container = document.getElementById('consolesAccordion');
  let index = 0;

  for (const consoleName in gamesObj) {
    index++;
    const itemId = `consoleItem_${index}`;
    const headingId = `consoleHeading_${index}`;
    const collapseId = `consoleCollapse_${index}`;

    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

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

    const collapseDiv = document.createElement('div');
    collapseDiv.id = collapseId;
    collapseDiv.className = 'accordion-collapse collapse';
    collapseDiv.setAttribute('aria-labelledby', headingId);
    collapseDiv.setAttribute('data-bs-parent', '#consolesAccordion');

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'accordion-body';

    const games = gamesObj[consoleName];
    games.forEach(game => {
      const pill = document.createElement('div');
      pill.className = 'game-item';

      const addButton = document.createElement('button');
      addButton.textContent = 'Agregar a lista';
      addButton.className = 'btn btn-primary btn-sm mt-2';
      addButton.addEventListener('click', () => addToPersonalList(game.title, 'juego'));

      pill.innerHTML = `
        <strong>${game.title}</strong>
        <span class="region">- ${game.region}</span>
      `;
      pill.appendChild(addButton);
      bodyDiv.appendChild(pill);
    });

    collapseDiv.appendChild(bodyDiv);
    accordionItem.appendChild(header);
    accordionItem.appendChild(collapseDiv);

    container.appendChild(accordionItem);
  }
}

async function init() {
  try {
    loadListFromLocalStorage();
    renderPersonalList();

    const data = await fetchData();
    renderAccesories(data.accesories);
    renderGamesByConsole(data.games);

    // Botón flotante para abrir el modal
    const floatingButton = document.getElementById('floating-button');
    floatingButton.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('personalListModal'));
      modal.show();
    });

    // Inicializar el Toast (puedes configurar un delay si quieres que se cierre solo)
    const toastEl = document.getElementById('addToast');
    addToastInstance = new bootstrap.Toast(toastEl, { delay: 1500 });
    // "delay" = 1500 ms => se cerrará automáticamente después de 1.5s

  } catch (error) {
    console.error('Error al cargar data.json:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
