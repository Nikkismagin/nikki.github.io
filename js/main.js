import { validateAllFields } from './validation.js';
import { addParticipant, updateParticipantsList, updateCounters } from './participants.js';
import { formatPhoneNumber } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация
    initializeForm();
    initializePhoneMask();
    initializeReportToggle();

    // Загрузка сохраненных данных
    updateParticipantsList();
    updateCounters();

    // Обработчик отправки формы
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', handleFormSubmit);

    // Обработчик сброса формы
    form.addEventListener('reset', handleFormReset);

    // Реальная валидация при вводе
    setupRealTimeValidation();
});

function initializeForm() {
    // Устанавливаем максимальную дату рождения как сегодня
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birthDate').setAttribute('max', today);
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }

        let formattedValue = '+7';

        if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formattedValue += '-' + value.substring(8, 10);
        }

        e.target.value = formattedValue;

        // Устанавливаем курсор в конец
        setTimeout(() => {
            e.target.setSelectionRange(formattedValue.length, formattedValue.length);
        }, 0);
    });

    // Обработка вставки
    phoneInput.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const digits = pastedText.replace(/\D/g, '');

        if (digits.startsWith('7') || digits.startsWith('8')) {
            this.value = formatPhoneNumber(digits);
        } else if (digits.length > 0) {
            this.value = formatPhoneNumber('7' + digits);
        }
    });
}

function initializeReportToggle() {
    const reportYes = document.getElementById('reportYes');
    const reportNo = document.getElementById('reportNo');
    const topicField = document.getElementById('topicField');

    function toggleTopicField() {
        if (reportYes.checked) {
            topicField.style.display = 'block';
            topicField.style.animation = 'fadeIn 0.5s ease';
        } else {
            topicField.style.display = 'none';
        }
    }

    reportYes.addEventListener('change', toggleTopicField);
    reportNo.addEventListener('change', toggleTopicField);

    // Инициализация при загрузке
    toggleTopicField();
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateAllFields()) {
        // Находим первую ошибку и фокусируемся на ней
        const firstError = document.querySelector('.validation-error[style*="display: block"]');
        if (firstError) {
            const inputId = firstError.id.replace('Error', '');
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.focus();
            }
        }
        return;
    }

    // Собираем данные формы
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

    // Добавляем участника
    addParticipant(formData);

    // Показываем сообщение об успехе
    alert('Регистрация прошла успешно!');

    // Сбрасываем форму
    document.getElementById('registrationForm').reset();

    // Скрываем поле темы доклада
    document.getElementById('topicField').style.display = 'none';

    // Очищаем все ошибки
    document.querySelectorAll('.validation-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    // Удаляем классы ошибок/успеха
    document.querySelectorAll('input, select').forEach(element => {
        element.classList.remove('error', 'success');
    });
}

function handleFormReset() {
    // Очищаем все ошибки
    document.querySelectorAll('.validation-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    // Удаляем классы ошибок/успеха
    document.querySelectorAll('input, select').forEach(element => {
        element.classList.remove('error', 'success');
    });

    // Скрываем поле темы доклада
    document.getElementById('topicField').style.display = 'none';

    // Сбрасываем телефон на +7
    document.getElementById('phone').value = '+7';
}

function setupRealTimeValidation() {
    // Фамилия
    document.getElementById('lastName').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateLastName());
    });

    // Имя
    document.getElementById('firstName').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateFirstName());
    });

    // Отчество
    document.getElementById('middleName').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateMiddleName());
    });

    // Телефон
    document.getElementById('phone').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validatePhone());
    });

    // Email
    document.getElementById('email').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateEmail());
    });

    // Дата рождения
    document.getElementById('birthDate').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateBirthDate());
    });

    // Секция
    document.getElementById('section').addEventListener('change', () => {
        import('./validation.js').then(module => module.validateSection());
    });

    // Доклад
    document.querySelectorAll('input[name="hasReport"]').forEach(radio => {
        radio.addEventListener('change', () => {
            import('./validation.js').then(module => module.validateReport());
        });
    });

    // Тема доклада
    document.getElementById('topic').addEventListener('blur', () => {
        import('./validation.js').then(module => module.validateReport());
    });
}