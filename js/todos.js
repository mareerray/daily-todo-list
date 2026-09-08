// todos.js - Todo operations module (with edit support)

const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const prioritySelect = document.querySelector('.priority-select');
const sortBtn = document.querySelector('.sort-btn');

// Tracks which task is being edited. null = dialog is in "add new" mode.
let editingTodoId = null;

function initTodos() {
    todoButton.addEventListener('click', addTodo);
    todoList.addEventListener('click', deleteCheck);
    filterOption.addEventListener('click', filterTodo);
    sortBtn.addEventListener('click', sortTodo);
}

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value.trim() === '') return;

    const priority = prioritySelect.value;
    const dueDate = formatDateKey(getSelectedDate());

    const todoObj = {
        text: todoInput.value,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };
    saveTodoToStorage(todoObj);

    todoInput.value = '';
    prioritySelect.value = 'medium';
    displayTodosForDate(getSelectedDate());
}

// Opens the dialog pre-filled with an existing task's data for editing.
// Pass null to open it fresh for adding a new task instead.
function openEditDialog(todoId) {
    const todos = getTodosFromStorage();
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    editingTodoId = todoId;

    document.getElementById('dialogTodoInput').value = todo.text;
    document.getElementById('dialogPrioritySelect').value = todo.priority;
    document.getElementById('addDialogDate_value').value = todo.dueDate;
    document.getElementById('addDialogDateText').textContent = todo.dueDate;

    const dialogTitle = document.getElementById('dialogTitle');
    if (dialogTitle) dialogTitle.textContent = t('dialog_edit_task_title') || 'Edit task';

    document.getElementById('addDialog').hidden = false;
    setDateNavVisible(false);
}

function addTodoFromDialog() {
    const input = document.getElementById('dialogTodoInput');
    const prioritySelectDialog = document.getElementById('dialogPrioritySelect');
    const dateInput = document.getElementById('addDialogDate_value');

    if (input.value.trim() === '') return;

    if (editingTodoId) {
        // EDIT MODE: update the existing task instead of creating a new one
        updateTodoInStorage(editingTodoId, {
            text: input.value,
            priority: prioritySelectDialog.value,
            dueDate: dateInput.value
        });
        editingTodoId = null;
    } else {
        // ADD MODE: create a brand new task
        const todoObj = {
            text: input.value,
            priority: prioritySelectDialog.value,
            dueDate: dateInput.value,
            completed: false
        };
        saveTodoToStorage(todoObj);
    }

    input.value = '';
    const dialogTitle = document.getElementById('dialogTitle');
    if (dialogTitle) dialogTitle.textContent = t('dialog_add_task_title') || 'Add a task';

    closeAddDialog();
    displayTodosForDate(getSelectedDate());
}

function deleteCheck(e) {
    const item = e.target;

    // Edit
    if (item.classList.contains('edit-btn') || item.parentElement.classList.contains('edit-btn')) {
        const todo = item.closest('.todo');
        openEditDialog(todo.dataset.id);
        return;
    }

    // Delete TODO
    if (item.classList.contains('trash-btn') || item.parentElement.classList.contains('trash-btn')) {
        const todo = item.closest('.todo');
        const todoId = todo.dataset.id;
        const todoText = todo.children[1].innerText;

        const confirmMsg = t('confirm_delete', { task: todoText });
        if (!confirm(confirmMsg)) return;

        todo.classList.add('fall');
        removeTodoFromStorage(todoId);

        if (calendarOverlay.classList.contains('active')) {
            renderCalendar();
        }

        todo.addEventListener('transitionend', function () {
            todo.remove();
            const remainingTodos = todoList.querySelectorAll('.todo');
            if (remainingTodos.length === 0) {
                displayTodosForDate(getSelectedDate());
            }
        });
    }

    // Check Mark
    if (item.classList.contains('complete-btn') || item.parentElement.classList.contains('complete-btn')) {
        const todo = item.closest('.todo');
        const todoId = todo.dataset.id;
        todo.classList.toggle('completed');

        const todos = getTodosFromStorage();
        const todoIndex = todos.findIndex(t => t.id === todoId);
        if (todoIndex > -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            localStorage.setItem('todos', JSON.stringify(todos));

            if (todos[todoIndex].completed) {
                Rewards.celebrate();
            }
        }
    }
}

function displayTodosForDate(date) {
    const dateKey = formatDateKey(date);
    const dateTodos = getTodosForDate(dateKey);

    todoList.innerHTML = '';

    if (dateTodos.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.classList.add('empty-message');
        emptyMsg.textContent = t('empty_no_tasks');
        todoList.appendChild(emptyMsg);
    } else {
        dateTodos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add("todo");
            todoDiv.dataset.priority = todo.priority;
            todoDiv.dataset.dueDate = dateKey;
            todoDiv.dataset.id = todo.id;
            if (todo.completed) {
                todoDiv.classList.add('completed');
            }

            const priorityBadge = document.createElement('div');
            priorityBadge.classList.add('priority-badge');
            const badgeTitle = getPriorityBadgeTitle(todo.priority);
            priorityBadge.innerHTML = `
                <span class="priority-indicator priority-${todo.priority}" title="${badgeTitle}"></span>
            `;
            todoDiv.appendChild(priorityBadge);

            const newTodo = document.createElement('li');
            newTodo.innerText = todo.text;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);

            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            editButton.classList.add('edit-btn');
            todoDiv.appendChild(editButton);

            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            completedButton.classList.add('complete-btn');
            todoDiv.appendChild(completedButton);

            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
            trashButton.classList.add('trash-btn');
            todoDiv.appendChild(trashButton);

            todoList.appendChild(todoDiv);
        });
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach((todo) => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "uncompleted":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "high":
            case "medium":
            case "low":
                todo.style.display = (todo.dataset && todo.dataset.priority === e.target.value) ? "flex" : "none";
                break;
        }
    });
}

function sortTodo() {
    filterOption.value = 'uncompleted';
    filterTodo({ target: filterOption });

    const todos = Array.from(todoList.children);
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    todos.sort((a, b) => {
        const priorityA = priorityOrder[a.dataset.priority] || 999;
        const priorityB = priorityOrder[b.dataset.priority] || 999;
        return priorityA - priorityB;
    });

    todos.forEach(todo => todoList.appendChild(todo));
}

function getPriorityBadgeTitle(priority) {
    const labelKey = priority === 'high' ? 'priority_label_high' : priority === 'medium' ? 'priority_label_medium' : 'priority_label_low';
    return `${t('priority_badge_title_prefix')} ${t(labelKey)}`;
}