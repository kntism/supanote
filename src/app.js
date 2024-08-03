// Load saved notes when the page loads
window.onload = function () {
  displayNotes();
};

// Show note form popup
function showNoteForm() {
  document.getElementById("noteForm").style.display = "block";
}

// Close note form popup
function closeNoteForm() {
  document.getElementById("noteForm").style.display = "none";
  document.getElementById("noteContent").value = "";
}

// Save note
function saveNote() {
  var content = document.getElementById("noteContent").value.trim();

  if (content === "") {
    alert("Please enter some content for the note.");
    return;
  }

  var notes = JSON.parse(localStorage.getItem("webNotes")) || [];
  notes.unshift({
    id: Date.now(),
    content: content,
    date: new Date().toLocaleString(),
    type: "general",
  });
  localStorage.setItem("webNotes", JSON.stringify(notes));

  closeNoteForm();
  displayNotes();
}

// Display all notes
function displayNotes() {
  var noteList = document.getElementById("noteList");
  var notes = JSON.parse(localStorage.getItem("webNotes")) || [];

  var noteHtml = "";
  if (notes.length === 0) {
    noteHtml = "<p>No notes saved yet.</p>";
  } else {
    notes.forEach(function (note, index) {
      var cardClass = "note-card";
      if (note.content.toLowerCase().includes("todo")) {
        cardClass += " todo";
        note.content = createTodoList(note.content);
      } else if (note.content.toLowerCase().includes("quote")) {
        cardClass += " quote";
      }
      noteHtml += `
                <div class="${cardClass}">
                    <p>${note.content}</p>
                    <small>${note.date}</small>
                    <button onclick="deleteNote(${note.id})" class="delete-btn">Delete</button>
                </div>
            `;
    });
  }

  noteList.innerHTML = noteHtml;
}

// Create a todo list from note content
function createTodoList(content) {
  var lines = content.split("\n");
  var todoHtml = '<ul class="todo-list">';
  lines.forEach(function (line) {
    if (line.trim().startsWith("- ")) {
      todoHtml += `<li>${line.trim().substring(2)}</li>`;
    }
  });
  todoHtml += "</ul>";
  return todoHtml;
}

// Show a random note
function showRandomNote() {
  var notes = JSON.parse(localStorage.getItem("webNotes")) || [];
  if (notes.length === 0) {
    alert("No notes available. Add some notes first!");
    return;
  }
  var randomIndex = Math.floor(Math.random() * notes.length);
  var randomNote = notes[randomIndex];

  var noteList = document.getElementById("noteList");
  var cardClass = "note-card";
  if (randomNote.content.toLowerCase().includes("todo")) {
    cardClass += " todo";
    randomNote.content = createTodoList(randomNote.content);
  } else if (randomNote.content.toLowerCase().includes("quote")) {
    cardClass += " quote";
  }

  noteList.innerHTML = `
        <div class="${cardClass}">
            <p>${randomNote.content}</p>
            <small>${randomNote.date}</small>
            <button onclick="deleteNote(${randomNote.id})" class="delete-btn">Delete</button>
        </div>
        <button onclick="displayNotes()">Back to All Notes</button>
    `;
}

// Delete a note
function deleteNote(id) {
  if (confirm("Are you sure you want to delete this note?")) {
    var notes = JSON.parse(localStorage.getItem("webNotes")) || [];
    notes = notes.filter((note) => note.id !== id);
    localStorage.setItem("webNotes", JSON.stringify(notes));
    displayNotes();
  }
}

// Close popup when clicking outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById("noteForm")) {
    closeNoteForm();
  }
};
