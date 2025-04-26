/**
 * SecurityPQR System - Formularios Page JavaScript
 */

// Variables globales
let formsData = [];

// Get all forms
async function getAllForms() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.FORMS);
        formsData = data;
        renderFormsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching forms:', error);
        hideLoading();
    }
}

// Render forms table
function renderFormsTable(forms) {
    const tableBody = document.getElementById('forms-table');
    
    tableBody.innerHTML = '';
    
    if (forms.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay formularios registrados</td>
            </tr>
        `;
        return;
    }
    
    forms.forEach(form => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${form.id}</td>
            <td>${form.name}</td>
            <td>${form.code}</td>
            <td></td>
            <td>${formatDate(form.createAt)}</td>
            <td></td>
        `;
        
        // Add status badge
        const statusCell = row.cells[3];
        statusCell.appendChild(createStatusBadge(form.active));
        
        // Add action buttons
        const actionsCell = row.cells[5];
        const actionButtons = createActionButtons({
            edit: () => editForm(form.id),
            delete: () => confirmDeleteForm(form.id, form.name)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit form
async function editForm(formId) {
    try {
        showLoading();
        const form = await apiRequest(API_ENDPOINTS.FORM_BY_ID(formId));
        
        // Populate modal with form data
        document.getElementById('formModalTitle').textContent = 'Editar Formulario';
        document.getElementById('form-id').value = form.id;
        document.getElementById('form-name').value = form.name;
        document.getElementById('form-code').value = form.code;
        document.getElementById('form-active').checked = form.active;
        
        // Show modal
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching form for edit:', error);
        hideLoading();
    }
}

// Add new form
function addNewForm() {
    // Reset form
    document.getElementById('formForm').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-active').checked = true;
    
    // Set modal title
    document.getElementById('formModalTitle').textContent = 'Agregar Formulario';
    
    // Show modal
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();
}

// Save form (create or update)
async function saveForm() {
    try {
        showLoading();
        const formId = document.getElementById('form-id').value;
        const isUpdate = formId !== '';
        
        // Collect form data
        const formData = {
            name: document.getElementById('form-name').value,
            code: document.getElementById('form-code').value,
            active: document.getElementById('form-active').checked
        };
        
        if (isUpdate) {
            formData.id = parseInt(formId);
            await apiRequest(API_ENDPOINTS.FORMS, 'PUT', formData);
            showToast('Éxito', 'Formulario actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.FORMS, 'POST', formData);
            showToast('Éxito', 'Formulario creado correctamente', 'success');
        }
        
        // Close modal
        const formModal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
        formModal.hide();
        
        // Refresh forms list
        await getAllForms();
        hideLoading();
    } catch (error) {
        console.error('Error saving form:', error);
        hideLoading();
    }
}

// Confirm delete form
function confirmDeleteForm(formId, formName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el formulario ${formName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteForm(formId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete form
async function deleteForm(formId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.FORM_PERMANENT_DELETE(formId) 
            : API_ENDPOINTS.FORM_BY_ID(formId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Formulario eliminado permanentemente' : 'Formulario eliminado correctamente', 
            'success'
        );
        
        // Refresh forms list
        await getAllForms();
        hideLoading();
    } catch (error) {
        console.error('Error deleting form:', error);
        hideLoading();
    }
}

// Initialize forms page
function initFormsPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('form-add-btn').addEventListener('click', addNewForm);
    document.getElementById('saveFormBtn').addEventListener('click', saveForm);
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllForms();
}

// Initialize when document is ready
onDocumentReady(initFormsPage);