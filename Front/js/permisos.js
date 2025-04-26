/**
 * SecurityPQR System - Permisos Page JavaScript
 */

// Variables globales
let permissionsData = [];

// Get all permissions
async function getAllPermissions() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.PERMISSIONS);
        permissionsData = data;
        renderPermissionsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching permissions:', error);
        hideLoading();
    }
}

// Render permissions table
function renderPermissionsTable(permissions) {
    const tableBody = document.getElementById('permissions-list-table');
    
    tableBody.innerHTML = '';
    
    if (permissions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay permisos registrados</td>
            </tr>
        `;
        return;
    }
    
    permissions.forEach(permission => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${permission.id}</td>
            <td>${getBadgeForPermission(permission.can_Read, 'Lectura')}</td>
            <td>${getBadgeForPermission(permission.can_Create, 'Creación')}</td>
            <td>${getBadgeForPermission(permission.can_Update, 'Actualización')}</td>
            <td>${getBadgeForPermission(permission.can_Delete, 'Eliminación')}</td>
            <td>${formatDate(permission.createAt)}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            edit: () => editPermission(permission.id),
            delete: () => confirmDeletePermission(permission.id)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Get badge for permission
function getBadgeForPermission(value, label) {
    const badgeClass = value ? 'bg-success' : 'bg-secondary';
    return `<span class="badge ${badgeClass}">${value ? '✓ ' + label : '✗ ' + label}</span>`;
}

// Edit permission
async function editPermission(permissionId) {
    try {
        showLoading();
        const permission = await apiRequest(API_ENDPOINTS.PERMISSION_BY_ID(permissionId));
        
        // Populate modal with permission data
        document.getElementById('permissionModalTitle').textContent = 'Editar Permiso';
        document.getElementById('permission-id').value = permission.id;
        document.getElementById('permission-can-read').checked = permission.can_Read;
        document.getElementById('permission-can-create').checked = permission.can_Create;
        document.getElementById('permission-can-update').checked = permission.can_Update;
        document.getElementById('permission-can-delete').checked = permission.can_Delete;
        
        // Show modal
        const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
        permissionModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching permission for edit:', error);
        hideLoading();
    }
}

// Add new permission
function addNewPermission() {
    // Reset form
    document.getElementById('permissionForm').reset();
    document.getElementById('permission-id').value = '';
    
    // Set modal title
    document.getElementById('permissionModalTitle').textContent = 'Agregar Permiso';
    
    // Show modal
    const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
    permissionModal.show();
}

// Save permission (create or update)
async function savePermission() {
    try {
        showLoading();
        const permissionId = document.getElementById('permission-id').value;
        const isUpdate = permissionId !== '';
        
        // Collect form data
        const permissionData = {
            can_Read: document.getElementById('permission-can-read').checked,
            can_Create: document.getElementById('permission-can-create').checked,
            can_Update: document.getElementById('permission-can-update').checked,
            can_Delete: document.getElementById('permission-can-delete').checked
        };
        
        if (isUpdate) {
            permissionData.id = parseInt(permissionId);
            await apiRequest(API_ENDPOINTS.PERMISSIONS, 'PUT', permissionData);
            showToast('Éxito', 'Permiso actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.PERMISSIONS, 'POST', permissionData);
            showToast('Éxito', 'Permiso creado correctamente', 'success');
        }
        
        // Close modal
        const permissionModal = bootstrap.Modal.getInstance(document.getElementById('permissionModal'));
        permissionModal.hide();
        
        // Refresh permissions list
        await getAllPermissions();
        hideLoading();
    } catch (error) {
        console.error('Error saving permission:', error);
        hideLoading();
    }
}

// Confirm delete permission
function confirmDeletePermission(permissionId) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el permiso #${permissionId}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deletePermission(permissionId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete permission
async function deletePermission(permissionId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.PERMISSION_PERMANENT_DELETE(permissionId) 
            : API_ENDPOINTS.PERMISSION_BY_ID(permissionId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Permiso eliminado permanentemente' : 'Permiso eliminado correctamente', 
            'success'
        );
        
        // Refresh permissions list
        await getAllPermissions();
        hideLoading();
    } catch (error) {
        console.error('Error deleting permission:', error);
        hideLoading();
    }
}

// Initialize permissions page
function initPermissionsPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('permission-add-btn').addEventListener('click', addNewPermission);
    document.getElementById('savePermissionBtn').addEventListener('click', savePermission);
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllPermissions();
}

// Initialize when document is ready
onDocumentReady(initPermissionsPage);