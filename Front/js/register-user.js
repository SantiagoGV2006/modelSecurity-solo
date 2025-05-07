document.addEventListener('DOMContentLoaded', function() {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Get the registration form
    const registerForm = document.getElementById('registerUserForm');
    
    // Add submit event to the form
    registerForm.addEventListener('submit', handleRegisterSubmit);
    
    /**
     * Handles registration form submission
     */
    async function handleRegisterSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const isAdmin = document.getElementById('isAdmin').value === 'true';
        
        // Validate fields
        if (!name || !email || !username || !password || !confirmPassword) {
            showMessage('registerMessage', 'Por favor, complete todos los campos.', 'error');
            return;
        }
        
        // Validate that passwords match
        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Las contraseñas no coinciden.', 'error');
            return;
        }
        
        try {
            showMessage('registerMessage', 'Procesando su registro...', 'info');
            
            const userData = {
                Name: name,
                Email: email,
                Username: username,
                Password: password,
                IsAdmin: isAdmin
            };
            
            // Call the API to register the user
            const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USER}/register`, 'POST', userData);
            
            if (response) {
                // Show success message
                showMessage('registerMessage', '¡Registro exitoso! Ahora puede iniciar sesión.', 'success');
                
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
            showMessage('registerMessage', error.message || 'Error al registrar usuario.', 'error');
            console.error('Error al registrar usuario:', error);
        }
    }
});