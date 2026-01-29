let participants = [];

export function addParticipant(participant) {
    participants.push({
        id: generateId(),
        ...participant,
        registrationDate: new Date().toISOString()
    });
    saveToLocalStorage();
    return true;
}

export function getParticipants() {
    return [...participants];
}

export function getParticipantsBySection(section) {
    return participants.filter(p => p.section === section);
}

export function getParticipantsCount() {
    return participants.length;
}

export function getReportCount() {
    return participants.filter(p => p.hasReport).length;
}

function saveToLocalStorage() {
    localStorage.setItem('conferenceParticipants', JSON.stringify(participants));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('conferenceParticipants');
    if (saved) {
        participants = JSON.parse(saved);
    }
}

// Загружаем данные при инициализации
loadFromLocalStorage();