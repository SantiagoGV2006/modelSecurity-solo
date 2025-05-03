document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    requireAuth();
    
    // Cargar datos del usuario
    const user = getFromStorage('user');
    
    // Elementos del DOM
    const userDisplayName = document.getElementById('userDisplayName');
    const userRole = document.getElementById('userRole');
    const currentRole = document.getElementById('currentRole');
    const sectionTitle = document.getElementById('sectionTitle');
    const logoutBtn = document.getElementById('logoutBtn');
    const menuLinks = document.querySelectorAll('.menu a[data-section]');
    const sections = document.querySelectorAll('.section-content');
    
    // Elementos que solo son visibles para administradores
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    
    // Mostrar/ocultar elementos según el rol del usuario
    if (isAdmin()) {
        adminOnlyElements.forEach(el => el.style.display = 'block');
    } else {
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
    
    // Mostrar información del usuario
    userDisplayName.textContent = user.name || user.username;
    userRole.textContent = user.rolName || 'Usuario';
    currentRole.textContent = user.rolName || 'Usuario';
    
    // Cargar permisos del rol
    loadRolePermissions();
    
    // Sección de perfil
    loadProfileData();
    
    // Si es administrador, cargar datos para las secciones de admin
    if (isAdmin()) {
        loadUsersData();
        loadRolesData();
    }
    
    // Agregar evento para cambiar entre secciones
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la sección a mostrar
            const sectionToShow = this.getAttribute('data-section');
            
            // Actualizar clases activas en menú
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar título de la sección
            sectionTitle.textContent = this.textContent;
            
            // Ocultar todas las secciones
            sections.forEach(section => section.classList.add('hidden'));
            
            // Mostrar la sección seleccionada
            document.getElementById(sectionToShow + 'Section').classList.remove('hidden');
        });
    });
    
    // Agregar evento para cerrar sesión
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Eliminar datos de sesión
        removeFromStorage('user');
        
        // Redirigir a la página de login
        window.location.href = 'login.html';
    });
    
    // Agregar evento para el formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    /**
     * Carga la información de permisos del rol del usuario
     */
    async function loadRolePermissions() {
        try {
            if (!user.rolId) {
                console.error('No se encontró rolId del usuario');
                return;
            }
            
            // Obtener los permisos de rol-formulario para el rol del usuario
            const rolFormPermissions = await apiRequest(`${API_CONFIG.ENDPOINTS.ROL_FORM_PERMISSION}/rol/${user.rolId}`);
            
            if (!rolFormPermissions || rolFormPermissions.length === 0) {
                const rolePermissionsElement = document.getElementById('rolePermissions');
                rolePermissionsElement.innerHTML = '<p>No tienes permisos específicos asignados.</p>';
                return;
            }
            
            // Obtener los detalles de cada formulario y permiso
            const permissionsDetails = await Promise.all(rolFormPermissions.map(async (rfp) => {
                // Obtener detalles del formulario
                const form = await apiRequest(`${API_CONFIG.ENDPOINTS.FORM}/${rfp.formId}`);
                
                // Obtener detalles del permiso
                const permission = await apiRequest(`${API_CONFIG.ENDPOINTS.PERMISSION}/${rfp.permissionId}`);
                
                return {
                    formName: form ? form.name : 'Formulario desconocido',
                    canRead: permission ? permission.can_Read : false,
                    canCreate: permission ? permission.can_Create : false,
                    canUpdate: permission ? permission.can_Update : false,
                    canDelete: permission ? permission.can_Delete : false
                };
            }));
            
            // Mostrar permisos en la interfaz
            const rolePermissionsElement = document.getElementById('rolePermissions');
            let permissionsHTML = '<h4>Tus Permisos:</h4><ul class="permissions-list">';
            
            permissionsDetails.forEach(permission => {
                permissionsHTML += `
                    <li class="permission-item">
                        <strong>${permission.formName}</strong>:
                        <span class="${permission.canRead ? 'granted' : 'denied'}">Lectura</span> |
                        <span class="${permission.canCreate ? 'granted' : 'denied'}">Creación</span> |
                        <span class="${permission.canUpdate ? 'granted' : 'denied'}">Actualización</span> |
                        <span class="${permission.canDelete ? 'granted' : 'denied'}">Eliminación</span>
                    </li>
                `;
            });
            
            permissionsHTML += '</ul>';
            rolePermissionsElement.innerHTML = permissionsHTML;
            
        } catch (error) {
            console.error('Error al cargar permisos:', error);
            document.getElementById('rolePermissions').innerHTML = '<p class="error">Error al cargar permisos.</p>';
        }
    }
    
    /**
     * Carga los datos del perfil del usuario
     */
    function loadProfileData() {
        // Completar el formulario con los datos del usuario
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profileUsername').value = user.username || '';
    }
    
    /**
     * Maneja el envío del formulario de perfil
     */
    async function handleProfileSubmit(event) {
        event.preventDefault();
        
        // Obtener los valores del formulario
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validar campos obligatorios
        if (!name || !email) {
            showMessage('profileMessage', 'Nombre y correo electrónico son obligatorios.', 'error');
            return;
        }
        
        // Verificar si se está cambiando la contraseña
        const isChangingPassword = currentPassword && newPassword && confirmNewPassword;
        
        // Si se está cambiando la contraseña, validar
        if (isChangingPassword) {
            if (newPassword !== confirmNewPassword) {
                showMessage('profileMessage', 'Las nuevas contraseñas no coinciden.', 'error');
                return;
            }
        }
        
        try {
            // Crear objeto con los datos actualizados
            const updatedUserData = {
                Id: user.id,
                Name: name,
                Email: email
            };
            
            if (isChangingPassword) {
                // Primero verificar la contraseña actual
                // Esta verificación dependerá de cómo lo implemente el backend
                
                // Actualizar contraseña
                updatedUserData.Password = newPassword;
            }
            
            // Enviar actualización al backend
            const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USER}`, 'PUT', updatedUserData);
            
            if (response) {
                // Actualizar datos en localStorage
                const updatedUser = {
                    ...user,
                    name: name,
                    email: email
                };
                saveToStorage('user', updatedUser);
                
                // Actualizar nombre mostrado en la interfaz
                userDisplayName.textContent = name;
                
                // Mostrar mensaje de éxito
                showMessage('profileMessage', 'Perfil actualizado correctamente.', 'success');
                
                // Limpiar campos de contraseña
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmNewPassword').value = '';
            } else {
                showMessage('profileMessage', 'No se pudo actualizar el perfil.', 'error');
            }
        } catch (error) {
            showMessage('profileMessage', error.message || 'Error al actualizar el perfil.', 'error');
            console.error('Error al actualizar perfil:', error);
        }
    }
    
    /**
     * Carga la lista de usuarios (solo para administradores)
     */
    async function loadUsersData() {
        if (!isAdmin()) return;
        
        try {
            // Obtener usuarios desde la API
            const users = await apiRequest(API_CONFIG.ENDPOINTS.USER);
            
            if (!users || users.length === 0) {
                document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="5">No hay usuarios registrados.</td></tr>';
                return;
            }
            
            // Para cada usuario, obtener su rol
            const usersWithRoles = await Promise.all(users.map(async (user) => {
                try {
                    // Obtener roles del usuario
                    const rolUsers = await apiRequest(`${API_CONFIG.ENDPOINTS.ROL_USER}?userId=${user.id}`);
                    
                    if (rolUsers && rolUsers.length > 0) {
                        // Obtener detalles del rol
                        const rol = await apiRequest(`${API_CONFIG.ENDPOINTS.ROL}/${rolUsers[0].rolId}`);
                        
                        return {
                            ...user,
                            rolId: rolUsers[0].rolId,
                            rolName: rol ? rol.name : 'Sin rol'
                        };
                    }
                    
                    return {
                        ...user,
                        rolName: 'Sin rol'
                    };
                } catch (error) {
                    console.error(`Error al obtener rol para usuario ${user.id}:`, error);
                    return {
                        ...user,
                        rolName: 'Error al cargar rol'
                    };
                }
            }));
            
            // Mostrar usuarios en la tabla
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = '';
            
            usersWithRoles.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.rolName || 'Sin rol'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="button primary btn-edit-user" data-id="${user.id}">Editar</button>
                            <button class="button danger btn-delete-user" data-id="${user.id}">Eliminar</button>
                        </div>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
            
            // Agregar eventos a los botones de acción
            document.querySelectorAll('.btn-edit-user').forEach(btn => {
                btn.addEventListener('click', handleEditUser);
            });
            
            document.querySelectorAll('.btn-delete-user').forEach(btn => {
                btn.addEventListener('click', handleDeleteUser);
            });
            
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="5">Error al cargar usuarios.</td></tr>';
        }
    }
    
    /**
     * Carga la lista de roles (solo para administradores)
     */
    async function loadRolesData() {
        if (!isAdmin()) return;
        
        try {
            // Obtener roles desde la API
            const roles = await apiRequest(API_CONFIG.ENDPOINTS.ROL);
            
            if (!roles || roles.length === 0) {
                document.getElementById('rolesTableBody').innerHTML = '<tr><td colspan="4">No hay roles registrados.</td></tr>';
                return;
            }
            
            // Mostrar roles en la tabla
            const rolesTableBody = document.getElementById('rolesTableBody');
            rolesTableBody.innerHTML = '';
            
            roles.forEach(role => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${role.id}</td>
                    <td>${role.name || 'N/A'}</td>
                    <td>${role.description || 'Sin descripción'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="button primary btn-edit-role" data-id="${role.id}">Editar</button>
                            <button class="button danger btn-delete-role" data-id="${role.id}">Eliminar</button>
                        </div>
                    </td>
                `;
                rolesTableBody.appendChild(row);
            });
            
            // Agregar eventos a los botones de acción
            document.querySelectorAll('.btn-edit-role').forEach(btn => {
                btn.addEventListener('click', handleEditRole);
            });
            
            document.querySelectorAll('.btn-delete-role').forEach(btn => {
                btn.addEventListener('click', handleDeleteRole);
            });
            
        } catch (error) {
            console.error('Error al cargar roles:', error);
            document.getElementById('rolesTableBody').innerHTML = '<tr><td colspan="4">Error al cargar roles.</td></tr>';
        }
    }
    
    /**
     * Maneja el evento de editar un usuario
     */
    async function handleEditUser(event) {
        const userId = event.target.getAttribute('data-id');
        
        try {
            // Obtener detalles del usuario
            const user = await apiRequest(`${API_CONFIG.ENDPOINTS.USER}/${userId}`);
            
            if (!user) {
                alert('No se pudo obtener la información del usuario.');
                return;
            }
            
            // Implementar lógica de edición
            // Por ejemplo, abrir un modal con un formulario
            alert(`Editar usuario ${user.name} (ID: ${user.id})`);
            
            // Aquí puedes implementar un modal o formulario de edición
            
        } catch (error) {
            console.error('Error al editar usuario:', error);
            alert('Error al intentar editar el usuario.');
        }
    }
    
    /**
     * Maneja el evento de eliminar un usuario
     */
    async function handleDeleteUser(event) {
        const userId = event.target.getAttribute('data-id');
        
        if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                // Intentar eliminar el usuario
                const deleted = await apiRequest(`${API_CONFIG.ENDPOINTS.USER}/${userId}`, 'DELETE');
                
                if (deleted) {
                    // Recargar la lista de usuarios
                    loadUsersData();
                    alert('Usuario eliminado correctamente.');
                } else {
                    alert('No se pudo eliminar el usuario.');
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                alert(`Error al eliminar usuario: ${error.message || 'Error desconocido'}`);
            }
        }
    }
    
    /**
     * Maneja el evento de editar un rol
     */
    async function handleEditRole(event) {
        const roleId = event.target.getAttribute('data-id');
        
        try {
            // Obtener detalles del rol
            const role = await apiRequest(`${API_CONFIG.ENDPOINTS.ROL}/${roleId}`);
            
            if (!role) {
                alert('No se pudo obtener la información del rol.');
                return;
            }
            
            // Implementar lógica de edición
            // Por ejemplo, abrir un modal con un formulario
            alert(`Editar rol ${role.name} (ID: ${role.id})`);
            
            // Aquí puedes implementar un modal o formulario de edición
            
        } catch (error) {
            console.error('Error al editar rol:', error);
            alert('Error al intentar editar el rol.');
        }
    }
    
    /**
     * Maneja el evento de eliminar un rol
     */
    async function handleDeleteRole(event) {
        const roleId = event.target.getAttribute('data-id');
        
        if (confirm('¿Está seguro de que desea eliminar este rol? Esta acción no se puede deshacer.')) {
            try {
                // Intentar eliminar el rol
                const deleted = await apiRequest(`${API_CONFIG.ENDPOINTS.ROL}/${roleId}`, 'DELETE');
                
                if (deleted) {
                    // Recargar la lista de roles
                    loadRolesData();
                    alert('Rol eliminado correctamente.');
                } else {
                    alert('No se pudo eliminar el rol.');
                }
            } catch (error) {
                console.error('Error al eliminar rol:', error);
                alert(`Error al eliminar rol: ${error.message || 'Error desconocido'}`);
            }
        }
    }
});