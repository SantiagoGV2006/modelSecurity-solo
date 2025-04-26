/**
 * SecurityPQR System - Roles Page JavaScript
 */

// Variables globales
let rolesData = [];

// Get all roles
async function getAllRoles() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.ROLES);
        rolesData = data;
        renderRolesTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching roles:', error);
        hideLoading();
    }
}

// Render roles table
function renderRolesTable(roles) {
    const tableBody = document.getElementById('roles-table');
    
    tableBody.innerHTML = '';
    
    if (roles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay roles registrados</td>
            </tr>
        `;
        return;
    }
    
    roles.forEach(role => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${role.id}</td>
            <td>${role.name}</td>
            <td>${role.description || 'Sin descripción'}</td>
            <td>${formatDate(role.createAt)}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[4];
        const actionButtons = createActionButtons({
            edit: () => editRole(role.id),
            delete: () => confirmDeleteRole(role.id, role.name),
            custom: [
                {
                    icon: '<i class="fas fa-shield-alt"></i>',
                    title: 'Permisos',
                    color: 'warning',
                    handler: () => manageRolePermissions(role.id, role.name)
                }
            ]
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit role
async function editRole(roleId) {
    try {
        showLoading();
        const role = await apiRequest(API_ENDPOINTS.ROLE_BY_ID(roleId));
        
        // Populate modal with role data
        document.getElementById('roleModalTitle').textContent = 'Editar Rol';
        document.getElementById('role-id').value = role.id;
        document.getElementById('role-name').value = role.name;
        document.getElementById('role-description').value = role.description || '';
        
        // Show modal
        const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
        roleModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching role for edit:', error);
        hideLoading();
    }
}

// Add new role
function addNewRole() {
    // Reset form
    document.getElementById('roleForm').reset();
    document.getElementById('role-id').value = '';
    
    // Set modal title
    document.getElementById('roleModalTitle').textContent = 'Agregar Rol';
    
    // Show modal
    const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
    roleModal.show();
}

// Save role (create or update)
async function saveRole() {
    try {
        showLoading();
        const roleId = document.getElementById('role-id').value;
        const isUpdate = roleId !== '';
        
        // Collect form data
        const roleData = {
            name: document.getElementById('role-name').value,
            description: document.getElementById('role-description').value || null
        };
        
        if (isUpdate) {
            roleData.id = parseInt(roleId);
            await apiRequest(API_ENDPOINTS.ROLES, 'PUT', roleData);
            showToast('Éxito', 'Rol actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.ROLES, 'POST', roleData);
            showToast('Éxito', 'Rol creado correctamente', 'success');
        }
        
        // Close modal
        const roleModal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
        roleModal.hide();
        
        // Refresh roles list
        await getAllRoles();
        hideLoading();
    } catch (error) {
        console.error('Error saving role:', error);
        hideLoading();
    }
}

// Manage role permissions
async function manageRolePermissions(roleId, roleName) {
    try {
        showLoading();
        
        // Get all forms
        const forms = await apiRequest(API_ENDPOINTS.FORMS);
        
        // Get role form permissions
        const rolePermissions = await apiRequest(API_ENDPOINTS.ROL_FORM_PERMISSIONS_BY_ROL_ID(roleId));
        
        // Create permissions table
        const permissionsTable = document.getElementById('permissions-table');
        permissionsTable.innerHTML = '';
        
        if (forms.length === 0) {
            permissionsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay formularios disponibles</td>
                </tr>
            `;
        } else {
            forms.forEach(form => {
                const formPermission = rolePermissions.find(rp => rp.formId === form.id);
                let canRead = false;
                let canCreate = false;
                let canUpdate = false;
                let canDelete = false;
                let permissionId = null;
                
                if (formPermission) {
                    const permission = formPermission.permission;
                    canRead = permission.can_Read;
                    canCreate = permission.can_Create;
                    canUpdate = permission.can_Update;
                    canDelete = permission.can_Delete;
                    permissionId = permission.id;
                }
                
                const row = document.createElement('tr');
                row.dataset.formId = form.id;
                row.dataset.permissionId = permissionId || '';
                
                row.innerHTML = `
                    <td>${form.name} (${form.code})</td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-read-${form.id}" ${canRead ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-create-${form.id}" ${canCreate ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-update-${form.id}" ${canUpdate ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-delete-${form.id}" ${canDelete ? 'checked' : ''}>
                        </div>
                    </td>
                `;
                
                permissionsTable.appendChild(row);
            });
        }
        
        // Store role ID
        document.getElementById('rolePermissions-roleId').value = roleId;
        
        // Show modal
        document.querySelector('#rolePermissionsModal .modal-title').textContent = `Permisos - ${roleName}`;
        const rolePermissionsModal = new bootstrap.Modal(document.getElementById('rolePermissionsModal'));
        rolePermissionsModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error managing role permissions:', error);
        hideLoading();
    }
}

