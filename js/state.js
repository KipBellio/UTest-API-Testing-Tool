// js/state.js

const STORAGE_KEY = 'apiHistory';

export function getHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveToHistory(method, url) {
    if (!url) return getHistory();
    
    let history = getHistory();
    const newRequest = { method: method, url: url };
    
    // Remove duplicates
    history = history.filter(req => !(req.method === method && req.url === url));
    
    // Add to the top
    history.unshift(newRequest);
    
    // Keep only the last 10 requests
    if (history.length > 10) history.pop();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
}

export function deleteHistoryItem(index) {
    let history = getHistory();
    history.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
}