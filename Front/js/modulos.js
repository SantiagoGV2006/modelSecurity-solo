/**
 * SecurityPQR System - Módulos Page JavaScript
 */

// Variables globales
let modulesData = [];

// Get all modules
async function getAllModules() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.MODULES);
        modulesData = data;
        renderModulesTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching modules:', error);
        hideLoading();
    }
}

// Render modules table
function renderModulesTable(modules) {
    const tableBody = document.getElementById('modules-table');
    
    tableBody.innerHTML = '';
    
    if (modules.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay módulos registrados</td>
            </tr>
        `;
        return;
    }
    
    modules.forEach(module => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${module.id}</td>
            <td>${module.code}</td>
            <td></td>
            <td>${formatDate(module.createAt)}</td>
            <td></td>
        `;
        
        // Add status badge
        const statusCell = row.cells[2];
        statusCell.appendChild(createStatusBadge(module.active));
        
        // Add action buttons
        const actionsCell = row.cells[4];
        const actionButtons = createActionButtons({
            edit: () => editModule(module.id),
            delete: () => confirmDeleteModule(module.id, module.code)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit module
async function editModule(moduleId) {
    try {
        showLoading();
        const module = await apiRequest(API_ENDPOINTS.MODULE_BY_ID(moduleId));
        
        // Populate modal with module data
        document.getElementById('moduleModalTitle').textContent = 'Editar Módulo';
        document.getElementById('module-id').value = module.id;
        document.getElementById('module-code').value = module.code;
        document.getElementById('module-active').checked = module.active;
        
        // Show modal
        const moduleModal = new bootstrap.Modal(document.getElementById('moduleModal'));
        moduleModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching module for edit:', error);
        hideLoading();
    }
}

// Add new module
function addNewModule() {
    // Reset form
    document.getElementById('moduleForm').reset();
    document.getElementById('module-id').value = '';
    document.getElementById('module-active').checked = true;
    
    // Set modal title
    document.getElementById('moduleModalTitle').textContent = 'Agregar Módulo';
    
    // Show modal
    const moduleModal = new bootstrap.Modal(document.getElementById('moduleModal'));
    moduleModal.show();
}

// Save module (create or update)
async function saveModule() {
    try {
        showLoading();
        const moduleId = document.getElementById('module-id').value;
        const isUpdate = moduleId !== '';
        
        // Collect form data
        const moduleData = {
            code: document.getElementById('module-code').value,
            active: document.getElementById('module-active').checked
        };
        
        if (isUpdate) {
            moduleData.id = parseInt(moduleId);
            await apiRequest(API_ENDPOINTS.MODULES, 'PUT', moduleData);
            showToast('Éxito', 'Módulo actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.MODULES, 'POST', moduleData);
            showToast('Éxito', 'Módulo creado correctamente', 'success');
        }
        
        // Close modal
        const moduleModal = bootstrap.Modal.getInstance(document.getElementById('moduleModal'));
        moduleModal.hide();
        
        // Refresh modules list
        await getAllModules();
        hideLoading();
    } catch (error) {
        console.error('Error saving module:', error);
        hideLoading();
    }
}

// Confirm delete module
function confirmDeleteModule(moduleId, moduleCode) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el módulo ${moduleCode}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteModule(moduleId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete module
async function deleteModule(moduleId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.MODULE_PERMANENT_DELETE(moduleId) 
            : API_ENDPOINTS.MODULE_BY_ID(moduleId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Módulo eliminado permanentemente' : 'Módulo eliminado correctamente', 
            'success'
        );
        
        // Refresh modules list
        await getAllModules();
        hideLoading();
    } catch (error) {
        console.error('Error deleting module:', error);
        hideLoading();
    }
}

// Initialize modules page
function initModulesPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('module-add-btn').addEventListener('click', addNewModule);
    document.getElementById('saveModuleBtn').addEventListener('click', saveModule);
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllModules();
}

// Initialize when document is ready
onDocumentReady(initModulesPage);