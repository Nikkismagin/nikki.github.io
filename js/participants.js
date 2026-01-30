// participants.js
import { formatPhoneNumber, formatName } from './utils.js';

let participants = JSON.parse(localStorage.getItem('conferenceParticipants')) || [];

export function addParticipant(participantData) {
    // Форматируем данные
    participantData.lastName = formatName(participantData.lastName);
    participantData.firstName = formatName(participantData.firstName);
    participantData.middleName = formatName(participantData.middleName);
    participantData.phone = formatPhoneNumber(participantData.phone);

    participants.push(participantData);
    saveParticipants();
    updateParticipantsList();
    updateCounters();
}

export function getParticipants() {
    return participants;
}

export function getParticipantsCount() {
    return participants.length;
}

export function getParticipantsWithReportsCount() {
    return participants.filter(p => p.hasReport === 'yes').length;
}

function saveParticipants() {
    localStorage.setItem('conferenceParticipants', JSON.stringify(participants));
}

export function updateParticipantsList() {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';

    if (participants.length === 0) {
        participantsList.innerHTML = '<div class="empty-list">Пока нет зарегистрированных участников</div>';
        return;
    }

    // Отображаем последних 10 участников (самых новых)
    const recentParticipants = participants.slice(-10).reverse();

    recentParticipants.forEach(participant => {
        const participantElement = document.createElement('div');
        participantElement.className = 'participant';

        const participantInfo = document.createElement('div');
        participantInfo.className = 'participant-info';

        const nameElement = document.createElement('div');
        nameElement.className = 'participant-name';
        nameElement.textContent = `${participant.lastName} ${participant.firstName} ${participant.middleName}`;

        const detailsElement = document.createElement('div');
        detailsElement.className = 'participant-details';
        detailsElement.innerHTML = `
            <div>${participant.email}</div>
            <div>${participant.phone}</div>
            ${participant.birthDate ? `<div>Дата рождения: ${participant.birthDate}</div>` : ''}
            ${participant.hasReport === 'yes' ? `<div>Тема доклада: ${participant.topic}</div>` : ''}
        `;

        const sectionElement = document.createElement('div');
        sectionElement.className = 'participant-section';

        // Преобразуем значение секции в читаемый вид
        let sectionName = '';
        switch (participant.section) {
            case 'mathematics': sectionName = 'Математика'; break;
            case 'physics': sectionName = 'Физика'; break;
            case 'informatics': sectionName = 'Информатика'; break;
            default: sectionName = participant.section;
        }

        sectionElement.textContent = sectionName;

        participantInfo.appendChild(nameElement);
        participantInfo.appendChild(detailsElement);

        participantElement.appendChild(participantInfo);
        participantElement.appendChild(sectionElement);

        participantsList.appendChild(participantElement);
    });
}

export function updateCounters() {
    const totalElement = document.getElementById('totalParticipants');
    const withReportsElement = document.getElementById('withReports');

    totalElement.textContent = getParticipantsCount();
    withReportsElement.textContent = getParticipantsWithReportsCount();
}