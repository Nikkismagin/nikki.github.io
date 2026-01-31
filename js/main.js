import { validateAllFields } from './validation.js';
import { addParticipant, updateParticipantsList, updateCounters } from './participants.js';
import { formatPhoneNumber } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, инициализация приложения...');

    initializeForm();
    initializePhoneMask();
    initializeReportToggle();

    updateParticipantsList();
    updateCounters();

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        form.addEventListener('reset', handleFormReset);
        console.log('Обработчики формы установлены');
    } else {
        console.error('Форма не найдена!');
    }

    setupRealTimeValidation();
    setupAutoSave();

    console.log('Приложение инициализировано');
});

function initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.setAttribute('max', today);
        birthDateInput.value = ''; // Очищаем значение по умолчанию
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value === '') {
        phoneInput.value = '+7';
    }
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }

        let formattedValue = '+7';

        if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, Math.min(3, value.length));
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.substring(3, Math.min(6, value.length));
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.substring(6, Math.min(8, value.length));
        }
        if (value.length >= 9) {
            formattedValue += '-' + value.substring(8, Math.min(10, value.length));
        }

        e.target.value = formattedValue;

        setTimeout(() => {
            e.target.setSelectionRange(formattedValue.length, formattedValue.length);
        }, 0);
    });

    phoneInput.addEventListener('blur', function () {
        if (this.value === '+7' || this.value === '+7 (' || this.value === '+7 ()') {
            this.value = '+7';
        }
    });

    phoneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '+7') {
            e.preventDefault();
        }
    });
}

function initializeReportToggle() {
    const reportYes = document.getElementById('reportYes');
    const reportNo = document.getElementById('reportNo');
    const topicField = document.getElementById('topicField');
    const topicInput = document.getElementById('topic');

    if (!reportYes || !reportNo || !topicField) return;

    function toggleTopicField() {
        if (reportYes.checked) {
            topicField.style.display = 'block';
            setTimeout(() => {
                topicField.style.opacity = '1';
                topicField.style.transform = 'translateY(0)';
            }, 10);
            if (topicInput) {
                topicInput.required = true;
            }
        } else {
            topicField.style.opacity = '0';
            topicField.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                topicField.style.display = 'none';
            }, 300);
            if (topicInput) {
                topicInput.required = false;
                topicInput.value = '';
            }
        }
    }

    reportYes.addEventListener('change', toggleTopicField);
    reportNo.addEventListener('change', toggleTopicField);

    toggleTopicField();
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Отправка формы...');

    if (!validateAllFields()) {
        console.log('Валидация не прошла');
        const firstError = document.querySelector('.validation-error[style*="display: block"]');
        if (firstError) {
            const inputId = firstError.id.replace('Error', '');
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.focus();
                inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        return;
    }

    const formData = {
        lastName: document.getElementById('lastName').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        birthDate: document.getElementById('birthDate').value || null,
        section: document.getElementById('section').value,
        hasReport: document.querySelector('input[name="hasReport"]:checked').value,
        topic: document.getElementById('reportYes').checked ?
            document.getElementById('topic').value.trim() : null
    };

    console.log('Данные формы:', formData);

    const newParticipant = addParticipant(formData);
    console.log('Новый участник добавлен:', newParticipant);

    showSuccessMessage();

    form.reset();
    document.getElementById('phone').value = '+7';

    document.querySelectorAll('.validation-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    document.querySelectorAll('input, select').forEach(element => {
        element.classList.remove('error', 'success');
    });

    initializeReportToggle();
}

function handleFormReset() {
    console.log('Сброс формы');

    document.querySelectorAll('.validation-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    document.querySelectorAll('input, select').forEach(element => {
        element.classList.remove('error', 'success');
    });

    document.getElementById('phone').value = '+7';

    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.value = '';
    }

    initializeReportToggle();
}

function setupRealTimeValidation() {
    const fields = [
        { id: 'lastName', validator: 'validateLastName' },
        { id: 'firstName', validator: 'validateFirstName' },
        { id: 'middleName', validator: 'validateMiddleName' },
        { id: 'phone', validator: 'validatePhone' },
        { id: 'email', validator: 'validateEmail' },
        { id: 'birthDate', validator: 'validateBirthDate' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('blur', () => {
                import('./validation.js').then(module => {
                    module[field.validator]();
                });
            });

            element.addEventListener('input', () => {
                const errorElement = document.getElementById(field.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                    element.classList.remove('error');
                }
            });
        }
    });

    const sectionSelect = document.getElementById('section');
    if (sectionSelect) {
        sectionSelect.addEventListener('change', () => {
            import('./validation.js').then(module => {
                module.validateSection();
            });
        });
    }

    const reportRadios = document.querySelectorAll('input[name="hasReport"]');
    reportRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            import('./validation.js').then(module => {
                module.validateReport();
            });
        });
    });

    const topicInput = document.getElementById('topic');
    if (topicInput) {
        topicInput.addEventListener('blur', () => {
            import('./validation.js').then(module => {
                module.validateReport();
            });
        });

        topicInput.addEventListener('input', () => {
            const errorElement = document.getElementById('topicError');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                topicInput.classList.remove('error');
            }
        });
    }
}

function setupAutoSave() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const formFields = form.querySelectorAll('input, select');
    const autoSaveKey = 'conferenceFormDraft';

    formFields.forEach(field => {
        field.addEventListener('input', saveFormDraft);
        field.addEventListener('change', saveFormDraft);
    });

    function saveFormDraft() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        localStorage.setItem(autoSaveKey, JSON.stringify(data));
    }

    function loadFormDraft() {
        const savedData = localStorage.getItem(autoSaveKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const element = form.querySelector(`[name="${key}"]`);
                    if (element) {
                        if (element.type === 'radio') {
                            const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                            if (radio) radio.checked = true;
                        } else {
                            element.value = data[key];
                        }
                    }
                });

                if (data.hasReport === 'yes') {
                    initializeReportToggle();
                }

                console.log('Черновик формы загружен');
            } catch (e) {
                console.error('Ошибка загрузки черновика:', e);
            }
        }
    }

    form.addEventListener('submit', () => {
        localStorage.removeItem(autoSaveKey);
    });

    form.addEventListener('reset', () => {
        localStorage.removeItem(autoSaveKey);
    });

    setTimeout(loadFormDraft, 100);
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
            Регистрация прошла успешно!
        </div>
    `;

    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 3000);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}