// Language/i18n - loaded from translations.json
let LANGS = {};
let translations = {};

async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) throw new Error('Failed to load translations');
        const data = await response.json();
        LANGS = data.langs;
        translations = data.translations;
    } catch (err) {
        console.error('Error loading translations:', err);
        // Fallback to English-only mode
        LANGS = { en: 'en-US' };
        translations = { en: {} };
    }
}

function detectInitialLang() {
    const stored = localStorage.getItem('lang');
    if (stored && LANGS[stored]) return stored;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('th')) return 'th';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('sv')) return 'sv';
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('uk')) return 'uk';
    if (nav.startsWith('fi')) return 'fi';
    if (nav.startsWith('de')) return 'de';
    if (nav.startsWith('it')) return 'it';
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
}

let currentLang = detectInitialLang();

function t(key, params = {}) {
    const table = translations[currentLang] || translations.en;
    let str = table[key] || translations.en[key] || key;
    Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
}

function getLocale() {
    return LANGS[currentLang] || LANGS.en;
}

function setLang(lang) {
    if (!LANGS[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    updateDateDisplay();
    // Re-render current date list to update dynamic titles, empty text, etc.
    displayTodosForDate(selectedDate);
    setActiveLanguageItem();
}

function applyTranslations() {
    // Input placeholder
    const inputEl = document.querySelector('.todo-input');
    if (inputEl) inputEl.placeholder = t('input_add_placeholder');

    // Filter options
    const filterEl = document.querySelector('.filter-todo');
    if (filterEl) {
        filterEl.querySelectorAll('option').forEach(opt => {
            const val = opt.value;
            if (val === 'all') opt.textContent = t('filter_all');
            else if (val === 'completed') opt.textContent = t('filter_completed');
            else if (val === 'uncompleted') opt.textContent = t('filter_uncompleted');
            else if (val === 'high') opt.textContent = t('filter_high');
            else if (val === 'medium') opt.textContent = t('filter_medium');
            else if (val === 'low') opt.textContent = t('filter_low');
        });
    }

    // Sort button
    if (sortBtn) sortBtn.innerHTML = `<i class="bi bi-sort-down fs-4"></i> ${t('sort_priority')}`;

    // Language button title
    if (languageButton) languageButton.title = t('language_hint');

    // Priority select labels and titles
    if (prioritySelect) {
        prioritySelect.querySelectorAll('option').forEach(opt => {
            if (opt.value === 'high') {
                opt.textContent = `🔴 ${t('priority_label_high')}`;
                opt.title = `${t('priority_label_high')} - ${t('legend_high_desc')}`;
            } else if (opt.value === 'medium') {
                opt.textContent = `🟡 ${t('priority_label_medium')}`;
                opt.title = `${t('priority_label_medium')} - ${t('legend_medium_desc')}`;
            } else if (opt.value === 'low') {
                opt.textContent = `🔵 ${t('priority_label_low')}`;
                opt.title = `${t('priority_label_low')} - ${t('legend_low_desc')}`;
            }
        });
    }

    // Priority legend
    const legend = document.querySelector('.priority-legend');
    if (legend) {
        const items = legend.querySelectorAll('.legend-item');
        items.forEach(item => {
            const dot = item.querySelector('.legend-dot');
            if (!dot) return;
            const isHigh = dot.classList.contains('high');
            const isMed = dot.classList.contains('medium');
            const isLow = dot.classList.contains('low');
            if (isHigh) {
                item.innerHTML = `<span class="legend-dot high"></span> <strong>${t('legend_high_label')}</strong> ${t('legend_high_desc')}`;
            } else if (isMed) {
                item.innerHTML = `<span class="legend-dot medium"></span> <strong>${t('legend_medium_label')}</strong> ${t('legend_medium_desc')}`;
            } else if (isLow) {
                item.innerHTML = `<span class="legend-dot low"></span> <strong>${t('legend_low_label')}</strong> ${t('legend_low_desc')}`;
            }
        });
    }

    // Custom language menu handles selection; nothing to set here
}

function getPriorityBadgeTitle(priority) {
    const labelKey = priority === 'high' ? 'priority_label_high' : priority === 'medium' ? 'priority_label_medium' : 'priority_label_low';
    return `${t('priority_badge_title_prefix')} ${t(labelKey)}`;
}

function toggleLanguageMenu() {
    if (!languageMenu || !languageButton) return;
    const willShow = !!languageMenu.hidden;
    languageMenu.hidden = !willShow;
    languageButton.setAttribute('aria-expanded', String(willShow));
}

function hideLanguageMenu() {
    if (!languageMenu || !languageButton) return;
    languageMenu.hidden = true;
    languageButton.setAttribute('aria-expanded', 'false');
}

function onLanguageMenuClick(e) {
    const target = e.target;
    if (target.classList.contains('language-item')) {
        const lang = target.dataset.lang;
        setLang(lang);
        hideLanguageMenu();
    }
}

function setActiveLanguageItem() {
    const items = document.querySelectorAll('.language-item');
    items.forEach((item) => {
        if (item.dataset.lang === currentLang) item.classList.add('active');
        else item.classList.remove('active');
    });
}

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const prioritySelect = document.querySelector('.priority-select');
const sortBtn = document.querySelector('.sort-btn');
const todayDatePicker = document.getElementById('todayDatePicker');
const prevDateBtn = document.getElementById('prevDateBtn');
const nextDateBtn = document.getElementById('nextDateBtn');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');

let selectedDate = new Date();

//Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    initializeApp();
});
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
sortBtn.addEventListener('click', sortTodo);
todayDatePicker.addEventListener('change', updateSelectedDate);
prevDateBtn.addEventListener('click', () => changeDate(-1));
nextDateBtn.addEventListener('click', () => changeDate(1));
if (languageButton) languageButton.addEventListener('click', toggleLanguageMenu);
if (languageMenu) languageMenu.addEventListener('click', onLanguageMenuClick);
document.addEventListener('click', (e) => {
    if (!languageMenu || !languageButton) return;
    const isInside = languageMenu.contains(e.target) || languageButton.contains(e.target);
    if (!isInside) hideLanguageMenu();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLanguageMenu();
});

