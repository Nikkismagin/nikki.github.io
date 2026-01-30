export function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

export function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        const inputElement = document.getElementById(elementId.replace('Error', ''));
        if (inputElement) {
            inputElement.classList.remove('success');
            inputElement.classList.add('error');
        }
    }
}

export function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        const inputElement = document.getElementById(elementId.replace('Error', ''));
        if (inputElement) {
            inputElement.classList.remove('error');
            inputElement.classList.add('success');
        }
    }
}

export function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
        cleaned = cleaned.substring(1);
    }

    if (cleaned.length === 10) {
        return `+7 (${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 8)}-${cleaned.substring(8)}`;
    }

    return phone;
}

export function formatName(name) {
    return name.trim().replace(/\s+/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase());
}