// app.js - Main application initialization

async function initializeApp() {
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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