function initializeApp() {
    // Initial language setup
    applyTranslations();
    setActiveLanguageItem();

    setDatePickerValue(selectedDate);
    displayTodosForDate(selectedDate);
}

function setDatePickerValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    todayDatePicker.value = `${year}-${month}-${day}`;
    updateDateDisplay();
}

function updateSelectedDate(e) {
    const newDate = new Date(e.target.value + 'T00:00:00');
    selectedDate = newDate;
    displayTodosForDate(selectedDate);
}

function changeDate(days) {
    selectedDate.setDate(selectedDate.getDate() + days);
    setDatePickerValue(selectedDate);
    displayTodosForDate(selectedDate);
}

function updateDateDisplay() {
    const dateStr = selectedDate.toLocaleDateString(getLocale(), { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
    });
    selectedDateDisplay.textContent = dateStr;
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//Functions

function addTodo(event) {
    //Prevent form from submitting
    event.preventDefault();
    
    if(todoInput.value.trim() === '') return;
    
    //Get priority value
    const priority = prioritySelect.value;
    const dueDate = formatDateKey(selectedDate);
    
    // Remove empty message if it exists
    const emptyMsg = todoList.querySelector('.empty-message');
    if(emptyMsg) {
        emptyMsg.remove();
    }
    
    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    todoDiv.dataset.priority = priority;
    todoDiv.dataset.dueDate = dueDate;
    
    //Priority badge
    const priorityBadge = document.createElement('div');
    priorityBadge.classList.add('priority-badge');
    const badgeTitle = getPriorityBadgeTitle(priority);
    priorityBadge.innerHTML = `
        <span class="priority-indicator priority-${priority}" title="${badgeTitle}"></span>
    `;
    todoDiv.appendChild(priorityBadge);
    
    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    
    //Add todo to LocalStorage
    saveLocalTodos({
        text: todoInput.value,
        priority: priority,
        dueDate: dueDate,
        completed: false
    });
    
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    //Append to LIST
    todoList.appendChild(todoDiv);
    //Clear todo Input Value
    todoInput.value = '';
}

function deleteCheck(e) {
    const item = e.target;
    //Delete
    if(item.classList[0]==='trash-btn') {
        const todo = item.parentElement;
        const todoText = todo.querySelector('.todo-item').innerText;
        
        // Ask for confirmation before deleting
        if(confirm(t('confirm_delete', { task: todoText }))) {
            //Animation        
            todo.classList.add('fall');
            removeLocalTodos(todo);
            todo.addEventListener('transitionend', function() {
                todo.remove();
            });
        }
    }

    //Check Mark
    if(item.classList[0] == 'complete-btn') {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        // Update in localStorage
        updateTodoCompletion(todo);
    }
}

function updateTodoCompletion(todoDiv) {
    const todoText = todoDiv.querySelector('.todo-item').innerText;
    const todoDueDate = todoDiv.dataset.dueDate;
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.findIndex(t => t.text === todoText && t.dueDate === todoDueDate);
    if(todoIndex > -1) {
        todos[todoIndex].completed = todoDiv.classList.contains('completed');
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function displayTodosForDate(date) {
    // Clear current todos
    todoList.innerHTML = '';
    updateDateDisplay();
    
    // Get todos from localStorage
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    // Filter todos for selected date
    const dateKey = formatDateKey(date);
    const dateTodos = todos.filter(todo => todo.dueDate === dateKey);
    
    // Sort by priority (High -> Medium -> Low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    dateTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Display todos
    if(dateTodos.length === 0) {
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
            if(todo.completed) {
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
                if(todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "high":
            case "medium":
            case "low":
                if(todo.dataset && todo.dataset.priority === e.target.value){
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
    filterTodo({target: filterOption});
    
    // Then sort by priority
    const todos = Array.from(todoList.children);
    const priorityOrder = {high: 1, medium: 2, low: 3};
    
    todos.sort((a, b) => {
        const priorityA = priorityOrder[a.dataset.priority] || 999;
        const priorityB = priorityOrder[b.dataset.priority] || 999;
        return priorityA - priorityB;
    });
    
    // Re-append sorted todos to the list
    todos.forEach(todo => todoList.appendChild(todo));
}

function saveLocalTodos(todo) {
    //Check---Do I already have something in there?
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos',JSON.stringify(todos));
}

function getTodos() {
    //Check---Do I already have something in there?
    let todos;

    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    //To loop over
    todos.forEach(function(todo){
        // Handle both old format (string) and new format (object)
        const todoText = typeof todo === 'string' ? todo : todo.text;
        const priority = todo.priority || 'medium';
        
        //Todo DIV
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");
        todoDiv.dataset.priority = priority;
        
        //Priority badge
        const priorityBadge = document.createElement('div');
        priorityBadge.classList.add('priority-badge');
        priorityBadge.innerHTML = `
            <span class="priority-indicator priority-${priority}" title="Priority: ${priority}"></span>
        `;
        todoDiv.appendChild(priorityBadge);
        
        //Create LI
        const newTodo = document.createElement('li');
        newTodo.innerText = todoText;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        //Append to LIST
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    //Check---Do I already have something in there?
    let todos;

    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoText = todo.children[1].innerText; // Updated index due to priority badge
    const todoIndex = todos.findIndex(t => {
        const text = typeof t === 'string' ? t : t.text;
        return text === todoText;
    });
    if(todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
