// API Base URL
const API_BASE_URL = 'http://localhost:5163/api';

// API Endpoints
const API_ENDPOINTS = {
    // Clients
    CLIENTS: `${API_BASE_URL}/Client`,
    CLIENT_BY_ID: (id) => `${API_BASE_URL}/Client/${id}`,
    CLIENT_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Client/permanent/${id}`,
    
    // PQRs
    PQRS: `${API_BASE_URL}/Pqr`,
    PQR_BY_ID: (id) => `${API_BASE_URL}/Pqr/${id}`,
    PQR_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Pqr/permanent/${id}`,
    
    // Workers
    WORKERS: `${API_BASE_URL}/Worker`,
    WORKER_BY_ID: (id) => `${API_BASE_URL}/Worker/${id}`,
    WORKER_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Worker/permanent/${id}`,
    
    // Worker Logins
    WORKER_LOGINS: `${API_BASE_URL}/WorkerLogin`,
    WORKER_LOGIN_BY_ID: (id) => `${API_BASE_URL}/WorkerLogin/${id}`,
    WORKER_LOGIN_PERMANENT_DELETE: (id) => `${API_BASE_URL}/WorkerLogin/permanent/${id}`,
    
    // Users
    USERS: `${API_BASE_URL}/User`,
    USER_BY_ID: (id) => `${API_BASE_URL}/User/${id}`,
    USER_PERMANENT_DELETE: (id) => `${API_BASE_URL}/User/permanent/${id}`,
    
    // Roles
    ROLES: `${API_BASE_URL}/Rol`,
    ROLE_BY_ID: (id) => `${API_BASE_URL}/Rol/${id}`,
    ROLE_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Rol/permanent/${id}`,
    
    // Role User Assignments
    ROL_USERS: `${API_BASE_URL}/RolUser`,
    ROL_USER_BY_ID: (id) => `${API_BASE_URL}/RolUser/${id}`,
    ROL_USER_PERMANENT_DELETE: (id) => `${API_BASE_URL}/RolUser/permanent/${id}`,
    
    // Modules
    MODULES: `${API_BASE_URL}/Module`,
    MODULE_BY_ID: (id) => `${API_BASE_URL}/Module/${id}`,
    MODULE_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Module/permanent/${id}`,
    
    // Forms
    FORMS: `${API_BASE_URL}/Form`,
    FORM_BY_ID: (id) => `${API_BASE_URL}/Form/${id}`,
    FORM_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Form/permanent/${id}`,
    
    // Form Modules
    FORM_MODULES: `${API_BASE_URL}/FormModule`,
    FORM_MODULE_BY_ID: (id) => `${API_BASE_URL}/FormModule/${id}`,
    FORM_MODULE_PERMANENT_DELETE: (id) => `${API_BASE_URL}/FormModule/permanent/${id}`,
    
    // Permissions
    PERMISSIONS: `${API_BASE_URL}/Permission`,
    PERMISSION_BY_ID: (id) => `${API_BASE_URL}/Permission/${id}`,
    PERMISSION_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Permission/permanent/${id}`,
    
    // Role Form Permissions
    ROL_FORM_PERMISSIONS: `${API_BASE_URL}/RolFormPermission`,
    ROL_FORM_PERMISSION_BY_ID: (id) => `${API_BASE_URL}/RolFormPermission/${id}`,
    ROL_FORM_PERMISSIONS_BY_ROL_ID: (rolId) => `${API_BASE_URL}/RolFormPermission/rol/${rolId}`,
    ROL_FORM_PERMISSION_PERMANENT_DELETE: (id) => `${API_BASE_URL}/RolFormPermission/permanent/${id}`,
    
    // Logins
    LOGINS: `${API_BASE_URL}/Login`,
    LOGIN_BY_ID: (id) => `${API_BASE_URL}/Login/${id}`,
    LOGIN_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Login/permanent/${id}`
};

// Default Pagination Settings
const DEFAULT_PAGE_SIZE = 10;

