const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingIndex = null;

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

        taskItem.innerHTML = `
      <div>
    <input type="checkbox" class="styled-checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})">
        <label for="task-${index}"></label>
        <span class="task-title">${task.title}</span>
        <p class="task-desc">${task.description}</p>
    </div>
    <div class="task-buttons">
        <button class="edit" onclick="startEditTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
    </div>
    `;
        taskList.appendChild(taskItem);
    });
}

function addOrEditTask() {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();

    if (title === '') return alert('Task title is required!');

    if (editingIndex === null) {
        // Add new task
        tasks.push({ title, description, completed: false });
    } else {
        // Edit existing task
        tasks[editingIndex] = { ...tasks[editingIndex], title, description };
        editingIndex = null; // Reset editing mode
        addTaskButton.textContent = 'Add Task'; // Reset button text
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskTitleInput.value = '';
    taskDescInput.value = '';
    renderTasks();
}

function startEditTask(index) {
    const task = tasks[index];
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description;
    editingIndex = index;
    addTaskButton.textContent = 'Save Task'; // Change button text for editing
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    filters.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter-${filter}`).classList.add('active');
    renderTasks();
}

addTaskButton.addEventListener('click', addOrEditTask);
filters.forEach(btn => btn.addEventListener('click', () => filterTasks(btn.id.split('-')[1])));

renderTasks();