// Save role permissions
async function saveRolePermissions() {
    try {
        showLoading();
        const roleId = parseInt(document.getElementById('rolePermissions-roleId').value);
        
        // Get all permission rows
        const permissionRows = document.querySelectorAll('#permissions-table tr[data-form-id]');
        
        // Process each row
        for (const row of permissionRows) {
            const formId = parseInt(row.dataset.formId);
            const permissionId = row.dataset.permissionId ? parseInt(row.dataset.permissionId) : null;
            
            // Get permission values
            const canRead = document.getElementById(`perm-read-${formId}`).checked;
            const canCreate = document.getElementById(`perm-create-${formId}`).checked;
            const canUpdate = document.getElementById(`perm-update-${formId}`).checked;
            const canDelete = document.getElementById(`perm-delete-${formId}`).checked;
            
            // Skip if all permissions are false and there's no existing permission
            if (!canRead && !canCreate && !canUpdate && !canDelete && !permissionId) {
                continue;
            }
            
            // Create or update permission
            if (permissionId) {
                // Update existing permission
                await apiRequest(API_ENDPOINTS.PERMISSIONS, 'PUT', {
                    id: permissionId,
                    can_Read: canRead,
                    can_Create: canCreate,
                    can_Update: canUpdate,
                    can_Delete: canDelete
                });
            } else {
                // Create new permission and role-form-permission
                const permission = await apiRequest(API_ENDPOINTS.PERMISSIONS, 'POST', {
                    can_Read: canRead,
                    can_Create: canCreate,
                    can_Update: canUpdate,
                    can_Delete: canDelete
                });
                
                await apiRequest(API_ENDPOINTS.ROL_FORM_PERMISSIONS, 'POST', {
                    rolId: roleId,
                    formId: formId,
                    permissionId: permission.id
                });
            }
        }
        
        showToast('Éxito', 'Permisos actualizados correctamente', 'success');
        
        // Close modal
        const rolePermissionsModal = bootstrap.Modal.getInstance(document.getElementById('rolePermissionsModal'));
        rolePermissionsModal.hide();
        
        hideLoading();
    } catch (error) {
        console.error('Error saving role permissions:', error);
        hideLoading();
    }
}

// Confirm delete role
function confirmDeleteRole(roleId, roleName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el rol ${roleName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteRole(roleId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete role
async function deleteRole(roleId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.ROLE_PERMANENT_DELETE(roleId) 
            : API_ENDPOINTS.ROLE_BY_ID(roleId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Rol eliminado permanentemente' : 'Rol eliminado correctamente', 
            'success'
        );
        
        // Refresh roles list
        await getAllRoles();
        hideLoading();
    } catch (error) {
        console.error('Error deleting role:', error);
        hideLoading();
    }
}

// Initialize roles page
function initRolesPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('role-add-btn').addEventListener('click', addNewRole);
    document.getElementById('saveRoleBtn').addEventListener('click', saveRole);
    document.getElementById('saveRolePermissionsBtn').addEventListener('click', saveRolePermissions);
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllRoles();
}

// Initialize when document is ready
onDocumentReady(initRolesPage);