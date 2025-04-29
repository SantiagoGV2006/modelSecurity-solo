/**
 * SecurityPQR System - Formularios Page JavaScript
 */

// Variables globales
let formsData = [];
let modulesData = [];
let formModulesData = [];

// Obtener todos los formularios
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
        showToast('Error', 'No se pudieron cargar los formularios', 'error');
    }
}

// Obtener todos los módulos
async function getAllModules() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.MODULES);
        modulesData = data;
        hideLoading();
        return data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        hideLoading();
        showToast('Error', 'No se pudieron cargar los módulos', 'error');
        return [];
    }
}

// Obtener todas las asociaciones de formularios y módulos
async function getAllFormModules() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.FORM_MODULES);
        formModulesData = data;
        renderFormModulesTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching form modules:', error);
        hideLoading();
        showToast('Error', 'No se pudieron cargar las asociaciones de formularios y módulos', 'error');
    }
}

// Renderizar tabla de formularios
function renderFormsTable(forms) {
    const tableBody = document.getElementById('forms-table-body');
    
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
        row.className = 'fade-in';
        
        // Crear celdas de la tabla
        row.innerHTML = `
            <td>${form.id}</td>
            <td>${form.name}</td>
            <td>${form.code}</td>
            <td><span class="badge ${form.active ? 'bg-success' : 'bg-danger'}">${form.active ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatDate(form.createAt)}</td>
            <td></td>
        `;
        
        // Agregar botones de acción
        const actionsCell = row.cells[5];
        const actionButtons = document.createElement('div');
        actionButtons.className = 'table-actions';
        
        // Botón de editar
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar';
        editBtn.onclick = () => editForm(form.id);
        
        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => confirmDeleteForm(form.id, form.name);
        
        // Agregar botones al contenedor
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(deleteBtn);
        
        // Agregar botones a la celda
        actionsCell.appendChild(actionButtons);
        
        // Agregar fila a la tabla
        tableBody.appendChild(row);
    });
}

// Renderizar tabla de asociaciones de formularios y módulos
function renderFormModulesTable(formModules) {
    const tableBody = document.getElementById('form-modules-table-body');
    
    tableBody.innerHTML = '';
    
    if (formModules.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay asociaciones registradas</td>
            </tr>
        `;
        return;
    }
    
    formModules.forEach(formModule => {
        // Obtener datos del formulario y módulo asociados
        const form = formsData.find(f => f.id === formModule.formId);
        const module = modulesData.find(m => m.id === formModule.moduleId);
        
        const formName = form ? form.name : `Formulario #${formModule.formId}`;
        const moduleCode = module ? module.code : `Módulo #${formModule.moduleId}`;
        
        const row = document.createElement('tr');
        row.className = 'fade-in';
        
        // Crear celdas de la tabla
        row.innerHTML = `
            <td>${formModule.id}</td>
            <td>${formName}</td>
            <td>${moduleCode}</td>
            <td>${formatDate(formModule.createAt)}</td>
            <td></td>
        `;
        
        // Agregar botones de acción
        const actionsCell = row.cells[4];
        const actionButtons = document.createElement('div');
        actionButtons.className = 'table-actions';
        
        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => confirmDeleteFormModule(formModule.id, `${formName} - ${moduleCode}`);
        
        // Agregar botones al contenedor
        actionButtons.appendChild(deleteBtn);
        
        // Agregar botones a la celda
        actionsCell.appendChild(actionButtons);
        
        // Agregar fila a la tabla
        tableBody.appendChild(row);
    });
}

// Editar formulario
async function editForm(formId) {
    try {
        showLoading();
        const form = await apiRequest(API_ENDPOINTS.FORM_BY_ID(formId));
        
        // Llenar modal con datos del formulario
        document.getElementById('formModalTitle').textContent = 'Editar Formulario';
        document.getElementById('form-id').value = form.id;
        document.getElementById('form-name').value = form.name;
        document.getElementById('form-code').value = form.code;
        document.getElementById('form-active').checked = form.active;
        
        // Mostrar modal
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching form for edit:', error);
        hideLoading();
        showToast('Error', 'No se pudo cargar el formulario', 'error');
    }
}

