document.addEventListener('DOMContentLoaded', function() {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    
    // Add submit event to the form
    loginForm.addEventListener('submit', handleLoginSubmit);
    
    /**
     * Handles login form submission
     */
    async function handleLoginSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate fields
        if (!username || !password) {
            showMessage('loginMessage', 'Por favor, complete todos los campos.', 'error');
            return;
        }
        
        try {
            showMessage('loginMessage', 'Iniciando sesión...', 'info');
            
            const loginData = {
                Username: username,
                Password: password
            };
            
            // Call the authentication API
            const response = await apiRequest(`${API_CONFIG.ENDPOINTS.LOGIN}/authenticate`, 'POST', loginData);
            
            if (response) {
                // Save user data
                saveToStorage('user', response);
                
                // Show success message
                showMessage('loginMessage', '¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (error) {
            showMessage('loginMessage', error.message || 'Error al iniciar sesión. Inténtelo de nuevo.', 'error');
            console.error('Error al iniciar sesión:', error);
        }
    }
});