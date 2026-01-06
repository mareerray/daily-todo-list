# Code Structure Documentation

The application has been refactored into a modular architecture for better maintainability and organization.

## Module Organization

### `/js` Directory Structure

```
js/
├── app.js         # Main application initialization
├── i18n.js        # Internationalization & translation
├── storage.js     # LocalStorage operations
├── calendar.js    # Calendar functionality
├── todos.js       # Todo CRUD operations
└── ui.js          # UI components & language menu
```

## Module Descriptions

### `app.js` (Main Entry Point)
- **Purpose**: Application initialization and coordination
- **Key Functions**:
  - `initializeApp()`: Main initialization function
  - Service worker registration
- **Dependencies**: All other modules
- **Size**: ~25 lines

### `i18n.js` (Internationalization)
- **Purpose**: Translation and language management
- **Key Functions**:
  - `loadTranslations()`: Loads translations from JSON
  - `t(key, params)`: Translation function
  - `setLang(lang)`: Change language
  - `getCurrentLang()`: Get current language
  - `getMonthNames()`: Get localized month names
  - `getWeekdayNames()`: Get localized weekday names
- **Dependencies**: None
- **Size**: ~75 lines

### `storage.js` (Data Persistence)
- **Purpose**: LocalStorage operations for todos
- **Key Functions**:
  - `saveTodoToStorage(todo)`: Save a todo
  - `getTodosFromStorage()`: Get all todos
  - `removeTodoFromStorage(todoText)`: Delete a todo
  - `getTodosForDate(dateKey)`: Get todos for specific date
- **Dependencies**: None
- **Size**: ~45 lines

### `calendar.js` (Calendar Widget)
- **Purpose**: Calendar UI and date management
- **Key Functions**:
  - `initCalendar()`: Initialize calendar event listeners
  - `renderCalendar()`: Render calendar grid
  - `selectDate(date)`: Select a date
  - `updateDateDisplay()`: Update date display with Buddhist calendar for Thai
  - `formatDateKey(date)`: Format date for storage keys
  - `getSelectedDate()`: Get currently selected date
- **Dependencies**: i18n.js
- **Size**: ~180 lines

### `todos.js` (Todo Management)
- **Purpose**: Todo creation, display, filtering, and sorting
- **Key Functions**:
  - `initTodos()`: Initialize todo event listeners
  - `addTodo(event)`: Create new todo
  - `deleteCheck(e)`: Handle delete/complete actions
  - `displayTodosForDate(date)`: Display todos for selected date
  - `filterTodo(e)`: Filter todos by status/priority
  - `sortTodo()`: Sort todos by priority
  - `getPriorityBadgeTitle(priority)`: Get localized priority title
- **Dependencies**: i18n.js, storage.js, calendar.js
- **Size**: ~230 lines

### `ui.js` (User Interface)
- **Purpose**: UI components and translation application
- **Key Functions**:
  - `initUI()`: Initialize UI event listeners
  - `applyTranslations()`: Apply translations to UI elements
  - `toggleLanguageMenu()`: Toggle language dropdown
  - `setActiveLanguageItem()`: Highlight selected language
- **Dependencies**: i18n.js, calendar.js, todos.js
- **Size**: ~140 lines

## Loading Order

Scripts must be loaded in this specific order in `index.html`:

```html
<script src="js/i18n.js"></script>      <!-- 1. Foundation: translations -->
<script src="js/storage.js"></script>   <!-- 2. Data layer -->
<script src="js/calendar.js"></script>  <!-- 3. Calendar (uses i18n) -->
<script src="js/todos.js"></script>     <!-- 4. Todos (uses i18n, storage, calendar) -->
<script src="js/ui.js"></script>        <!-- 5. UI (uses all above) -->
<script src="js/app.js"></script>       <!-- 6. Main initialization -->
```

## Benefits of Modular Architecture

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Maintainability**: Easier to locate and fix issues
3. **Scalability**: Easy to add new features or modules
4. **Readability**: Smaller files are easier to understand
5. **Reusability**: Modules can be reused in other projects
6. **Testing**: Individual modules can be tested independently

## Migration Notes

- The original `app.js` has been backed up as `app.js.backup`
- All functionality remains identical to the original monolithic version
- Service worker cache updated to v20 to include new file structure
- No changes to HTML/CSS except script loading order

## Adding New Features

When adding new features:
1. Determine which module the feature belongs to
2. If it doesn't fit existing modules, create a new module file
3. Add the new module to `index.html` in appropriate load order
4. Add the new module to service worker cache in `sw.js`
5. Update this documentation

## Development Tips

- Keep modules loosely coupled
- Use clear function names that describe what they do
- Document any cross-module dependencies
- Test after refactoring to ensure no regressions