// Añadir nuevo formulario
function addNewForm() {
    // Reiniciar formulario
    document.getElementById('formForm').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-active').checked = true;
    
    // Establecer título del modal
    document.getElementById('formModalTitle').textContent = 'Agregar Formulario';
    
    // Mostrar modal
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();
}

// Guardar formulario (crear o actualizar)
async function saveForm() {
    try {
        showLoading();
        const formId = document.getElementById('form-id').value;
        const isUpdate = formId !== '';
        
        // Recopilar datos del formulario
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
        
        // Cerrar modal
        const formModal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
        formModal.hide();
        
        // Expandir la tarjeta de formularios
        expandCardById('forms-list-card');
        
        // Refrescar lista de formularios
        await getAllForms();
        hideLoading();
    } catch (error) {
        console.error('Error saving form:', error);
        hideLoading();
        showToast('Error', 'No se pudo guardar el formulario', 'error');
    }
}

// Confirmar eliminación de formulario
function confirmDeleteForm(formId, formName) {
    // Configurar modal de confirmación de eliminación
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el formulario ${formName}?`;
    
    // Configurar botón de eliminar
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteForm(formId, isPermanent);
        
        // Cerrar modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Mostrar modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Eliminar formulario
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
        
        // Refrescar lista de formularios
        await getAllForms();
        hideLoading();
    } catch (error) {
        console.error('Error deleting form:', error);
        hideLoading();
        showToast('Error', 'No se pudo eliminar el formulario', 'error');
    }
}

// Cargar formularios y módulos en los selectores del modal de asociación
async function loadFormModuleSelectors() {
    try {
        // Cargar formularios en el selector
        const formSelect = document.getElementById('form-module-formId');
        formSelect.innerHTML = '<option value="">Seleccione un formulario</option>';
        
        formsData.forEach(form => {
            if (form.active) {
                const option = document.createElement('option');
                option.value = form.id;
                option.textContent = `${form.name} (${form.code})`;
                formSelect.appendChild(option);
            }
        });
        
        // Cargar módulos en el selector
        const moduleSelect = document.getElementById('form-module-moduleId');
        moduleSelect.innerHTML = '<option value="">Seleccione un módulo</option>';
        
        modulesData.forEach(module => {
            if (module.active) {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = module.code;
                moduleSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading selectors:', error);
        showToast('Error', 'No se pudieron cargar los selectores', 'error');
    }
}

// Añadir nueva asociación de formulario y módulo
async function addNewFormModule() {
    try {
        // Reiniciar formulario
        document.getElementById('formModuleForm').reset();
        document.getElementById('form-module-id').value = '';
        
        // Cargar selectores
        await loadFormModuleSelectors();
        
        // Mostrar modal
        const formModuleModal = new bootstrap.Modal(document.getElementById('formModuleModal'));
        formModuleModal.show();
    } catch (error) {
        console.error('Error preparing form module modal:', error);
        showToast('Error', 'No se pudo preparar el formulario de asociación', 'error');
    }
}

// Guardar asociación de formulario y módulo
async function saveFormModule() {
    try {
        showLoading();
        
        // Recopilar datos del formulario
        const formModuleData = {
            formId: parseInt(document.getElementById('form-module-formId').value),
            moduleId: parseInt(document.getElementById('form-module-moduleId').value)
        };
        
        // Validar datos
        if (!formModuleData.formId || !formModuleData.moduleId) {
            showToast('Error', 'Debe seleccionar un formulario y un módulo', 'error');
            hideLoading();
            return;
        }
        
        // Verificar si ya existe la asociación
        const existingFormModule = formModulesData.find(
            fm => fm.formId === formModuleData.formId && fm.moduleId === formModuleData.moduleId
        );
        
        if (existingFormModule) {
            showToast('Error', 'Esta asociación ya existe', 'error');
            hideLoading();
            return;
        }
        
        // Crear asociación
        await apiRequest(API_ENDPOINTS.FORM_MODULES, 'POST', formModuleData);
        showToast('Éxito', 'Asociación creada correctamente', 'success');
        
        // Cerrar modal
        const formModuleModal = bootstrap.Modal.getInstance(document.getElementById('formModuleModal'));
        formModuleModal.hide();
        
        // Expandir la tarjeta de asociaciones
        expandCardById('form-modules-card');
        
        // Refrescar lista de asociaciones
        await getAllFormModules();
        hideLoading();
    } catch (error) {
        console.error('Error saving form module:', error);
        hideLoading();
        showToast('Error', 'No se pudo guardar la asociación', 'error');
    }
}

// Confirmar eliminación de asociación
function confirmDeleteFormModule(formModuleId, formModuleName) {
    // Configurar modal de confirmación de eliminación
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar la asociación ${formModuleName}?`;
    
    // Configurar botón de eliminar
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteFormModule(formModuleId, isPermanent);
        
        // Cerrar modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Mostrar modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Eliminar asociación
async function deleteFormModule(formModuleId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.FORM_MODULE_PERMANENT_DELETE(formModuleId) 
            : API_ENDPOINTS.FORM_MODULE_BY_ID(formModuleId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Asociación eliminada permanentemente' : 'Asociación eliminada correctamente', 
            'success'
        );
        
        // Refrescar lista de asociaciones
        await getAllFormModules();
        hideLoading();
    } catch (error) {
        console.error('Error deleting form module:', error);
        hideLoading();
        showToast('Error', 'No se pudo eliminar la asociación', 'error');
    }
}

