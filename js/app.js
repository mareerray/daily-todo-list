// app.js - Main application initialization

async function initializeApp() {
    // Load translations first
    await loadTranslations();
    
    // Initialize modules
    initUI();
    initCalendar();
    initTodos();
    
    // Apply initial translations
    applyTranslations();
    setActiveLanguageItem();
    
    // Set initial date and display todos
    updateDateDisplay();
    displayTodosForDate(getSelectedDate());
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