// HTTP Request Headers
const HTTP_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Local Storage Keys
const STORAGE_KEYS = {
    AUTH_TOKEN: 'securitypqr_auth_token',
    USER_INFO: 'securitypqr_user_info',
    REMEMBER_ME: 'securitypqr_remember_me'
};

// Toast Notification Settings
const TOAST_SETTINGS = {
    DELAY: 5000, // 5 seconds
    AUTOHIDE: true
};

// PQR Status Options
const PQR_STATUSES = {
    PENDING: 'Pendiente',
    IN_PROCESS: 'En Proceso',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado'
};

// PQR Types
const PQR_TYPES = {
    PETITION: 'Petición',
    COMPLAINT: 'Queja',
    CLAIM: 'Reclamo',
    SUGGESTION: 'Sugerencia'
};

// Client Types
const CLIENT_TYPES = {
    INDIVIDUAL: 'Particular',
    BUSINESS: 'Empresarial',
    VIP: 'VIP'
};

// Socioeconomic Stratification Options
const SOCIOECONOMIC_STRATA = [1, 2, 3, 4, 5, 6];

/*** Utility Functions ***/

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastEl = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    // Set toast content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set toast type/color
    const toast = new bootstrap.Toast(toastEl, {
        delay: TOAST_SETTINGS.DELAY,
        autohide: TOAST_SETTINGS.AUTOHIDE
    });
    
    // Remove existing color classes
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    
    // Add appropriate color class based on type
    switch (type) {
        case 'success':
            toastEl.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toastEl.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toastEl.classList.add('bg-warning');
            break;
        default:
            toastEl.classList.add('bg-info', 'text-white');
    }
    
    // Show the toast
    toast.show();
}

// Display error message
function showError(message) {
    showToast('Error', message, 'error');
}

// Show loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('d-none');
    loadingOverlay.classList.add('d-flex');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('d-flex');
    loadingOverlay.classList.add('d-none');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Format date-time for input fields (YYYY-MM-DDThh:mm)
function formatDateTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

// Create pagination controls
function createPagination(totalItems, currentPage, pageSize, elementId, onPageChange) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginationElement = document.getElementById(elementId);
    
    // Clear current pagination
    paginationElement.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Create pagination element
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    
    // Add Previous button
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    if (currentPage === 1) {
        prevLi.classList.add('disabled');
    }
    const prevLink = document.createElement('a');
    prevLink.classList.add('page-link');
    prevLink.href = '#';
    prevLink.setAttribute('aria-label', 'Previous');
    prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
    
    // Determine page range to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        if (i === currentPage) {
            pageLi.classList.add('active');
        }
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        pageLi.appendChild(pageLink);
        ul.appendChild(pageLi);
    }
    
    // Add Next button
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    if (currentPage === totalPages) {
        nextLi.classList.add('disabled');
    }
    const nextLink = document.createElement('a');
    nextLink.classList.add('page-link');
    nextLink.href = '#';
    nextLink.setAttribute('aria-label', 'Next');
    nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
    
    nav.appendChild(ul);
    paginationElement.appendChild(nav);
}

// Handle API Error
function handleApiError(error) {
    hideLoading();
    console.error('API Error:', error);
    
    if (error.response) {
        // Server responded with an error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data && error.response.data.message 
            ? error.response.data.message 
            : 'Error en la solicitud al servidor';
            
        switch (statusCode) {
            case 400:
                showToast('Error de Validación', errorMessage, 'error');
                break;
            case 401:
                showToast('No Autorizado', 'Sesión expirada o credenciales inválidas', 'error');
                // Redirect to login page after token expiration
                setTimeout(() => {
                    logout();
                }, 2000);
                break;
            case 403:
                showToast('Acceso Denegado', 'No tiene permisos para realizar esta acción', 'error');
                break;
            case 404:
                showToast('No Encontrado', errorMessage, 'error');
                break;
            case 500:
                showToast('Error del Servidor', errorMessage, 'error');
                break;
            default:
                showToast('Error', errorMessage, 'error');
        }
    } else if (error.request) {
        // No response received
        showToast('Error de Conexión', 'No se pudo conectar con el servidor', 'error');
    } else {
        // Setup or other error
        showToast('Error', error.message || 'Ocurrió un error inesperado', 'error');
    }
}

