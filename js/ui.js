// ui.js - UI/Language Menu module

const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');

function setDateNavVisible(visible) {
    [prevDateBtn, calendarBtn, nextDateBtn].forEach(btn => {
        if (btn) btn.hidden = !visible;
    });
}

function initUI() {
    // ----- Welcome dialog -----
    const welcomeDialog = document.getElementById('welcomeDialog');
    const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');

    if (closeWelcomeBtn && welcomeDialog) {
        closeWelcomeBtn.addEventListener('click', () => {
            welcomeDialog.hidden = true;
            localStorage.setItem('hasVisitedBefore', 'true');
        });
    }

    // ----- Info dialog -----
    const infoDialog = document.getElementById('infoDialog');
    const openInfoBtn = document.getElementById('openInfoBtn');
    const closeInfoDialogBtn = document.getElementById('closeInfoDialog');

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

    // ----- Search dialog -----
    const searchCloseBtn = document.getElementById('searchCloseBtn');

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeSearchDialog);
    }

    // ----- Add/edit task dialog -----
    const addDialog = document.getElementById('addDialog');
    const openAddDialogBtn = document.getElementById('openAddDialogBtn');
    const closeAddDialogBtn = document.getElementById('closeAddDialog');
    const dialogAddButton = document.getElementById('dialogAddButton');
    const addDialogDateBtn = document.getElementById('addDialogDateBtn');

    // Open the task dialog from the top add button.
    if (openAddDialogBtn) {
        openAddDialogBtn.addEventListener('click', openAddDialog);
    }

    // Close the task dialog if a close button exists.
    if (closeAddDialogBtn) {
        closeAddDialogBtn.addEventListener('click', closeAddDialog);
    }

    // Close the task dialog when the user clicks its backdrop.
    if (addDialog) {
        addDialog.addEventListener('click', (e) => {
            if (e.target === addDialog) {
                closeAddDialog();
            }
        });
    }

    // Save a new task or save edits from the dialog.
    if (dialogAddButton) {
        dialogAddButton.addEventListener('click', addTodoFromDialog);
    }

    // Open the calendar while choosing a due date.
    if (addDialogDateBtn) {
        addDialogDateBtn.addEventListener('click', () => {
            openCalendar('dialog');
        });
    }

    // ----- Voice input -----
    const micButton = document.getElementById('micButton');

    if (micButton) {
        micButton.addEventListener('click', toggleRecording);
    }

    // ----- Language menu -----
    if (languageButton) {
        languageButton.addEventListener('click', toggleLanguageMenu);
    }

    if (languageMenu) {
        languageMenu.addEventListener('click', onLanguageMenuClick);
    }

    // Close the language menu when clicking outside it.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-menu-wrapper')) {
            hideLanguageMenu();
        }
    });

    // Close temporary UI when the user presses Escape.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideLanguageMenu();
            closeCalendar();
            closeSearchDialog();
        }
    });
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

// Open and close add todo dialog
function openAddDialog() {
    editingTodoId = null; // ensure we're in "add new" mode, not leftover edit mode

    document.getElementById('addDialog').hidden = false;
    const selectedFormatted = formatDateKey(getSelectedDate());

    document.getElementById('addDialogDate_value').value = selectedFormatted;

    document.getElementById('addDialogDateText').textContent = selectedFormatted;

    const dialogTitle = document.getElementById('dialogTitle');
    if (dialogTitle) dialogTitle.textContent = t('dialog_add_task_title') || 'Add a task';

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

            if (view === 'search') {
                const searchDialogEl = document.getElementById('searchDialog');
                const wasOpen = searchDialogEl && !searchDialogEl.hidden;
                closeAllDialogs({ skip: 'search' });
                if (!wasOpen) {
                    openSearchDialog();
                } else {
                    closeSearchDialog();
                }
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

    const completeDialog = document.getElementById('completeDialog');
    if (completeDialog && !completeDialog.hidden) completeDialog.hidden = true;

    const deleteDialog = document.getElementById('deleteDialog');
    if (deleteDialog && !deleteDialog.hidden) deleteDialog.hidden = true;

    const searchDialog = document.getElementById('searchDialog');
    if (searchDialog && !searchDialog.hidden) {
        searchDialog.hidden = true;
    }

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