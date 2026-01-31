import { getCurrentDate, showError, clearError, showSuccess, validateRussianName, validateEmailFormat } from './utils.js';

export function validateLastName() {
    const lastNameInput = document.getElementById('lastName');
    const lastNameValue = lastNameInput.value.trim();

    if (!lastNameValue) {
        showError('lastNameError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!validateRussianName(lastNameValue)) {
        showError('lastNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('lastNameError');
    showSuccess('lastName');
    return true;
}

export function validateFirstName() {
    const firstNameInput = document.getElementById('firstName');
    const firstNameValue = firstNameInput.value.trim();

    if (!firstNameValue) {
        showError('firstNameError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!validateRussianName(firstNameValue)) {
        showError('firstNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('firstNameError');
    showSuccess('firstName');
    return true;
}

export function validateMiddleName() {
    const middleNameInput = document.getElementById('middleName');
    const middleNameValue = middleNameInput.value.trim();

    if (!middleNameValue) {
        showError('middleNameError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!validateRussianName(middleNameValue)) {
        showError('middleNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('middleNameError');
    showSuccess('middleName');
    return true;
}

export function validatePhone() {
    const phoneInput = document.getElementById('phone');
    let phoneValue = phoneInput.value.trim();

    if (!phoneValue || phoneValue === '+7') {
        showError('phoneError', 'Поле обязательно для заполнения');
        return false;
    }

    const digitsOnly = phoneValue.replace(/\D/g, '');

    if (digitsOnly.length < 11) {
        showError('phoneError', 'Введите корректный номер телефона');
        return false;
    }

    if (!digitsOnly.startsWith('7') && !digitsOnly.startsWith('8')) {
        showError('phoneError', 'Номер должен начинаться с 7 или 8');
        return false;
    }

    clearError('phoneError');
    showSuccess('phone');
    return true;
}

export function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();

    if (!emailValue) {
        showError('emailError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!validateEmailFormat(emailValue)) {
        showError('emailError', 'Введите корректный email (только латинские буквы)');
        return false;
    }

    clearError('emailError');
    showSuccess('email');
    return true;
}

export function validateBirthDate() {
    const birthDateInput = document.getElementById('birthDate');
    const birthDateValue = birthDateInput.value;

    if (!birthDateValue) {
        return true;
    }

    const currentDate = getCurrentDate();
    const birthDate = new Date(birthDateValue);
    const today = new Date(currentDate);

    if (birthDate > today) {
        // Создаем элемент ошибки, если его нет
        let errorElement = document.getElementById('birthDateError');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'birthDateError';
            errorElement.className = 'validation-error';
            birthDateInput.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = 'Дата рождения не может быть в будущем';
        errorElement.style.display = 'block';
        birthDateInput.classList.add('error');
        return false;
    }

    const errorElement = document.getElementById('birthDateError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    birthDateInput.classList.remove('error');
    return true;
}

export function validateSection() {
    const sectionInput = document.getElementById('section');
    const sectionValue = sectionInput.value;

    if (!sectionValue) {
        showError('sectionError', 'Выберите секцию конференции');
        return false;
    }

    clearError('sectionError');
    showSuccess('section');
    return true;
}

export function validateReport() {
    const reportYes = document.getElementById('reportYes');
    const reportNo = document.getElementById('reportNo');

    if (!reportYes.checked && !reportNo.checked) {
        showError('reportError', 'Выберите один из вариантов');
        return false;
    }

    clearError('reportError');

    if (reportYes.checked) {
        const topicInput = document.getElementById('topic');
        const topicValue = topicInput.value.trim();

        if (!topicValue) {
            showError('topicError', 'Поле обязательно для заполнения');
            return false;
        }

        clearError('topicError');
        showSuccess('topic');
    } else {
        clearError('topicError');
        const topicInput = document.getElementById('topic');
        if (topicInput) {
            topicInput.classList.remove('error', 'success');
        }
    }

    return true;
}

export function validateAllFields() {
    const validations = [
        validateLastName(),
        validateFirstName(),
        validateMiddleName(),
        validatePhone(),
        validateEmail(),
        validateBirthDate(),
        validateSection(),
        validateReport()
    ];

    return validations.every(validation => validation === true);
}