// Inicializar búsqueda para la tabla de formularios
function initFormsSearch() {
    const searchInput = document.getElementById('formularios-search');
    const tableBody = document.getElementById('forms-table-body');
    
    if (searchInput && tableBody) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = tableBody.querySelectorAll('tr');
            
            if (rows.length > 0 && rows[0].cells.length > 1) {
                rows.forEach(row => {
                    // Buscar en nombre y código (columnas 1 y 2)
                    const name = row.cells[1].textContent.toLowerCase();
                    const code = row.cells[2].textContent.toLowerCase();
                    
                    const matches = name.includes(searchTerm) || code.includes(searchTerm);
                    
                    row.style.display = matches ? '' : 'none';
                });
            }
        });
    }
}

// Inicializar búsqueda para la tabla de asociaciones
function initFormModulesSearch() {
    const searchInput = document.getElementById('form-modules-search');
    const tableBody = document.getElementById('form-modules-table-body');
    
    if (searchInput && tableBody) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = tableBody.querySelectorAll('tr');
            
            if (rows.length > 0 && rows[0].cells.length > 1) {
                rows.forEach(row => {
                    // Buscar en nombre de formulario y código de módulo (columnas 1 y 2)
                    const formName = row.cells[1].textContent.toLowerCase();
                    const moduleCode = row.cells[2].textContent.toLowerCase();
                    
                    const matches = formName.includes(searchTerm) || moduleCode.includes(searchTerm);
                    
                    row.style.display = matches ? '' : 'none';
                });
            }
        });
    }
}

// Inicializar página de formularios
async function initFormsPage() {
    // Verificar autenticación
    if (!checkAuth()) return;
    
    // Configurar listeners de eventos
    document.getElementById('form-add-btn').addEventListener('click', addNewForm);
    document.getElementById('saveFormBtn').addEventListener('click', saveForm);
    document.getElementById('form-module-add-btn').addEventListener('click', addNewFormModule);
    document.getElementById('saveFormModuleBtn').addEventListener('click', saveFormModule);
    
    // Inicializar búsqueda en tablas
    initFormsSearch();
    initFormModulesSearch();
    
    // Configurar botón de cierre de sesión
    initLogoutButton();
    
    // Cargar datos iniciales
    await getAllForms();
    await getAllModules();
    await getAllFormModules();
}

// Inicializar cuando el documento esté listo
onDocumentReady(initFormsPage);