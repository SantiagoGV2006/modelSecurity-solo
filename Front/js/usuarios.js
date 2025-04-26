/**
 * SecurityPQR System - Usuarios Page JavaScript
 */

// Variables globales
let usersData = [];
let currentUserPage = 1;

// Get all users
async function getAllUsers() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.USERS);
        usersData = data;
        renderUsersTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching users:', error);
        hideLoading();
    }
}

// Render users table
function renderUsersTable(users, page = 1) {
    const tableBody = document.getElementById('users-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, users.length);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.createAt)}</td>
            <td><span class="badge bg-secondary">${user.roleCount || 0} roles</span></td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[5];
        const actionButtons = createActionButtons({
            view: () => viewUserDetails(user.id),
            edit: () => editUser(user.id),
            delete: () => confirmDeleteUser(user.id, user.name),
            custom: [
                {
                    icon: '<i class="fas fa-user-tag"></i>',
                    title: 'Asignar Roles',
                    color: 'warning',
                    handler: () => manageUserRoles(user.id, user.name)
                }
            ]
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        users.length,
        page,
        pageSize,
        'users-pagination',
        (newPage) => {
            currentUserPage = newPage;
            renderUsersTable(users, newPage);
        }
    );
}

// View user details
async function viewUserDetails(userId) {
    try {
        showLoading();
        const user = await apiRequest(API_ENDPOINTS.USER_BY_ID(userId));
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Populate modal with user data (read-only)
        document.getElementById('userModalTitle').textContent = 'Detalles del Usuario';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = '********'; // Mask password
        document.getElementById('user-workerId').value = user.workerId || '';
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('saveUserBtn').style.display = 'none';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching user details:', error);
        hideLoading();
    }
}

// Edit user
async function editUser(userId) {
    try {
        showLoading();
        const user = await apiRequest(API_ENDPOINTS.USER_BY_ID(userId));
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Populate modal with user data
        document.getElementById('userModalTitle').textContent = 'Editar Usuario';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = ''; // Clear password field
        document.getElementById('user-workerId').value = user.workerId || '';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Set up password toggle
        setupPasswordToggle('user-password', 'toggleUserPasswordBtn');
        
        // Show save button
        document.getElementById('saveUserBtn').style.display = 'block';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        hideLoading();
    }
}

// Load workers dropdown for user form
async function loadWorkersDropdownForUser() {
    try {
        const workersSelect = document.getElementById('user-workerId');
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        
        // Clear previous options
        workersSelect.innerHTML = '<option value="">Ninguno</option>';
        
        // Add worker options
        workers.forEach(worker => {
            const option = document.createElement('option');
            option.value = worker.workerId;
            option.textContent = `${worker.firstName} ${worker.lastName} (${worker.jobTitle})`;
            workersSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading workers dropdown for user form:', error);
    }
}

// Add new user
async function addNewUser() {
    try {
        showLoading();
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Reset form
        document.getElementById('userForm').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-password').value = generateRandomPassword();
        
        // Set modal title
        document.getElementById('userModalTitle').textContent = 'Agregar Usuario';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Set up password toggle
        setupPasswordToggle('user-password', 'toggleUserPasswordBtn');
        
        // Show save button
        document.getElementById('saveUserBtn').style.display = 'block';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error preparing new user form:', error);
        hideLoading();
    }
}

// Save user (create or update)
async function saveUser() {
    try {
        showLoading();
        const userId = document.getElementById('user-id').value;
        const isUpdate = userId !== '';
        
        // Collect form data
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            workerId: document.getElementById('user-workerId').value || null
        };
        
        // Add password only if it's not empty (for updates)
        const password = document.getElementById('user-password').value;
        if (password && password !== '********') {
            userData.password = password;
        }
        
        if (isUpdate) {
            userData.id = parseInt(userId);
            await apiRequest(API_ENDPOINTS.USERS, 'PUT', userData);
            showToast('Éxito', 'Usuario actualizado correctamente', 'success');
        } else {
            // Password is required for new users
            if (!userData.password) {
                showToast('Error', 'La contraseña es obligatoria para nuevos usuarios', 'error');
                hideLoading();
                return;
            }
            await apiRequest(API_ENDPOINTS.USERS, 'POST', userData);
            showToast('Éxito', 'Usuario creado correctamente', 'success');
        }
        
        // Close modal
        const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        userModal.hide();
        
        // Refresh users list
        await getAllUsers();
        hideLoading();
    } catch (error) {
        console.error('Error saving user:', error);
        hideLoading();
    }
}

// Manage user roles
async function manageUserRoles(userId, userName) {
    try {
        showLoading();
        
        // Get all roles
        const roles = await apiRequest(API_ENDPOINTS.ROLES);
        
        // Get user's roles
        const rolUsers = await apiRequest(API_ENDPOINTS.ROL_USERS);
        const userRolIds = rolUsers
            .filter(rolUser => rolUser.userId === userId)
            .map(rolUser => rolUser.rolId);
        
        // Create checkboxes for each role
        const container = document.getElementById('roles-checkbox-container');
        container.innerHTML = '';
        
        if (roles.length === 0) {
            container.innerHTML = '<div class="text-center p-3">No hay roles disponibles</div>';
        } else {
            roles.forEach(role => {
                const isChecked = userRolIds.includes(role.id);
                
                const div = document.createElement('div');
                div.classList.add('form-check', 'mb-2');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('form-check-input');
                checkbox.id = `role-${role.id}`;
                checkbox.value = role.id;
                checkbox.checked = isChecked;
                
                const label = document.createElement('label');
                label.classList.add('form-check-label');
                label.htmlFor = `role-${role.id}`;
                label.textContent = `${role.name} - ${role.description || 'Sin descripción'}`;
                
                div.appendChild(checkbox);
                div.appendChild(label);
                container.appendChild(div);
            });
        }
        
        // Store user ID
        document.getElementById('userRoles-userId').value = userId;
        
        // Show modal
        document.querySelector('#userRolesModal .modal-title').textContent = `Asignar Roles - ${userName}`;
        const userRolesModal = new bootstrap.Modal(document.getElementById('userRolesModal'));
        userRolesModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error managing user roles:', error);
        hideLoading();
    }
}

// Save user roles
async function saveUserRoles() {
    try {
        showLoading();
        const userId = parseInt(document.getElementById('userRoles-userId').value);
        
        // Get all role checkboxes
        const roleCheckboxes = document.querySelectorAll('#roles-checkbox-container input[type="checkbox"]');
        const selectedRoleIds = Array.from(roleCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.value));
        
        // Get current user roles
        const rolUsers = await apiRequest(API_ENDPOINTS.ROL_USERS);
        const currentUserRoles = rolUsers.filter(rolUser => rolUser.userId === userId);
        const currentRoleIds = currentUserRoles.map(rolUser => rolUser.rolId);
        
        // Determine roles to add and remove
        const rolesToAdd = selectedRoleIds.filter(id => !currentRoleIds.includes(id));
        const rolesToRemove = currentUserRoles.filter(rolUser => !selectedRoleIds.includes(rolUser.rolId));
        
        // Add new roles
        for (const rolId of rolesToAdd) {
            await apiRequest(API_ENDPOINTS.ROL_USERS, 'POST', {
                userId: userId,
                rolId: rolId
            });
        }
        
        // Remove roles
        for (const rolUser of rolesToRemove) {
            await apiRequest(API_ENDPOINTS.ROL_USER_BY_ID(rolUser.id), 'DELETE');
        }
        
        showToast('Éxito', 'Roles actualizados correctamente', 'success');
        
        // Close modal
        const userRolesModal = bootstrap.Modal.getInstance(document.getElementById('userRolesModal'));
        userRolesModal.hide();
        
        // Refresh users list
        await getAllUsers();
        
        hideLoading();
    } catch (error) {
        console.error('Error saving user roles:', error);
        hideLoading();
    }
}

// Confirm delete user
function confirmDeleteUser(userId, userName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el usuario ${userName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteUser(userId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete user
async function deleteUser(userId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.USER_PERMANENT_DELETE(userId) 
            : API_ENDPOINTS.USER_BY_ID(userId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Usuario eliminado permanentemente' : 'Usuario eliminado correctamente', 
            'success'
        );
        
        // Refresh users list
        await getAllUsers();
        hideLoading();
    } catch (error) {
        console.error('Error deleting user:', error);
        hideLoading();
    }
}

// Initialize user page based on URL parameters
function initFromUrlParams() {
    const params = getUrlParams();
    
    if (params.action === 'new') {
        // Create new user
        setTimeout(() => {
            addNewUser();
        }, 500);
    } else if (params.action === 'view' && params.id) {
        // View user details
        setTimeout(() => {
            viewUserDetails(params.id);
        }, 500);
    } else if (params.action === 'edit' && params.id) {
        // Edit user
        setTimeout(() => {
            editUser(params.id);
        }, 500);
    }
}

// Initialize users page
function initUsersPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('user-add-btn').addEventListener('click', addNewUser);
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    document.getElementById('saveUserRolesBtn').addEventListener('click', saveUserRoles);
    
    // Set up search functionality
    setupTableSearch('user-search', 'users-table', 1); // Search by name (column index 1)
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllUsers();
    
    // Initialize based on URL parameters
    initFromUrlParams();
}

// Initialize when document is ready
onDocumentReady(initUsersPage);