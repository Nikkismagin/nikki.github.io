import { validateField, showError, clearError } from './validation.js';
import { addParticipant, getParticipants, getParticipantsCount, getReportCount } from './participants.js';
import { formatPhoneNumber, formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация компонентов
    initForm();
    initParticipantsList();
    updateCounters();

    // Пример загрузки тестовых данных
    if (getParticipantsCount() === 0) {
        loadSampleData();
    }
});

function initForm() {
    const form = document.getElementById('registrationForm');
    const reportToggle = document.querySelectorAll('input[name="hasReport"]');
    const topicField = document.getElementById('topicField');

    // Обработчик переключателя доклада
    reportToggle.forEach(radio => {
        radio.addEventListener('change', function () {
            topicField.style.display = this.value === 'yes' ? 'block' : 'none';
            if (this.value === 'no') {
                document.getElementById('topic').value = '';
            }
        });
    });

    // Валидация в реальном времени
    form.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', function () {
            if (!validateField(this.name, this.value)) {
                showError(this, getErrorMessage(this.name));
            } else {
                clearError(this);
            }
        });

        input.addEventListener('input', function () {
            if (this.value) {
                clearError(this);
            }
        });
    });

    // Отправка формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Валидация всех полей
        let isValid = true;
        const formData = new FormData(form);

        // ... логика обработки формы
    });
}