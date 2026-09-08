// app.js - Main application initialization

async function initializeApp() {
    // One-time migration: give any existing todos (saved before IDs existed) a unique ID.
    migrateTodoIds();

    // Load translations first
    await loadTranslations();
    
    // Initialize modules
    initUI();
    initCalendar();
    initTodos();
    initBottomNav();
    
    // Apply initial translations
    applyTranslations();
    setActiveLanguageItem();
    
    // Set initial date and display todos
    updateDateDisplay();
    displayTodosForDate(getSelectedDate());

    // Show welcome dialog for first-time users
    checkFirstVisit();
}

// Show welcome dialog once, then remember the user has seen it
function checkFirstVisit() {
    const welcomeDialog = document.getElementById('welcomeDialog');
    if (!welcomeDialog) return;

    if (!localStorage.getItem('hasVisitedBefore')) {
        welcomeDialog.hidden = false;
    }
}

// One-time migration: give any existing todos (saved before IDs existed) a unique ID.
// Call this once during app init, before anything else touches todos.

function migrateTodoIds() {
    const todos = getTodosFromStorage();
    let changed = false;
    todos.forEach(todo => {
        if (!todo.id) {
            todo.id = Date.now() + Math.random().toString(36).slice(2, 7);
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
