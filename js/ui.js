// ui.js - UI/Language Menu module

const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');

function setDateNavVisible(visible) {
    [prevDateBtn, calendarBtn, nextDateBtn].forEach(btn => {
        if (btn) btn.hidden = !visible;
    });
}

function initUI() {
    const openInfoBtn = document.getElementById('openInfoBtn');
    const closeInfoDialogBtn = document.getElementById('closeInfoDialog');
    const infoDialog = document.getElementById('infoDialog');

    const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');
    const welcomeDialog = document.getElementById('welcomeDialog');
    if (closeWelcomeBtn && welcomeDialog) {
        closeWelcomeBtn.addEventListener('click', () => {
            welcomeDialog.hidden = true;
            localStorage.setItem('hasVisitedBefore', 'true');
        });
    }
    if (openInfoBtn && infoDialog) {
        openInfoBtn.addEventListener('click', () => {
            infoDialog.hidden = false;
        });
    }
    if (closeInfoDialogBtn && infoDialog) {
        closeInfoDialogBtn.addEventListener('click', () => {
            infoDialog.hidden = true;
        });
    }
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

    const closeAddDialogBtn = document.getElementById('closeAddDialog');
    if (closeAddDialogBtn) {
        closeAddDialogBtn.addEventListener('click', closeAddDialog);
    }

    const addDialog = document.getElementById('addDialog');
    if (addDialog) {
        addDialog.addEventListener('click', (e) => {
            if (e.target.id === 'addDialog') closeAddDialog();
        });
    }

    const dialogAddButton = document.getElementById('dialogAddButton');
    if (dialogAddButton) {
        dialogAddButton.addEventListener('click', addTodoFromDialog);
    }

    const addDialogDateBtn = document.getElementById('addDialogDateBtn');
    if (addDialogDateBtn) {
        addDialogDateBtn.addEventListener('click', () => openCalendar('dialog'));
    }

    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.addEventListener('click', toggleRecording);
    }

    const openAddDialogBtn = document.getElementById('openAddDialogBtn');
    if (openAddDialogBtn) {
        openAddDialogBtn.addEventListener('click', openAddDialog);
    }
}

function toggleLanguageMenu() {
    if (event) event.stopPropagation();
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
    const inputEls = document.querySelectorAll('.todo-input');
    inputEls.forEach(inputEl => {
        inputEl.placeholder = t('input_add_placeholder');
    });

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

    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) sortBtn.innerHTML = `<i class="bi bi-sort-down fs-4"></i> ${t('sort_priority')}`;

    if (languageButton) languageButton.title = t('language_hint');

    const prioritySelects = document.querySelectorAll('.priority-select');
    prioritySelects.forEach(prioritySelect => {
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
    });

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

    const calendarTodayBtn = document.getElementById('calendarTodayBtn');
    const calendarCloseBtn = document.getElementById('calendarCloseBtn');
    if (calendarTodayBtn) calendarTodayBtn.textContent = t('calendar_today');
    if (calendarCloseBtn) calendarCloseBtn.textContent = t('calendar_close');

    const calendarLegend = document.querySelector('.calendar-legend');
    if (calendarLegend) {
        const overdueSpan = calendarLegend.querySelector('[data-i18n="legend_overdue"]');
        const todaySpan = calendarLegend.querySelector('[data-i18n="legend_today"]');
        const upcomingSpan = calendarLegend.querySelector('[data-i18n="legend_upcoming"]');
        if (overdueSpan) overdueSpan.textContent = t('legend_overdue');
        if (todaySpan) todaySpan.textContent = t('legend_today');
        if (upcomingSpan) upcomingSpan.textContent = t('legend_upcoming');
    }

    const dialogTitle = document.getElementById('dialogTitle');
    if (dialogTitle) dialogTitle.textContent = t('dialog_add_task_title');

    const dialogPriorityLabel = document.getElementById('dialogPriorityLabel');
    if (dialogPriorityLabel) dialogPriorityLabel.textContent = t('dialog_choose_priority');

    const dialogAddBtn = document.getElementById('dialogAddButton');
    if (dialogAddBtn) dialogAddBtn.title = t('dialog_add_button');

    const dialogCancelBtn = document.getElementById('closeAddDialog');
    if (dialogCancelBtn) dialogCancelBtn.textContent = t('dialog_cancel_button');

    const dialogDateText = document.getElementById('addDialogDateText');
    if (dialogDateText && !dialogDateText.textContent.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dialogDateText.textContent = t('dialog_select_date');
    }

    const openAddDialogBtn = document.getElementById('openAddDialogBtn');
    if (openAddDialogBtn) {
        const span = openAddDialogBtn.querySelector('span');
        if (span) span.textContent = ` ${t('add_task_button')}`;
        openAddDialogBtn.setAttribute('aria-label', t('add_task_button'));
        openAddDialogBtn.title = t('add_task_button');
    }
}

// Open and close add todo dialog
function openAddDialog() {
    document.getElementById('addDialog').hidden = false;
    const selectedFormatted = formatDateKey(getSelectedDate()); 
    document.getElementById('addDialogDate_value').value = selectedFormatted;
    document.getElementById('addDialogDateText').textContent = selectedFormatted;
    setDateNavVisible(false); 
}

function closeAddDialog() {
    document.getElementById('addDialog').hidden = true;
    setDateNavVisible(true); 
}

// Speech-to-text recording
let mediaRecorder;
let audioChunks = [];

async function toggleRecording() {
    const micBtn = document.getElementById('micButton');
    if (!micBtn) return;

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        micBtn.classList.remove('recording');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                const response = await fetch('/api/stt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio: base64Audio })
                });
                const result = await response.json();
                const dialogTodoInput = document.getElementById('dialogTodoInput');
                if (dialogTodoInput) dialogTodoInput.value = result.text || '';
            };
        };

        mediaRecorder.start();
        micBtn.classList.add('recording');
    } catch (err) {
        alert(`Mic error: ${err.name} - ${err.message}`);
    }
}

// Bottom Navigation
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;

            if (view === 'language') {
                const wasOpen = languageMenu && !languageMenu.hidden;
                closeAllDialogs({ skip: 'language' });
                if (!wasOpen) toggleLanguageMenu();
                return;
            }

            if (view === 'add') {
                const addDialogEl = document.getElementById('addDialog');
                const wasOpen = addDialogEl && !addDialogEl.hidden;
                closeAllDialogs({ skip: 'add' });
                if (!wasOpen) {
                    openAddDialog();
                } else {
                    closeAddDialog();
                }
                return;
            }

            if (view === 'calendar') {
                closeAllDialogs({ skip: 'calendar' });
                openCalendar('home');
                return;
            }

            closeAllDialogs();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showView(view);
        });
    });
}

// Closes any currently-open dialog/menu so switching between
// nav actions never leaves something stuck open underneath.
// Pass { skip: 'calendar' | 'add' | 'language' } to avoid closing
// the one thing you're about to open right after calling this.
function closeAllDialogs(options = {}) {
    const skip = options.skip;

    if (skip !== 'add') {
        const addDialog = document.getElementById('addDialog');
        if (addDialog && !addDialog.hidden) addDialog.hidden = true;
    }

    const infoDialog = document.getElementById('infoDialog');
    if (infoDialog && !infoDialog.hidden) infoDialog.hidden = true;

    if (skip !== 'language') {
        hideLanguageMenu();
    }

    if (skip !== 'calendar') {
        closeCalendar();
    }
}

function showView(view) {
    document.querySelectorAll('.app-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(`view-${view}`);
    if (target) target.style.display = 'block';
}