let notes = JSON.parse(localStorage.getItem('appNotes')) || [];
let currentNoteId = null;

function renderNotesList() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        noteElement.textContent = `ノート ${index + 1}`;
        noteElement.onclick = () => loadNote(note.id);
        notesList.appendChild(noteElement);
    });
}

function createNote() {
    const newNote = {
        id: Date.now(),
        content: ''
    };
    notes.push(newNote);
    currentNoteId = newNote.id;
    saveNotes();
    renderNotesList();
    document.getElementById('noteContent').value = '';
}

function loadNote(id) {
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    document.getElementById('noteContent').value = note.content;
    renderNotesList();
}

function saveNote() {
    if (currentNoteId) {
        const content = document.getElementById('noteContent').value;
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].content = content;
            saveNotes();
        }
    }
}

function deleteNote() {
    if (currentNoteId) {
        notes = notes.filter(n => n.id !== currentNoteId);
        currentNoteId = notes.length > 0 ? notes[0].id : null;
        saveNotes();
        renderNotesList();
        if (currentNoteId) {
            loadNote(currentNoteId);
        } else {
            document.getElementById('noteContent').value = '';
        }
    }
}

function saveNotes() {
    localStorage.setItem('appNotes', JSON.stringify(notes));
}

// 初期表示
renderNotesList();
if (notes.length > 0) {
    loadNote(notes[0].id);
}

// 自動保存
document.getElementById('noteContent').addEventListener('input', () => {
    saveNote();
});

// ボタンのイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createNoteBtn').addEventListener('click', createNote);
    document.getElementById('deleteNoteBtn').addEventListener('click', deleteNote);
    document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
});