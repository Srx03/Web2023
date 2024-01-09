document.addEventListener('DOMContentLoaded', function() {
  var noteForm = document.getElementById('note-form');
  var noteList = document.getElementById('note-list');
  var logoutBtn = document.getElementById('logout-btn');
  var searchInput = document.getElementById('search-input');
  var searchBtn = document.getElementById('search-btn');

  var notesArray = [];
  var fillteredNotes = [];

  var userId = localStorage.getItem("user_id");

  loadNotes();

  noteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    saveNote();
  });

  logoutBtn.addEventListener('click', function() {
      localStorage.clear();

      window.location.href = 'login.html';
  });

  searchBtn.addEventListener('click', function(event) {
      filterNotes(searchInput.value);
  });

  function filterNotes(value) {
      noteList.innerHTML = "";
      notesArray.forEach(function(note, index) {
          if(note.value.includes(value)) {
             fillteredNotes.push(note);
             var noteItem = createNoteItem(note, index);
             noteList.appendChild(noteItem);
          }    
      });
  }


  function loadNotes() {
    sendHttpRequest('GET', 'user.php?user_id=' + userId, null, function(response) {
      if (response.length > 0) {
        noteList.innerHTML = '';
        notesArray = response;
        response.forEach(function(note, index) {
          var noteItem = createNoteItem(note, index);
          noteList.appendChild(noteItem);
        });
      } else {
        noteList.innerHTML = '<li>No notes found.</li>';
      }
    });
  }

  function createNoteItem(note, note_id) {
    var noteItem = document.createElement('li');
    noteItem.className = 'note-item';

    var noteValue = document.createElement('span');
    noteValue.className = 'note-value';
    noteValue.textContent = note.value;

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-button';
    editBtn.addEventListener('click', function() {
      editNote(notesArray[note_id].id, notesArray[note_id].value);
    });

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-button';
    deleteBtn.addEventListener('click', function() {
      deleteNote(notesArray[note_id].id);
    });

    noteItem.appendChild(noteValue);
    noteItem.appendChild(editBtn);
    noteItem.appendChild(deleteBtn);

    return noteItem;
  }

  function saveNote(noteId) {
    noteValue = document.getElementById('note-value').value;      

    if (noteValue.trim() === '') {
      alert('Please enter a note value.');
      return;
    }

    var data = {
      user_id: userId,
      note_id: document.getElementById('note-id').value,
      value: noteValue
    };

    if(data.note_id !== "") {
      sendHttpRequest('PUT', 'user.php', data, function(response) {
      if (response.success) {
        resetForm();
        loadNotes();
      } else {
        alert('Error updating note.');
      }
    });
    } else {
      sendHttpRequest('POST', 'user.php', data, function(response) {
        if (response.success) {
          resetForm();
          loadNotes();
        } else {
          alert('Error saving note.');
        }
      });
    }
  }

  function editNote(noteId, noteValue) {
    document.getElementById('note-id').value = noteId;
    document.getElementById('note-value').value = noteValue;
  }

  function deleteNote(noteId) {
    var confirmDelete = confirm('Are you sure you want to delete this note?');
    if (confirmDelete) {
      var data = {
        user_id: userId,
        note_id: noteId,
        value: null
      };

      sendHttpRequest('DELETE', 'user.php', data, function(response) {
        if (response.success) {
          loadNotes();
        } else {
          alert('Error deleting note.');
        }
      });
    }
  }

  function resetForm() {
    document.getElementById('note-id').value = '';
    document.getElementById('note-value').value = '';
  }

  function sendHttpRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        var response = JSON.parse(xhr.responseText);
        callback(response);
      }
    };
    xhr.onerror = function() {
      console.error('Request failed');
    };
    xhr.send(JSON.stringify(data));
  }
});
