// storage.js - LocalStorage operations module

function saveTodoToStorage(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
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

function removeTodoFromStorage(todoText) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.findIndex(t => {
        const text = typeof t === 'string' ? t : t.text;
        return text === todoText;
    });
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosForDate(dateKey) {
    const todos = getTodosFromStorage();
    return todos.filter(todo => todo.dueDate === dateKey);
}
