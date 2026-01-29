export const validationRules = {
    name: /^[À-ß¨][à-ÿ¸]*(-[À-ß¨][à-ÿ¸]*)?$/u,
    phone: /^\+7\d{10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export function validateField(field, value) {
    switch(field) {
        case 'lastName':
        case 'firstName':
        case 'middleName':
            return validationRules.name.test(value);
        case 'phone':
            return validationRules.phone.test(value);
        case 'email':
            return validationRules.email.test(value);
        default:
            return true;
    }
}

export function showError(element, message) {
    element.classList.add('error');
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

export function clearError(element) {
    element.classList.remove('error');
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.style.display = 'none';
    }
}