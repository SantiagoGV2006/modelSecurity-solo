async function loadDashboardCounts() {
    try {
        // Obtener contadores de usuarios, roles, módulos y formularios
        const users = await apiRequest(API_ENDPOINTS.USERS);
        updateUserCount(users.length);
        
        const roles = await apiRequest(API_ENDPOINTS.ROLES);
        updateRoleCount(roles.length);
        
        const modules = await apiRequest(API_ENDPOINTS.MODULES);
        updateModuleCount(modules.length);
        
        const forms = await apiRequest(API_ENDPOINTS.FORMS);
        updateFormCount(forms.length);
    } catch (error) {
        console.error('Error loading dashboard counts:', error);
    }
}

// Actualizar contador de usuarios
function updateUserCount(count) {
    const countElement = document.getElementById('user-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.classList.add('fade-in');
    }
}

// Actualizar contador de roles
function updateRoleCount(count) {
    const countElement = document.getElementById('role-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.classList.add('fade-in');
    }
}

// Actualizar contador de módulos
function updateModuleCount(count) {
    const countElement = document.getElementById('module-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.classList.add('fade-in');
    }
}

// Actualizar contador de formularios
function updateFormCount(count) {
    const countElement = document.getElementById('form-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.classList.add('fade-in');
    }
}

