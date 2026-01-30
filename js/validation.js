import { getCurrentDate, showError, clearError } from './utils.js';

export function validateLastName(lastName) {
    const lastNameInput = document.getElementById('lastName');
    const lastNameValue = lastNameInput.value.trim();

    if (!lastNameValue) {
        showError('lastNameError', 'Поле обязательно для заполнения');
        return false;
    }

    // Проверка на русские буквы и дефис
    if (!/^[А-ЯЁа-яё\-]+$/.test(lastNameValue)) {
        showError('lastNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('lastNameError');
    return true;
}

export function validateFirstName(firstName) {
    const firstNameInput = document.getElementById('firstName');
    const firstNameValue = firstNameInput.value.trim();

    if (!firstNameValue) {
        showError('firstNameError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!/^[А-ЯЁа-яё\-]+$/.test(firstNameValue)) {
        showError('firstNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('firstNameError');
    return true;
}

export function validateMiddleName(middleName) {
    const middleNameInput = document.getElementById('middleName');
    const middleNameValue = middleNameInput.value.trim();

    if (!middleNameValue) {
        showError('middleNameError', 'Поле обязательно для заполнения');
        return false;
    }

    if (!/^[А-ЯЁа-яё\-]+$/.test(middleNameValue)) {
        showError('middleNameError', 'Только русские буквы и дефис');
        return false;
    }

    clearError('middleNameError');
    return true;
}

export function validatePhone(phone) {
    const phoneInput = document.getElementById('phone');
    let phoneValue = phoneInput.value.trim();

    if (!phoneValue) {
        showError('phoneError', 'Поле обязательно для заполнения');
        return false;
    }

    // Удаляем все нецифровые символы для проверки
    const digitsOnly = phoneValue.replace(/\D/g, '');

    // Проверяем, что есть хотя бы 11 цифр (с кодом страны)
    if (digitsOnly.length < 11) {
        showError('phoneError', 'Введите корректный номер телефона');
        return false;
    }

    // Проверяем, что номер начинается с 7 или 8
    if (!digitsOnly.startsWith('7') && !digitsOnly.startsWith('8')) {
        showError('phoneError', 'Номер должен начинаться с 7 или 8');
        return false;
    }

    clearError('phoneError');
    return true;
}

export function validateEmail(email) {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();

    if (!emailValue) {
        showError('emailError', 'Поле обязательно для заполнения');
        return false;
    }

    // Проверка на английские буквы, цифры, точки, дефисы и наличие @ с доменом
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailValue)) {
        showError('emailError', 'Введите корректный email (только латинские буквы)');
        return false;
    }

    clearError('emailError');
    return true;
}

export function validateBirthDate() {
    const birthDateInput = document.getElementById('birthDate');
    const birthDateValue = birthDateInput.value;

    // Дата рождения не обязательна
    if (!birthDateValue) {
        return true;
    }

    const currentDate = getCurrentDate();
    const birthDate = new Date(birthDateValue);
    const today = new Date(currentDate);

    if (birthDate > today) {
        showError('birthDateError', 'Дата рождения не может быть в будущем');
        return false;
    }

    return true;
}

export function validateSection(section) {
    const sectionInput = document.getElementById('section');
    const sectionValue = sectionInput.value;

    if (!sectionValue) {
        showError('sectionError', 'Выберите секцию конференции');
        return false;
    }

    clearError('sectionError');
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

    // Если выбран "Да", проверяем тему доклада
    if (reportYes.checked) {
        const topicInput = document.getElementById('topic');
        const topicValue = topicInput.value.trim();

        if (!topicValue) {
            showError('topicError', 'Поле обязательно для заполнения');
            return false;
        }

        clearError('topicError');
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