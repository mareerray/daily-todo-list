// ui.js - UI/Language Menu module

const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');

function initUI() {
    if (languageButton) {
        languageButton.addEventListener('click', toggleLanguageMenu);
    }
    if (languageMenu) {
        languageMenu.addEventListener('click', onLanguageMenuClick);
    }
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-menu-wrapper')) {
            hideLanguageMenu();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideLanguageMenu();
            closeCalendar();
        }
    });
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
        applyTranslations();
        updateDateDisplay();
        displayTodosForDate(getSelectedDate());
        setActiveLanguageItem();
        hideLanguageMenu();
    }
}

function setActiveLanguageItem() {
    const items = document.querySelectorAll('.language-item');
    items.forEach((item) => {
        if (item.dataset.lang === getCurrentLang()) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
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
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) sortBtn.innerHTML = `<i class="bi bi-sort-down fs-4"></i> ${t('sort_priority')}`;

    // Language button title
    if (languageButton) languageButton.title = t('language_hint');

    // Priority select labels and titles
    const prioritySelect = document.querySelector('.priority-select');
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
                item.innerHTML = `<span class="legend-dot high"></span> ${t('legend_high_desc')}`;
            } else if (isMed) {
                item.innerHTML = `<span class="legend-dot medium"></span> ${t('legend_medium_desc')}`;
            } else if (isLow) {
                item.innerHTML = `<span class="legend-dot low"></span> ${t('legend_low_desc')}`;
            }
        });
    }

    // Calendar buttons
    const calendarTodayBtn = document.getElementById('calendarTodayBtn');
    const calendarCloseBtn = document.getElementById('calendarCloseBtn');
    if (calendarTodayBtn) calendarTodayBtn.textContent = t('calendar_today');
    if (calendarCloseBtn) calendarCloseBtn.textContent = t('calendar_close');
}
