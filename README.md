# Todo List App

A modern, responsive todo list application built with vanilla JavaScript, featuring priority management, filtering, and sorting capabilities.

🔗 **[Live Demo: https://mareerray.github.io/daily-todo-list/](https://mareerray.github.io/daily-todo-list/)**

## Features

📅 **Daily Task Organization**
- Date-based task management with date picker
- Navigate between dates using previous/next day buttons
- View and manage tasks specific to each date
- Tasks are automatically sorted by priority for each date

✨ **Priority System**
- Three priority levels: High (do it now), Medium (finish soon), Low (plan for later)
- Visual priority indicators with color-coded badges
- Pulsing animation for high-priority tasks

🔍 **Smart Filtering**
- Filter by completion status (All, Completed, Active)
- Filter by priority level (High, Medium, Low)

📊 **Priority Sorting**
- Sort active tasks by priority with one click
- Automatically displays uncompleted tasks sorted from high to low priority

💾 **Data Persistence**
- Tasks are saved to localStorage with their due dates
- Data persists across browser sessions
- Tasks organized and retrieved by date

📱 **Responsive Design**
- Mobile-friendly layout with optimized controls
- Glass morphism UI with gradient accents
- Smooth animations and transitions

🌐 **Language Options**
- Built-in language selector (English, ไทย, Español, Svenska, Русский, Українська, Suomi, Deutsch, Italiano)
- Auto-detects your browser language on first load
- Persists your choice in localStorage
- Translates UI labels, messages, and date formatting

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with custom properties, flexbox, and media queries
- **Vanilla JavaScript** - Application logic and DOM manipulation
- **Bootstrap Icons** - Modern icon set
- **localStorage API** - Data persistence

## Usage

1. **Select a Date**: Use the date picker or previous/next buttons to navigate between dates
2. **Add a Task**: Enter your task, select a priority level, and click the + button
3. **Complete a Task**: Click the checkmark icon to mark as complete
4. **Delete a Task**: Click the trash icon to remove a task
5. **Filter Tasks**: Use the dropdown to filter by status or priority
6. **Sort Tasks**: Click the "Priority" button to view active tasks sorted by priority
7. **Navigate Dates**: Tasks are automatically organized by date, allowing you to plan ahead or review past tasks
8. **Change Language**: Use the language dropdown in the header to switch UI language. Your choice is remembered.

## Project Structure

```
My-ToDo-List/
├── index.html      # Main HTML structure
├── style.css       # Styles and responsive design
├── app.js          # Application logic
├── sw.js           # Service worker for offline caching
└── README.md       # Project documentation
```

## Author

**Mayuree Reunsati**
- GitHub: [@mareerray](https://github.com/mareerray)
- LinkedIn: [Mayuree Reunsati](https://linkedin.com/in/mayuree-reunsati)

## Acknowledgments

Initial project structure inspired by Dev Ed's Vanilla JavaScript tutorial. Significantly enhanced with custom features including priority system, filtering, sorting, and modern UI design.