// Create status badge
function createStatusBadge(status) {
    const badge = document.createElement('span');
    badge.classList.add('badge', 'rounded-pill');
    
    switch (status) {
        case PQR_STATUSES.PENDING:
            badge.classList.add('bg-warning', 'text-dark');
            break;
        case PQR_STATUSES.IN_PROCESS:
            badge.classList.add('bg-primary');
            break;
        case PQR_STATUSES.RESOLVED:
            badge.classList.add('bg-success');
            break;
        case PQR_STATUSES.CLOSED:
            badge.classList.add('bg-secondary');
            break;
        case true:
        case 'Activo':
            badge.classList.add('bg-success');
            status = 'Activo';
            break;
        case false:
        case 'Inactivo':
            badge.classList.add('bg-danger');
            status = 'Inactivo';
            break;
        default:
            badge.classList.add('bg-info');
    }
    
    badge.textContent = status;
    return badge;
}

// Create action buttons for tables
function createActionButtons(actions) {
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-action-group');
    
    if (actions.view) {
        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.classList.add('btn', 'btn-info', 'btn-sm');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'Ver detalle';
        viewBtn.addEventListener('click', actions.view);
        btnGroup.appendChild(viewBtn);
    }
    
    if (actions.edit) {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar';
        editBtn.addEventListener('click', actions.edit);
        btnGroup.appendChild(editBtn);
    }
    
    if (actions.delete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.addEventListener('click', actions.delete);
        btnGroup.appendChild(deleteBtn);
    }
    
    if (actions.custom) {
        actions.custom.forEach(customAction => {
            const customBtn = document.createElement('button');
            customBtn.type = 'button';
            customBtn.classList.add('btn', `btn-${customAction.color || 'secondary'}`, 'btn-sm');
            customBtn.innerHTML = customAction.icon || '';
            customBtn.title = customAction.title || '';
            customBtn.addEventListener('click', customAction.handler);
            btnGroup.appendChild(customBtn);
        });
    }
    
    return btnGroup;
}

// Make API request with authorization
async function apiRequest(url, method = 'GET', data = null) {
    // Get auth token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Set up headers with auth token if available
    const headers = { ...HTTP_HEADERS };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });
        
        // Handle non-successful responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                response: {
                    status: response.status,
                    data: errorData
                }
            };
        }
        
        // Parse and return JSON response if content exists
        if (response.status !== 204) { // 204 No Content
            return await response.json();
        }
        
        return true; // Success without content
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Reset a form
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Auth functions
function isLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    window.location.href = 'login.html';
}

// Generate random password
function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Toggle password visibility
function setupPasswordToggle(passwordInputId, toggleBtnId) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleBtn = document.getElementById(toggleBtnId);
    
    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
}

// Filter table rows based on search input
function setupTableSearch(searchInputId, tableId, columnIndex) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    
    if (searchInput && table) {
        searchInput.addEventListener('keyup', () => {
            const searchText = searchInput.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cell = row.cells[columnIndex];
                if (cell) {
                    const text = cell.textContent.toLowerCase();
                    row.style.display = text.includes(searchText) ? '' : 'none';
                }
            });
        });
    }
}

// Check if user is authenticated (for page protection)
function checkAuth() {
    if (!isLoggedIn() && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize logout button
function initLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }
}

// Get URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        const key = decodeURIComponent(pair[0]);
        const value = pair.length > 1 ? decodeURIComponent(pair[1]) : null;
        params[key] = value;
    }
    
    return params;
}

// Document ready function
function onDocumentReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}


// Add to STORAGE_KEYS object at the top
STORAGE_KEYS.DARK_MODE = 'securitypqr_dark_mode';

