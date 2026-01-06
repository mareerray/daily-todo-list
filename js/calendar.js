// calendar.js - Calendar functionality module

let selectedDate = new Date();
let currentCalendarMonth = new Date();

// DOM Elements
const calendarBtn = document.getElementById('calendarBtn');
const prevDateBtn = document.getElementById('prevDateBtn');
const nextDateBtn = document.getElementById('nextDateBtn');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const calendarOverlay = document.getElementById('calendarOverlay');
const calendarDays = document.getElementById('calendarDays');
const calendarMonthYear = document.getElementById('calendarMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarTodayBtn = document.getElementById('calendarTodayBtn');
const calendarCloseBtn = document.getElementById('calendarCloseBtn');

function initCalendar() {
    calendarBtn.addEventListener('click', openCalendar);
    prevDateBtn.addEventListener('click', () => changeDate(-1));
    nextDateBtn.addEventListener('click', () => changeDate(1));
    prevMonthBtn.addEventListener('click', () => changeCalendarMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeCalendarMonth(1));
    calendarTodayBtn.addEventListener('click', selectToday);
    calendarCloseBtn.addEventListener('click', closeCalendar);
    calendarOverlay.addEventListener('click', (e) => {
        if (e.target === calendarOverlay) closeCalendar();
    });
}

function openCalendar() {
    currentCalendarMonth = new Date(selectedDate);
    renderCalendar();
    calendarOverlay.classList.add('active');
}

function closeCalendar() {
    calendarOverlay.classList.remove('active');
}

function selectToday() {
    selectedDate = new Date();
    currentCalendarMonth = new Date();
    renderCalendar();
    updateDateDisplay();
    displayTodosForDate(selectedDate);
}

function changeCalendarMonth(direction) {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + direction);
    renderCalendar();
}

function renderCalendar() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    
    // Display month and year (use Buddhist calendar for Thai)
    const displayYear = getCurrentLang() === 'th' ? year + 543 : year;
    const monthNames = getMonthNames();
    calendarMonthYear.textContent = `${monthNames[month]} ${displayYear}`;
    
    // Update weekday headers
    const weekdayNames = getWeekdayNames();
    const weekdayElements = document.querySelectorAll('.calendar-weekday');
    weekdayElements.forEach((el, index) => {
        el.textContent = weekdayNames[index];
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Clear calendar
    calendarDays.innerHTML = '';
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(dayDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;
        
        const currentDate = new Date(year, month, day);
        
        // Check if today
        if (currentDate.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }
        
        // Check if selected date
        if (currentDate.toDateString() === selectedDate.toDateString()) {
            dayDiv.classList.add('selected');
        }
        
        dayDiv.addEventListener('click', () => selectDate(currentDate));
        calendarDays.appendChild(dayDiv);
    }
    
    // Add next month's days to fill the grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
}

function selectDate(date) {
    selectedDate = new Date(date);
    updateDateDisplay();
    displayTodosForDate(selectedDate);
    closeCalendar();
}

function changeDate(days) {
    selectedDate.setDate(selectedDate.getDate() + days);
    updateDateDisplay();
    displayTodosForDate(selectedDate);
}

function updateDateDisplay() {
    const locale = getLocale();
    const options = { 
        weekday: 'short',
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
    };
    
    // For Thai, use Buddhist calendar
    if (getCurrentLang() === 'th') {
        const dtf = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', options);
        selectedDateDisplay.textContent = dtf.format(selectedDate);
    } else {
        selectedDateDisplay.textContent = selectedDate.toLocaleDateString(locale, options);
    }
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getSelectedDate() {
    return selectedDate;
}
