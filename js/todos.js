// todos.js - Todo operations module

// DOM Elements
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const prioritySelect = document.querySelector('.priority-select');
const sortBtn = document.querySelector('.sort-btn');

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
    
    // Remove empty message if it exists
    const emptyMsg = todoList.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    // Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    todoDiv.dataset.priority = priority;
    todoDiv.dataset.dueDate = dueDate;
    
    // Priority badge
    const priorityBadge = document.createElement('div');
    priorityBadge.classList.add('priority-badge');
    const badgeTitle = getPriorityBadgeTitle(priority);
    priorityBadge.innerHTML = `
        <span class="priority-indicator priority-${priority}" title="${badgeTitle}"></span>
    `;
    todoDiv.appendChild(priorityBadge);
    
    // Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    
    // Complete button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    
    // Delete button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    
    // Append to list
    todoList.appendChild(todoDiv);
    
    // Save to local storage
    const todoObj = {
        text: todoInput.value,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };
    saveTodoToStorage(todoObj);
    
    // Clear input
    todoInput.value = '';
    prioritySelect.value = 'medium';
}

function deleteCheck(e) {
    const item = e.target;
    
    // Delete TODO
    if (item.classList.contains('trash-btn') || item.parentElement.classList.contains('trash-btn')) {
        const todo = item.closest('.todo');
        const todoText = todo.children[1].innerText;
        
        // Confirm deletion with translated message
        const confirmMsg = t('confirm_delete', { task: todoText });
        if (!confirm(confirmMsg)) return;
        
        // Animation
        todo.classList.add('fall');
        removeTodoFromStorage(todoText);
        todo.addEventListener('transitionend', function() {
            todo.remove();
            // Check if list is empty and add message
            const remainingTodos = todoList.querySelectorAll('.todo');
            if (remainingTodos.length === 0) {
                displayTodosForDate(getSelectedDate());
            }
        });
    }
    
    // Check Mark
    if (item.classList.contains('complete-btn') || item.parentElement.classList.contains('complete-btn')) {
        const todo = item.closest('.todo');
        todo.classList.toggle('completed');
        
        // Update storage
        const todoText = todo.children[1].innerText;
        const todos = getTodosFromStorage();
        const todoIndex = todos.findIndex(t => {
            const text = typeof t === 'string' ? t : t.text;
            return text === todoText && t.dueDate === todo.dataset.dueDate;
        });
        if (todoIndex > -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }
}

function displayTodosForDate(date) {
    const dateKey = formatDateKey(date);
    const dateTodos = getTodosForDate(dateKey);
    
    // Clear list
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
            if (todo.completed) {
                todoDiv.classList.add('completed');
            }
            
            // Priority badge
            const priorityBadge = document.createElement('div');
            priorityBadge.classList.add('priority-badge');
            const badgeTitle = getPriorityBadgeTitle(todo.priority);
            priorityBadge.innerHTML = `
                <span class="priority-indicator priority-${todo.priority}" title="${badgeTitle}"></span>
            `;
            todoDiv.appendChild(priorityBadge);
            
            // Todo text
            const newTodo = document.createElement('li');
            newTodo.innerText = todo.text;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);
            
            // Complete button
            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            completedButton.classList.add('complete-btn');
            todoDiv.appendChild(completedButton);
            
            // Delete button
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
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "high":
            case "medium":
            case "low":
                if (todo.dataset && todo.dataset.priority === e.target.value) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function sortTodo() {
    // Set filter to show only active tasks
    filterOption.value = 'uncompleted';
    filterTodo({ target: filterOption });
    
    // Then sort by priority
    const todos = Array.from(todoList.children);
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    
    todos.sort((a, b) => {
        const priorityA = priorityOrder[a.dataset.priority] || 999;
        const priorityB = priorityOrder[b.dataset.priority] || 999;
        return priorityA - priorityB;
    });
    
    // Re-append sorted todos to the list
    todos.forEach(todo => todoList.appendChild(todo));
}

function getPriorityBadgeTitle(priority) {
    const labelKey = priority === 'high' ? 'priority_label_high' : priority === 'medium' ? 'priority_label_medium' : 'priority_label_low';
    return `${t('priority_badge_title_prefix')} ${t(labelKey)}`;
}