// Dark mode functions
function isDarkMode() {
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
}

function toggleDarkMode() {
    const isDark = !isDarkMode();
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark);
    applyDarkMode(isDark);
    updateDarkModeToggle(isDark);
}

function applyDarkMode(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function updateDarkModeToggle(isDark) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        if (isDark) {
            toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            toggleBtn.setAttribute('title', 'Cambiar a modo claro');
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            toggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
        }
    }
}

function initDarkMode() {
    // Apply dark mode if saved
    const isDark = isDarkMode();
    applyDarkMode(isDark);
    
    // Setup toggle button
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
        updateDarkModeToggle(isDark);
    }
}

// Modify the existing onDocumentReady function to initialize dark mode
function onDocumentReady(callback) {
    if (document.readyState !== 'loading') {
        initDarkMode(); // Initialize dark mode
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            initDarkMode(); // Initialize dark mode
            callback();
        });
    }
    // Table Layout Utility Functions

/**
 * Create a searchable table with lateral scrolling
 * @param {string} tableId - ID of the table element
 * @param {string} searchInputId - ID of the search input element
 * @param {number} [searchColumnIndex] - Column index to search (optional)
 */
function createSearchableTable(tableId, searchInputId, searchColumnIndex = 0) {
    const table = document.getElementById(tableId);
    const searchInput = document.getElementById(searchInputId);

    if (!table || !searchInput) {
        console.error('Table or search input not found');
        return;
    }

    // Wrap table in a scrollable container
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('data-table-container');
    table.parentNode.insertBefore(tableWrapper, table);
    tableWrapper.appendChild(table);

    // Add search functionality
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cell = row.cells[searchColumnIndex];
            const cellText = cell ? cell.textContent.toLowerCase() : '';
            row.style.display = cellText.includes(searchTerm) ? '' : 'none';
        });
    });
}

/**
 * Create action buttons for table rows
 * @param {Object} actions - Object containing action configurations
 * @returns {HTMLDivElement} - Container with action buttons
 */
function createActionButtons(actions) {
    const container = document.createElement('div');
    container.classList.add('action-buttons');

    if (actions.view) {
        const viewBtn = document.createElement('button');
        viewBtn.classList.add('action-btn', 'action-btn-view');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>View';
        viewBtn.addEventListener('click', actions.view);
        container.appendChild(viewBtn);
    }

    if (actions.edit) {
        const editBtn = document.createElement('button');
        editBtn.classList.add('action-btn', 'action-btn-edit');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>Edit';
        editBtn.addEventListener('click', actions.edit);
        container.appendChild(editBtn);
    }

    if (actions.delete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('action-btn', 'action-btn-delete');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>Delete';
        deleteBtn.addEventListener('click', actions.delete);
        container.appendChild(deleteBtn);
    }

    return container;
}

/**
 * Wrap table in a card-like container with header and search
 * @param {string} tableId - ID of the table element
 * @param {Object} options - Configuration options
 */
function wrapTableInCard(tableId, options = {}) {
    const table = document.getElementById(tableId);
    
    if (!table) {
        console.error('Table not found');
        return;
    }

    // Create card container
    const card = document.createElement('div');
    card.classList.add('data-table-card');

    // Create header
    const header = document.createElement('div');
    header.classList.add('data-table-header');

    // Title
    const title = document.createElement('h4');
    title.textContent = options.title || 'Data Table';
    header.appendChild(title);

    // Search input
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('data-table-search');
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = options.searchPlaceholder || 'Search...';
    searchInput.id = `${tableId}-search`;
    searchContainer.appendChild(searchInput);

    header.appendChild(searchContainer);

    // Assemble card
    card.appendChild(header);
    card.appendChild(table.closest('.data-table-container') || table);

    // Replace table with card in DOM
    table.parentNode.insertBefore(card, table);

    // Setup search functionality
    createSearchableTable(tableId, searchInput.id, options.searchColumnIndex);
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createSearchableTable,
        createActionButtons,
        wrapTableInCard
    };
}
}