// Cargar usuarios recientes
async function loadRecentUsers() {
    try {
        const users = await apiRequest(API_ENDPOINTS.USERS);
        const recentUsersTable = document.getElementById('recent-users');
        
        if (!recentUsersTable) return;
        
        if (users.length === 0) {
            recentUsersTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay usuarios registrados</td>
                </tr>
            `;
            return;
        }
        
        // Mostrar solo los 5 usuarios más recientes
        const sortedUsers = users.sort((a, b) => b.id - a.id);
        const recentUsers = sortedUsers.slice(0, 5);
        recentUsersTable.innerHTML = '';
        
        recentUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-secondary">${user.roleCount || 0} roles</span></td>
                <td></td>
            `;
            
            // Añadir botones de acción
            const actionsCell = row.cells[4];
            const actionButtons = document.createElement('div');
            actionButtons.className = 'table-actions';
            
            // Botón Ver
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'Ver detalle';
            viewBtn.onclick = () => window.location.href = `usuarios.html?id=${user.id}&action=view`;
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.onclick = () => window.location.href = `usuarios.html?id=${user.id}&action=edit`;
            
            // Botón Roles
            const rolesBtn = document.createElement('button');
            rolesBtn.className = 'view-btn';
            rolesBtn.style.backgroundColor = '#FFF3CD';
            rolesBtn.style.color = '#856404';
            rolesBtn.innerHTML = '<i class="fas fa-user-tag"></i>';
            rolesBtn.title = 'Asignar Roles';
            rolesBtn.onclick = () => window.location.href = `usuarios.html?id=${user.id}&action=roles`;
            
            actionButtons.appendChild(viewBtn);
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(rolesBtn);
            actionsCell.appendChild(actionButtons);
            recentUsersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent users:', error);
    }
}

// Cargar roles recientes
async function loadRecentRoles() {
    try {
        const roles = await apiRequest(API_ENDPOINTS.ROLES);
        const recentRolesTable = document.getElementById('recent-roles');
        
        if (!recentRolesTable) return;
        
        if (roles.length === 0) {
            recentRolesTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay roles registrados</td>
                </tr>
            `;
            return;
        }
        
        // Mostrar solo los 5 roles más recientes
        const sortedRoles = roles.sort((a, b) => b.id - a.id);
        const recentRoles = sortedRoles.slice(0, 5);
        recentRolesTable.innerHTML = '';
        
        recentRoles.forEach(role => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${role.id}</td>
                <td>${role.name}</td>
                <td>${role.description || 'Sin descripción'}</td>
                <td>${formatDate(role.createAt)}</td>
                <td></td>
            `;
            
            // Añadir botones de acción
            const actionsCell = row.cells[4];
            const actionButtons = document.createElement('div');
            actionButtons.className = 'table-actions';
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.onclick = () => window.location.href = `roles.html?id=${role.id}&action=edit`;
            
            // Botón Permisos
            const permissionsBtn = document.createElement('button');
            permissionsBtn.className = 'view-btn';
            permissionsBtn.style.backgroundColor = '#D1E7DD';
            permissionsBtn.style.color = '#0F5132';
            permissionsBtn.innerHTML = '<i class="fas fa-shield-alt"></i>';
            permissionsBtn.title = 'Permisos';
            permissionsBtn.onclick = () => window.location.href = `roles.html?id=${role.id}&action=permissions`;
            
            // Botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Eliminar';
            deleteBtn.onclick = () => window.location.href = `roles.html?id=${role.id}&action=delete`;
            
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(permissionsBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            recentRolesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent roles:', error);
    }
}

// Cargar formularios recientes
async function loadRecentForms() {
    try {
        const forms = await apiRequest(API_ENDPOINTS.FORMS);
        const recentFormsTable = document.getElementById('recent-forms');
        
        if (!recentFormsTable) return;
        
        if (forms.length === 0) {
            recentFormsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay formularios registrados</td>
                </tr>
            `;
            return;
        }
        
        // Mostrar solo los 5 formularios más recientes
        const sortedForms = forms.sort((a, b) => b.id - a.id);
        const recentForms = sortedForms.slice(0, 5);
        recentFormsTable.innerHTML = '';
        
        recentForms.forEach(form => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${form.id}</td>
                <td>${form.name}</td>
                <td>${form.code}</td>
                <td><span class="badge ${form.active ? 'bg-success' : 'bg-danger'}">${form.active ? 'Activo' : 'Inactivo'}</span></td>
                <td></td>
            `;
            
            // Añadir botones de acción
            const actionsCell = row.cells[4];
            const actionButtons = document.createElement('div');
            actionButtons.className = 'table-actions';
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.onclick = () => window.location.href = `formularios.html?id=${form.id}&action=edit`;
            
            // Botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Eliminar';
            deleteBtn.onclick = () => window.location.href = `formularios.html?id=${form.id}&action=delete`;
            
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            recentFormsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent forms:', error);
    }
}

// Cargar módulos recientes
async function loadRecentModules() {
    try {
        const modules = await apiRequest(API_ENDPOINTS.MODULES);
        const recentModulesTable = document.getElementById('recent-modules');
        
        if (!recentModulesTable) return;
        
        if (modules.length === 0) {
            recentModulesTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay módulos registrados</td>
                </tr>
            `;
            return;
        }
        
        // Mostrar solo los 5 módulos más recientes
        const sortedModules = modules.sort((a, b) => b.id - a.id);
        const recentModules = sortedModules.slice(0, 5);
        recentModulesTable.innerHTML = '';
        
        recentModules.forEach(module => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${module.id}</td>
                <td>${module.code}</td>
                <td><span class="badge ${module.active ? 'bg-success' : 'bg-danger'}">${module.active ? 'Activo' : 'Inactivo'}</span></td>
                <td>${formatDate(module.createAt)}</td>
                <td></td>
            `;
            
            // Añadir botones de acción
            const actionsCell = row.cells[4];
            const actionButtons = document.createElement('div');
            actionButtons.className = 'table-actions';
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.onclick = () => window.location.href = `modulos.html?id=${module.id}&action=edit`;
            
            // Botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Eliminar';
            deleteBtn.onclick = () => window.location.href = `modulos.html?id=${module.id}&action=delete`;
            
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            recentModulesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent modules:', error);
    }
}

// Cargar permisos recientes
async function loadRecentPermissions() {
    try {
        const permissions = await apiRequest(API_ENDPOINTS.PERMISSIONS);
        const recentPermissionsTable = document.getElementById('recent-permissions');
        
        if (!recentPermissionsTable) return;
        
        if (permissions.length === 0) {
            recentPermissionsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay permisos registrados</td>
                </tr>
            `;
            return;
        }
        
        // Mostrar solo los 5 permisos más recientes
        const sortedPermissions = permissions.sort((a, b) => b.id - a.id);
        const recentPermissions = sortedPermissions.slice(0, 5);
        recentPermissionsTable.innerHTML = '';
        
        recentPermissions.forEach(permission => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${permission.id}</td>
                <td>${getBadgeForPermission(permission.can_Read, 'Lectura')}</td>
                <td>${getBadgeForPermission(permission.can_Create, 'Creación')}</td>
                <td>${getBadgeForPermission(permission.can_Update, 'Actualización')}</td>
                <td>${getBadgeForPermission(permission.can_Delete, 'Eliminación')}</td>
                <td></td>
            `;
            
            // Añadir botones de acción
            const actionsCell = row.cells[5];
            const actionButtons = document.createElement('div');
            actionButtons.className = 'table-actions';
            
            // Botón Editar
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.onclick = () => window.location.href = `permisos.html?id=${permission.id}&action=edit`;
            
            // Botón Eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Eliminar';
            deleteBtn.onclick = () => window.location.href = `permisos.html?id=${permission.id}&action=delete`;
            
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            recentPermissionsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent permissions:', error);
    }
}

// Obtener badge para permiso
function getBadgeForPermission(value, label) {
    const badgeClass = value ? 'bg-success' : 'bg-secondary';
    return `<span class="badge ${badgeClass}">${value ? '✓ ' + label : '✗ ' + label}</span>`;
}

// Inicializar búsquedas para las tablas del dashboard
function initDashboardSearches() {
    // Configurar búsqueda para cada tabla
    setupTableSearch('usuarios-search', 'recent-users', [1, 2]); // Nombre y Email
    setupTableSearch('roles-search', 'recent-roles', [1, 2]); // Nombre y Descripción
    setupTableSearch('formularios-search', 'recent-forms', [1, 2]); // Nombre y Código
    setupTableSearch('modulos-search', 'recent-modules', [1]); // Código
    setupTableSearch('permisos-search', 'recent-permissions', []); // No se busca por texto, se busca por ID
}

// Configurar búsqueda para una tabla específica
function setupTableSearch(searchInputId, tableBodyId, columnIndices = [0]) {
    const searchInput = document.getElementById(searchInputId);
    const tableBody = document.getElementById(tableBodyId);
    
    if (!searchInput || !tableBody) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');
        
        if (searchTerm === '') {
            // Si la búsqueda está vacía, mostrar todas las filas
            rows.forEach(row => row.style.display = '');
            return;
        }
        
        // Expandir la tarjeta si hay texto en la búsqueda
        if (searchTerm) {
            const cardId = this.closest('.collapsible-card').id;
            expandCardById(cardId);
        }
        
        rows.forEach(row => {
            // Ignorar filas de mensaje como "No hay registros"
            if (row.cells.length <= 1) {
                row.style.display = 'none';
                return;
            }
            
            let found = false;
            
            // Si no hay columnas específicas, buscar en todas
            if (columnIndices.length === 0) {
                // Para permisos buscamos por ID
                found = row.cells[0].textContent.toLowerCase().includes(searchTerm);
            } else {
                // Buscar en las columnas especificadas
                columnIndices.forEach(index => {
                    if (index < row.cells.length) {
                        const cellText = row.cells[index].textContent.toLowerCase();
                        if (cellText.includes(searchTerm)) {
                            found = true;
                        }
                    }
                });
            }
            
            row.style.display = found ? '' : 'none';
        });
    });
}

// Cargar todos los datos del dashboard
async function loadDashboardData() {
    try {
        showLoading();
        
        // Verificar autenticación
        if (!checkAuth()) return;
        
        // Configurar botón de logout
        initLogoutButton();
        
        // Cargar información de usuario desde localStorage
        const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            document.getElementById('user-info').textContent = `Usuario: ${userInfo.name}`;
        }
        
        // Inicializar búsquedas para las tablas
        initDashboardSearches();
        
        // Cargar todos los datos del dashboard
        await Promise.all([
            loadDashboardCounts(),
            loadRecentUsers(),
            loadRecentRoles(),
            loadRecentForms(),
            loadRecentModules(),
            loadRecentPermissions()
        ]);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        hideLoading();
    }
}

// Inicializar página del dashboard
function initDashboardPage() {
    loadDashboardData();
}

// Inicializar cuando el documento esté listo
onDocumentReady(initDashboardPage);