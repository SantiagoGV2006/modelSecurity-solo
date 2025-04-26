/**
 * SecurityPQR System - Login Page JavaScript
 */

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!username || !password) {
        showToast('Error', 'Por favor ingrese usuario y contraseña', 'error');
        return;
    }
    
    try {
        showLoading();
        
        // En una aplicación real, aquí se haría una llamada a la API de autenticación
        // Para esta demostración, simulamos una autenticación exitosa
        
        // Simulate API call with a delay
        setTimeout(() => {
            // Store auth token and user info in local storage
            const token = 'mock_jwt_token';
            const userInfo = {
                id: 1,
                username: username,
                name: 'Administrador',
                role: 'Admin'
            };
            
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
            
            if (rememberMe) {
                localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
            } else {
                localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            }
            
            // Redirect to home page
            window.location.href = 'index.html';
            
            hideLoading();
        }, 1000);
    } catch (error) {
        hideLoading();
        console.error('Login error:', error);
        showToast('Error de Autenticación', 'Usuario o contraseña incorrectos', 'error');
    }
}

// Handle forgot password link
function handleForgotPassword(event) {
    event.preventDefault();
    showToast('Info', 'La funcionalidad de recuperación de contraseña no está disponible en esta demostración', 'info');
}

// Initialize login page
function initLoginPage() {
    // Set up event listeners
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
    
    // Set up password toggle
    setupPasswordToggle('login-password', 'toggleLoginPasswordBtn');
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// Initialize when document is ready
onDocumentReady(initLoginPage);