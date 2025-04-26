/**
 * SecurityPQR System - Dashboard Page JavaScript
 */

// Get counts for dashboard cards
async function loadDashboardCounts() {
    try {
        // Get client count
        const clients = await apiRequest(API_ENDPOINTS.CLIENTS);
        updateClientCount(clients.length);
        
        // Get PQR count
        const pqrs = await apiRequest(API_ENDPOINTS.PQRS);
        updatePqrCount(pqrs.length);
        
        // Get worker count
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        updateWorkerCount(workers.length);
        
        // Get user count
        const users = await apiRequest(API_ENDPOINTS.USERS);
        updateUserCount(users.length);
    } catch (error) {
        console.error('Error loading dashboard counts:', error);
    }
}

// Update client count in dashboard
function updateClientCount(count) {
    const countElement = document.getElementById('client-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Update PQR count in dashboard
function updatePqrCount(count) {
    const countElement = document.getElementById('pqr-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Update worker count in dashboard
function updateWorkerCount(count) {
    const countElement = document.getElementById('worker-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Update user count in dashboard
function updateUserCount(count) {
    const countElement = document.getElementById('user-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Load recent PQRs for dashboard
async function loadRecentPqrs() {
    try {
        const pqrs = await apiRequest(API_ENDPOINTS.PQRS);
        const recentPqrsTable = document.getElementById('recent-pqrs');
        
        if (!recentPqrsTable) return;
        
        if (pqrs.length === 0) {
            recentPqrsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay PQRs registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent PQRs (sorted by creation date)
        const sortedPqrs = pqrs.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        const recentPqrs = sortedPqrs.slice(0, 5);
        recentPqrsTable.innerHTML = '';
        
        recentPqrs.forEach(pqr => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pqr.pqrId}</td>
                <td>${pqr.pqrType}</td>
                <td>${pqr.clientName || 'Cliente ' + pqr.clientId}</td>
                <td></td>
                <td>${formatDate(pqr.creationDate)}</td>
                <td></td>
            `;
            
            // Add status badge
            const statusCell = row.cells[3];
            statusCell.appendChild(createStatusBadge(pqr.pqrStatus));
            
            // Add action buttons
            const actionsCell = row.cells[5];
            const actionButtons = createActionButtons({
                view: () => window.location.href = `pqrs.html?id=${pqr.pqrId}&action=view`
            });
            
            actionsCell.appendChild(actionButtons);
            recentPqrsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent PQRs:', error);
    }
}

// Load recent clients for dashboard
async function loadRecentClients() {
    try {
        const clients = await apiRequest(API_ENDPOINTS.CLIENTS);
        const recentClientsTable = document.getElementById('recent-clients');
        
        if (!recentClientsTable) return;
        
        if (clients.length === 0) {
            recentClientsTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay clientes registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent clients (we'll assume IDs are in ascending order by date)
        const sortedClients = clients.sort((a, b) => b.clientId - a.clientId);
        const recentClients = sortedClients.slice(0, 5);
        recentClientsTable.innerHTML = '';
        
        recentClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.clientId}</td>
                <td>${client.firstName} ${client.lastName}</td>
                <td>${client.identityDocument}</td>
                <td></td>
            `;
            
            // Add action buttons
            const actionsCell = row.cells[3];
            const actionButtons = createActionButtons({
                view: () => window.location.href = `clientes.html?id=${client.clientId}&action=view`
            });
            
            actionsCell.appendChild(actionButtons);
            recentClientsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent clients:', error);
    }
}

// Load recent workers for dashboard
async function loadRecentWorkers() {
    try {
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        const recentWorkersTable = document.getElementById('recent-workers');
        
        if (!recentWorkersTable) return;
        
        if (workers.length === 0) {
            recentWorkersTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay empleados registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent workers (we'll assume IDs are in ascending order by date)
        const sortedWorkers = workers.sort((a, b) => b.workerId - a.workerId);
        const recentWorkers = sortedWorkers.slice(0, 5);
        recentWorkersTable.innerHTML = '';
        
        recentWorkers.forEach(worker => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${worker.workerId}</td>
                <td>${worker.firstName} ${worker.lastName}</td>
                <td>${worker.jobTitle}</td>
                <td></td>
            `;
            
            // Add action buttons
            const actionsCell = row.cells[3];
            const actionButtons = createActionButtons({
                view: () => window.location.href = `empleados.html?id=${worker.workerId}&action=view`
            });
            
            actionsCell.appendChild(actionButtons);
            recentWorkersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent workers:', error);
    }
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        showLoading();
        
        // Check authentication
        if (!checkAuth()) return;
        
        // Set up logout button
        initLogoutButton();
        
        // Load user info from localStorage
        const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            document.getElementById('user-info').textContent = `Usuario: ${userInfo.name}`;
        }
        
        // Load all dashboard data
        await Promise.all([
            loadDashboardCounts(),
            loadRecentPqrs(),
            loadRecentClients(),
            loadRecentWorkers()
        ]);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        hideLoading();
    }
}

// Initialize dashboard page
function initDashboardPage() {
    loadDashboardData();
}

// Initialize when document is ready
onDocumentReady(initDashboardPage);