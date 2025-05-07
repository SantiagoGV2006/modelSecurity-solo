document.addEventListener('DOMContentLoaded', function() {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Get the registration form
    const registerForm = document.getElementById('registerAdminForm');
    
    // Add submit event to the form
    registerForm.addEventListener('submit', handleRegisterSubmit);
    
    /**
     * Handles admin registration form submission
     */
    async function handleRegisterSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const companyCode = document.getElementById('companyCode').value;
        const isAdmin = document.getElementById('isAdmin').value === 'true';
        
        // Validate fields
        if (!name || !email || !username || !password || !confirmPassword || !companyCode) {
            showMessage('registerMessage', 'Por favor, complete todos los campos.', 'error');
            return;
        }
        
        // Validate that passwords match
        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Las contraseñas no coinciden.', 'error');
            return;
        }
        
        // Validate company code
        const validCompanyCodes = ['ADMIN123', 'EMPRESA2023', 'SYSADMIN2025'];
        if (!validCompanyCodes.includes(companyCode)) {
            showMessage('registerMessage', 'Código de empresa no válido.', 'error');
            return;
        }
        
        try {
            showMessage('registerMessage', 'Procesando su registro...', 'info');
            
            const userData = {
                Name: name,
                Email: email,
                Username: username,
                Password: password,
                IsAdmin: isAdmin,
                CompanyCode: companyCode
            };
            
            // Call the API to register the admin
            const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USER}/register`, 'POST', userData);
            
            if (response) {
                // Show success message
                showMessage('registerMessage', '¡Registro de administrador exitoso! Ahora puede iniciar sesión.', 'success');
                
                // Reset form
                registerForm.reset();
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (error) {
            showMessage('registerMessage', error.message || 'Error al registrar administrador.', 'error');
            console.error('Error al registrar administrador:', error);
        }
    }
});