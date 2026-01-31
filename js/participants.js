import { formatPhoneNumber, formatName } from './utils.js';

let participants = JSON.parse(localStorage.getItem('conferenceParticipants')) || [];

export function addParticipant(participantData) {
    participantData.id = Date.now();
    participantData.lastName = formatName(participantData.lastName);
    participantData.firstName = formatName(participantData.firstName);
    participantData.middleName = formatName(participantData.middleName);
    participantData.phone = formatPhoneNumber(participantData.phone);

    participants.push(participantData);
    saveParticipants();
    updateParticipantsList();
    updateCounters();

    return participantData;
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

    const recentParticipants = participants.slice(-5).reverse();

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
            ${participant.birthDate ? `<div>${formatDate(participant.birthDate)}</div>` : ''}
            ${participant.hasReport === 'yes' && participant.topic ? `<div style="margin-top: 5px;"><strong>Доклад:</strong> ${participant.topic}</div>` : ''}
        `;

        const sectionElement = document.createElement('div');
        sectionElement.className = 'participant-section';

        const sectionNames = {
            'mathematics': 'Математика',
            'physics': 'Физика',
            'informatics': 'Информатика'
        };

        sectionElement.textContent = sectionNames[participant.section] || participant.section;

        participantInfo.appendChild(nameElement);
        participantInfo.appendChild(detailsElement);

        participantElement.appendChild(participantInfo);
        participantElement.appendChild(sectionElement);

        participantsList.appendChild(participantElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function updateCounters() {
    const totalElement = document.getElementById('totalParticipants');
    const withReportsElement = document.getElementById('withReports');

    if (totalElement) {
        totalElement.textContent = getParticipantsCount();
    }

    if (withReportsElement) {
        withReportsElement.textContent = getParticipantsWithReportsCount();
    }
}

export function clearParticipants() {
    participants = [];
    saveParticipants();
    updateParticipantsList();
    updateCounters();
}