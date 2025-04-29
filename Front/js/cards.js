/**
 * Funcionalidad para las tarjetas desplegables
 */

// Inicializar tarjetas desplegables
function initCollapsibleCards() {
    document.querySelectorAll('.collapsible-card-header').forEach(header => {
        header.addEventListener('click', function(e) {
            // Ignorar clic si es en un botón dentro del header
            if (e.target.closest('.card-actions') || e.target.closest('button')) {
                return;
            }
            
            const card = this.closest('.collapsible-card');
            toggleCardCollapse(card);
        });
    });
}

// Abrir o cerrar una tarjeta
function toggleCardCollapse(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Si estamos abriendo esta tarjeta, cerramos las demás
    if (!isExpanded) {
        // Opcional: descomentar para que sólo una tarjeta pueda estar abierta a la vez
        // document.querySelectorAll('.collapsible-card.expanded').forEach(expandedCard => {
        //     if (expandedCard !== card) {
        //         expandedCard.classList.remove('expanded');
        //     }
        // });
    }
    
    // Alternar la clase expanded
    card.classList.toggle('expanded');
}

// Expandir una tarjeta específica por ID
function expandCardById(cardId) {
    const card = document.getElementById(cardId);
    if (card && !card.classList.contains('expanded')) {
        toggleCardCollapse(card);
    }
}

// Contraer una tarjeta específica por ID
function collapseCardById(cardId) {
    const card = document.getElementById(cardId);
    if (card && card.classList.contains('expanded')) {
        toggleCardCollapse(card);
    }
}

// Inicializar la funcionalidad de búsqueda para una tarjeta
function initCardSearch(searchInputId, tableId, columnIndex = 1) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    
    if (!searchInput || !table) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        // Expandir la tarjeta que contiene la tabla si hay texto en el input
        if (searchTerm) {
            const card = table.closest('.collapsible-card');
            if (card && !card.classList.contains('expanded')) {
                toggleCardCollapse(card);
            }
        }
        
        // Filtrar filas
        rows.forEach(row => {
            let found = false;
            // Si columnIndex es -1, buscamos en todas las columnas
            if (columnIndex === -1) {
                Array.from(row.cells).forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });
            } else {
                const cell = row.cells[columnIndex];
                if (cell && cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            }
            
            row.style.display = found ? '' : 'none';
        });
    });
}

// Crear tarjeta desplegable dinámicamente
function createCollapsibleCard(options) {
    const {
        id,
        title,
        icon,
        content,
        expanded = false,
        actions = []
    } = options;
    
    // Crear elementos
    const card = document.createElement('div');
    card.className = `collapsible-card ${expanded ? 'expanded' : ''}`;
    card.id = id;
    
    // Crear header
    const header = document.createElement('div');
    header.className = 'collapsible-card-header';
    
    // Crear título con icono
    const titleEl = document.createElement('h4');
    titleEl.innerHTML = `<i class="${icon}"></i>${title} <i class="fas fa-chevron-down ml-2"></i>`;
    
    // Crear contenedor de acciones
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'card-actions';
    
    // Agregar botones de acciones
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `action-button ${action.class || ''}`;
        btn.innerHTML = `<i class="${action.icon}"></i>${action.text}`;
        btn.addEventListener('click', action.handler);
        actionsContainer.appendChild(btn);
    });
    
    // Agregar elementos al header
    header.appendChild(titleEl);
    header.appendChild(actionsContainer);
    
    // Crear cuerpo de la tarjeta
    const cardBody = document.createElement('div');
    cardBody.className = 'collapsible-card-body';
    
    const cardContent = document.createElement('div');
    cardContent.className = 'collapsible-card-content';
    
    // Si content es un elemento DOM, lo agregamos, si no, lo establecemos como HTML
    if (content instanceof HTMLElement) {
        cardContent.appendChild(content);
    } else {
        cardContent.innerHTML = content;
    }
    
    cardBody.appendChild(cardContent);
    
    // Ensamblar la tarjeta
    card.appendChild(header);
    card.appendChild(cardBody);
    
    return card;
}

// Inicializar todas las tarjetas en la página
function initAllCards() {
    initCollapsibleCards();
    
    // Inicializar búsquedas (estos IDs deben coincidir con los que definas en tu HTML)
    const searchConfigs = [
        { searchId: 'clientes-search', tableId: 'clientes-table', columnIndex: 1 },
        { searchId: 'empleados-search', tableId: 'empleados-table', columnIndex: 1 },
        { searchId: 'pqrs-search', tableId: 'pqrs-table', columnIndex: 2 },
        { searchId: 'usuarios-search', tableId: 'usuarios-table', columnIndex: 1 },
        { searchId: 'roles-search', tableId: 'roles-table', columnIndex: 1 },
        { searchId: 'modulos-search', tableId: 'modulos-table', columnIndex: 1 },
        { searchId: 'formularios-search', tableId: 'formularios-table', columnIndex: 1 },
        { searchId: 'permisos-search', tableId: 'permisos-table', columnIndex: 0 }
    ];
    
    searchConfigs.forEach(config => {
        initCardSearch(config.searchId, config.tableId, config.columnIndex);
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initAllCards();
    
    // Expandir la primera tarjeta por defecto (opcional)
    const firstCard = document.querySelector('.collapsible-card');
    if (firstCard) {
        toggleCardCollapse(firstCard);
    }
});