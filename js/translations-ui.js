// translations-ui.js - Updates visible UI text after a language change


function setText(id, translationKey) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = t(translationKey);
    }
}


function setTitle(id, translationKey) {
    const element = document.getElementById(id);

    if (element) {
        element.title = t(translationKey);
    }
}


function setPlaceholder(id, translationKey) {
    const input = document.getElementById(id);

    if (input) {
        input.placeholder = t(translationKey);
    }
}


function setCloseButtonLabels() {
    const closeText = t('calendar_close');

    ['closeAddDialog', 'searchCloseBtn', 'closeInfoDialog'].forEach(id => {
        const button = document.getElementById(id);

        if (button) {
            button.setAttribute('aria-label', closeText);
            button.title = closeText;
        }
    });
}


function translateTaskInputs() {
    const taskInputs = document.querySelectorAll('.todo-input');

    taskInputs.forEach(input => {
        input.placeholder = t('input_add_placeholder');
    });

    setPlaceholder('searchInput', 'search_placeholder');
}


function translateFilterOptions() {
    const filter = document.querySelector('.filter-todo');

    if (!filter) return;

    const translationKeys = {
        all: 'filter_all',
        completed: 'filter_completed',
        uncompleted: 'filter_uncompleted',
        high: 'filter_high',
        medium: 'filter_medium',
        low: 'filter_low'
    };

    filter.querySelectorAll('option').forEach(option => {
        const key = translationKeys[option.value];

        if (key) {
            option.textContent = t(key);
        }
    });
}


function translatePrioritySelects() {
    const priorities = {
        high: {
            icon: '🔴',
            label: 'priority_label_high',
            description: 'legend_high_desc'
        },
        medium: {
            icon: '🟡',
            label: 'priority_label_medium',
            description: 'legend_medium_desc'
        },
        low: {
            icon: '🔵',
            label: 'priority_label_low',
            description: 'legend_low_desc'
        }
    };

    document.querySelectorAll('.priority-select').forEach(select => {
        select.querySelectorAll('option').forEach(option => {
            const priority = priorities[option.value];

            if (!priority) return;

            const label = t(priority.label);
            const description = t(priority.description);

            option.textContent = `${priority.icon} ${label}`;
            option.title = `${label} - ${description}`;
        });
    });
}


function translatePriorityLegend() {
    const legend = document.querySelector('.priority-legend');

    if (!legend) return;

    const labels = {
        high: 'legend_high_desc',
        medium: 'legend_medium_desc',
        low: 'legend_low_desc'
    };

    legend.querySelectorAll('.legend-item').forEach(item => {
        const dot = item.querySelector('.legend-dot');

        if (!dot) return;

        const priority = Object.keys(labels).find(name => dot.classList.contains(name));

        if (priority) {
            item.innerHTML = `
                <span class="legend-dot ${priority}"></span>
                ${t(labels[priority])}
            `;
        }
    });
}


function translateCalendar() {
    setText('calendarTodayBtn', 'calendar_today');
    setText('calendarCloseBtn', 'calendar_close');

    const calendarLegend = document.querySelector('.calendar-legend');

    if (!calendarLegend) return;

    const translationKeys = {
        legend_overdue: 'legend_overdue',
        legend_today: 'legend_today',
        legend_upcoming: 'legend_upcoming'
    };

    Object.entries(translationKeys).forEach(([selectorKey, translationKey]) => {
        const element = calendarLegend.querySelector(`[data-i18n="${selectorKey}"]`);

        if (element) {
            element.textContent = t(translationKey);
        }
    });
}


function translateTaskDialog() {
    setText('dialogTitle', 'dialog_add_task_title');
    setText('dialogPriorityLabel', 'dialog_choose_priority');

    const addButton = document.getElementById('dialogAddButton');

    if (addButton) {
        addButton.setAttribute('aria-label', t('dialog_add_button'));
        addButton.title = t('dialog_add_button');
    }

    const dateText = document.getElementById('addDialogDateText');

    // Do not replace a real selected date with "Select date".
    if (dateText && !dateText.textContent.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateText.textContent = t('dialog_select_date');
    }
}


function translateCompleteDialog() {
    setText('completeDialogTitle', 'dialog_complete_task_title');

    const completeOnlyBtn = document.getElementById('completeOnlyBtn');

    if (completeOnlyBtn) {
        const label = completeOnlyBtn.querySelector('span');

        if (label) {
            label.textContent = t('dialog_complete_only');
        }
    }

    const repeatBtn = document.getElementById('completeAndRepeatBtn');

    if (repeatBtn) {
        const label = repeatBtn.querySelector('span');

        if (label) {
            label.textContent = t('dialog_complete_and_repeat');
        }
    }

    setText('completeCancelBtn', 'dialog_cancel_button');
}


function translateDeleteDialog() {
    setText('deleteDialogTitle', 'dialog_delete_task_title');

    const deleteBtn = document.getElementById('deleteConfirmBtn');

    if (deleteBtn) {
        const label = deleteBtn.querySelector('span');

        if (label) {
            label.textContent = t('dialog_delete_confirm');
        }
    }

    setText('deleteCancelBtn', 'dialog_cancel_button');
}


function translateSearchDialog() {
    setText('searchDialogTitle', 'search_dialog_title');
    setPlaceholder('searchInput', 'search_placeholder');
}


function translateAddTaskButton() {
    const addButton = document.getElementById('openAddDialogBtn');

    if (!addButton) return;

    const label = addButton.querySelector('span');

    if (label) {
        label.textContent = ` ${t('add_task_button')}`;
    }

    addButton.setAttribute('aria-label', t('add_task_button'));
    addButton.title = t('add_task_button');
}


function applyTranslations() {
    // Inputs, dropdowns, and visible task controls.
    translateTaskInputs();
    translateFilterOptions();
    translatePrioritySelects();
    translatePriorityLegend();

    // Calendar labels and legend.
    translateCalendar();

    // Dialog titles, actions, and placeholders.
    translateTaskDialog();
    translateCompleteDialog();
    translateDeleteDialog();
    translateSearchDialog();

    // Icon-only buttons keep their icons but receive translated labels.
    setCloseButtonLabels();

    // Navigation and shared controls.
    translateAddTaskButton();

    if (languageButton) {
        languageButton.title = t('language_hint');
        languageButton.setAttribute('aria-label', t('language_hint'));
    }
}