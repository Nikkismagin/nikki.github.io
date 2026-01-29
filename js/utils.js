// Форматирование телефона
export function formatPhoneNumber(phone) {
    return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
}

// Форматирование даты
export function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Генерация уникального ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}