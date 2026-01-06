// i18n.js - Internationalization module

let LANGS = {};
let translations = {};
let currentLang = 'en';

async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) throw new Error('Failed to load translations');
        const data = await response.json();
        LANGS = data.langs;
        translations = data.translations;
        currentLang = detectInitialLang();
    } catch (err) {
        console.error('Error loading translations:', err);
        // Fallback to English-only mode
        LANGS = { en: 'en-US' };
        translations = { en: {} };
        currentLang = 'en';
    }
}

function detectInitialLang() {
    const stored = localStorage.getItem('lang');
    if (stored && LANGS[stored]) return stored;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('th')) return 'th';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('sv')) return 'sv';
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('uk')) return 'uk';
    if (nav.startsWith('fi')) return 'fi';
    if (nav.startsWith('de')) return 'de';
    if (nav.startsWith('it')) return 'it';
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
}

function t(key, params = {}) {
    const table = translations[currentLang] || translations.en;
    let str = table[key] || translations.en[key] || key;
    Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
}

function getLocale() {
    return LANGS[currentLang] || LANGS.en;
}

function getCurrentLang() {
    return currentLang;
}

function setLang(lang) {
    if (!LANGS[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
}

function getMonthNames() {
    const table = translations[currentLang] || translations.en;
    return table.monthNames || translations.en.monthNames;
}

function getWeekdayNames() {
    const table = translations[currentLang] || translations.en;
    return table.weekdayNames || translations.en.weekdayNames;
}
