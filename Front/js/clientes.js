/**
 * SecurityPQR System - Clientes Page JavaScript
 */

// Variables globales
let clientsData = [];
let currentClientPage = 1;

async function getAllClients() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.CLIENTS);
        clientsData = data;
        renderClientsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching clients:', error);
        hideLoading();
        showToast('Error', 'No se pudieron cargar los clientes', 'error');
    }
}

// Render clients table
function renderClientsTable(clients, page = 1) {
    const tableBody = document.getElementById('clients-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, clients.length);
    const paginatedClients = clients.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (clients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay clientes registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedClients.forEach(client => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${client.clientId}</td>
            <td>${client.firstName} ${client.lastName}</td>
            <td>${client.identityDocument}</td>
            <td>${client.clientType}</td>
            <td>${client.email}</td>
            <td>${client.phone || 'N/A'}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            view: () => viewClientDetails(client.clientId),
            edit: () => editClient(client.clientId),
            delete: () => confirmDeleteClient(client.clientId, `${client.firstName} ${client.lastName}`)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        clients.length,
        page,
        pageSize,
        'clients-pagination',
        (newPage) => {
            currentClientPage = newPage;
            renderClientsTable(clients, newPage);
        }
    );
}

// View client details
async function viewClientDetails(clientId) {
    try {
        showLoading();
        const client = await apiRequest(API_ENDPOINTS.CLIENT_BY_ID(clientId));
        
        // Populate modal with client data (read-only)
        document.getElementById('clientModalTitle').textContent = 'Detalles del Cliente';
        document.getElementById('client-id').value = client.clientId;
        document.getElementById('client-firstName').value = client.firstName;
        document.getElementById('client-lastName').value = client.lastName;
        document.getElementById('client-document').value = client.identityDocument;
        document.getElementById('client-type').value = client.clientType;
        document.getElementById('client-email').value = client.email;
        document.getElementById('client-phone').value =client.phone || '';
        document.getElementById('client-address').value = client.address;
        document.getElementById('client-stratification').value = client.socioeconomicStratification || '';
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('saveClientBtn').style.display = 'none';
        
        // Show modal
        const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
        clientModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching client details:', error);
        hideLoading();
    }
}

// Edit client
async function editClient(clientId) {
    try {
        showLoading();
        const client = await apiRequest(API_ENDPOINTS.CLIENT_BY_ID(clientId));
        
        // Populate modal with client data
        document.getElementById('clientModalTitle').textContent = 'Editar Cliente';
        document.getElementById('client-id').value = client.clientId;
        document.getElementById('client-firstName').value = client.firstName;
        document.getElementById('client-lastName').value = client.lastName;
        document.getElementById('client-document').value = client.identityDocument;
        document.getElementById('client-type').value = client.clientType;
        document.getElementById('client-email').value = client.email;
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-address').value = client.address;
        document.getElementById('client-stratification').value = client.socioeconomicStratification || '';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Show save button
        document.getElementById('saveClientBtn').style.display = 'block';
        
        // Show modal
        const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
        clientModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching client for edit:', error);
        hideLoading();
    }
}

// Add new client
function addNewClient() {
    // Reset form
    document.getElementById('clientForm').reset();
    document.getElementById('client-id').value = '';
    
    // Set modal title
    document.getElementById('clientModalTitle').textContent = 'Agregar Cliente';
    
    // Enable form fields
    const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
    formElements.forEach(element => {
        element.removeAttribute('disabled');
    });
    
    // Show save button
    document.getElementById('saveClientBtn').style.display = 'block';
    
    // Show modal
    const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
    clientModal.show();
}

// Save client (create or update)
async function saveClient() {
    try {
        showLoading();
        const clientId = document.getElementById('client-id').value;
        const isUpdate = clientId !== '';
        
        // Collect form data
        const clientData = {
            firstName: document.getElementById('client-firstName').value,
            lastName: document.getElementById('client-lastName').value,
            identityDocument: document.getElementById('client-document').value,
            clientType: document.getElementById('client-type').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value || null,
            address: document.getElementById('client-address').value,
            socioeconomicStratification: document.getElementById('client-stratification').value || null
        };
        
        if (isUpdate) {
            clientData.clientId = parseInt(clientId);
            await apiRequest(API_ENDPOINTS.CLIENTS, 'PUT', clientData);
            showToast('Éxito', 'Cliente actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.CLIENTS, 'POST', clientData);
            showToast('Éxito', 'Cliente creado correctamente', 'success');
        }
        
        // Close modal
        const clientModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
        clientModal.hide();
        
        // Refresh clients list
        await getAllClients();
        hideLoading();
    } catch (error) {
        console.error('Error saving client:', error);
        hideLoading();
    }
}

// Confirm delete client
function confirmDeleteClient(clientId, clientName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el cliente ${clientName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteClient(clientId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete client
// Ensure permanent delete is properly implemented
async function deleteClient(clientId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.CLIENT_PERMANENT_DELETE(clientId) 
            : API_ENDPOINTS.CLIENT_BY_ID(clientId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Cliente eliminado permanentemente' : 'Cliente eliminado correctamente', 
            'success'
        );
        
        // Refresh clients list
        await getAllClients();
        hideLoading();
    } catch (error) {
        console.error('Error deleting client:', error);
        hideLoading();
        showToast('Error', 'No se pudo eliminar el cliente', 'error');
    }
}

// Initialize client page based on URL parameters
function initFromUrlParams() {
    const params = getUrlParams();
    
    if (params.action === 'new') {
        // Create new client
        setTimeout(() => {
            addNewClient();
        }, 500);
    } else if (params.action === 'view' && params.id) {
        // View client details
        setTimeout(() => {
            viewClientDetails(params.id);
        }, 500);
    } else if (params.action === 'edit' && params.id) {
        // Edit client
        setTimeout(() => {
            editClient(params.id);
        }, 500);
    }
}

// Initialize clients page
function initClientsPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('client-add-btn').addEventListener('click', addNewClient);
    document.getElementById('saveClientBtn').addEventListener('click', saveClient);
    
    // Set up search functionality
    setupTableSearch('client-search', 'clients-table', 1); // Search by name (column index 1)
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllClients();
    
    // Initialize based on URL parameters
    initFromUrlParams();
}

// Initialize when document is ready
onDocumentReady(initClientsPage);