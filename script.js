document.addEventListener('DOMContentLoaded', function() {
    const pageID = document.body.id;

    if(pageID === 'todoListPage') {
        return todo();
    } else if (pageID === 'appointments'){
        return appointments();
    } else if (pageID === 'planner') {
        return planner();
    } else if (pageID === 'notes') {
        return notes();
    }
});

function todo() {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodo() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodo() {
        todoList.innerHTML = '';

        for(let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            const li = document.createElement('li');

            if (todo.complete) {
                li.className = 'complete';
            } else {
                li.className = '';
            }
            const span = document.createElement('span');
            span.textContent = todo.text;
            
            li.appendChild(span);

            const div = document.createElement('div');
            div.className = 'todo-actions';

            const toggleBtn = document.createElement('button');

            if (todo.complete) {
                toggleBtn.textContent = 'Undo';
            } else {
                toggleBtn.textContent = 'Done';
            }
            
            toggleBtn.addEventListener('click', () =>{
                todos[i].complete = !todos[i].complete;
                saveTodo();
                renderTodo();
            });

            div.appendChild(toggleBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () =>{
                todos.splice(i, 1);
                saveTodo();
                renderTodo();
            });

            div.appendChild(deleteBtn);
            li.appendChild(div);
            todoList.appendChild(li);
        }
    }

    addTodoBtn.addEventListener('click', () =>{
        const text = todoInput.value.trim();
        
        if(text !== '') {
            todos.push({text , complete: false});
            saveTodo();
            renderTodo();
            todoInput.value = '';
        }
    });

    renderTodo();
}

function planner() {
    const plannerContainer = document.getElementById('plannerContainer');
    const currentHour = new Date().getHours();
    const startHour = 1;
    const endHour = 24;

    for(let hour = startHour; hour <= endHour; hour++) {
        const block = document.createElement('div');
        block.className = 'planner-block';
        const hourLabel = document.createElement('div');
        hourLabel.className = 'hour-label';
        hourLabel.textContent = formatHour(hour);

        block.appendChild(hourLabel);
        
        const textarea = document.createElement('textarea');
        textarea.value = localStorage.getItem('planner-' + hour ) || '';

        if (hour < currentHour) {
            textarea.classList.add('past');
        } else if (hour === currentHour) {
            textarea.classList.add('present');
        } else {
            textarea.classList.add('future');
        }

        block.appendChild(textarea);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';

        saveBtn.addEventListener('click', () => {
            localStorage.setItem('planner-' + hour, textarea.value);
        });
        block.appendChild(saveBtn);
        plannerContainer.appendChild(block);
    }
}

function formatHour(hour) {
    let ampm = 'AM';
    if(hour >= 12) {
        ampm = 'PM';
    }
    
    let displayHour = hour % 12;
    if(displayHour === 0) {
        displayHour = 12;
    }

    return displayHour + ' ' + ampm;
}

function appointments() {
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.getElementById('appointmentList');

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    function saveAppointments() {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    function renderAppointments() {
        appointmentList.innerHTML = '';

        appointments.forEach(function(appointment, index) {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            li.innerHTML = `
            <h3>${appointment.title}</h3>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p>${appointment.description}</p>     
            `;
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';

            delBtn.addEventListener('click', () =>{
                appointments.splice(index, 1);
                saveAppointments();
                renderAppointments();
            });
            li.appendChild(delBtn);
            appointmentList.appendChild(li);
        });

    }
    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('appointmentTitle').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const description = document.getElementById('appointmentDesc').value;

        if (title && date && time) {
            appointments.push({title, date, time, description});
            saveAppointments();
            renderAppointments();
            appointmentForm.reset();
        }
    });
    renderAppointments();
}

function notes() {
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('noteList');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function renderNotes() {
        notesList.innerHTML = '';

        notes.forEach(function(note, index) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';
            noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>     
            `;
            const delBtn = document.createElement('button');

            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';

            delBtn.addEventListener('click', () => {
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });
            noteDiv.appendChild(delBtn);
            notesList.appendChild(noteDiv);
        });

    }
    noteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        if(title && content) {
            notes.push({title, content});
            saveNotes();
            renderNotes();
            noteForm.reset();
        }
    });
    renderNotes();
}


// function dashboard() {
//     // Add any JavaScript functionality for the dashboard page here if needed
// }