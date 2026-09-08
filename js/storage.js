// storage.js - LocalStorage operations module

function saveTodoToStorage(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    if (!todo.id) {
        todo.id = Date.now() + Math.random().toString(36).slice(2, 7); // unique ID
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

function removeTodoFromStorage(todoId) {
    let todos = getTodosFromStorage();
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoInStorage(todoId, updates) {
    let todos = getTodosFromStorage();
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex > -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...updates };
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    return todoIndex > -1 ? todos[todoIndex] : null;
}

function getTodosForDate(dateKey) {
    const todos = getTodosFromStorage();
    return todos.filter(todo => todo.dueDate === dateKey);
}