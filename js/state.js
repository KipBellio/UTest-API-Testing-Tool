// js/state.js

const API_URL = 'http://localhost:3001/history';

export async function getHistory() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch history');
        return await res.json();
    } catch (err) {
        console.error('getHistory failed:', err);
        return [];
    }
}

export async function saveToHistory(method, url, body) {
    if (!url) return [];

    const newRequest = {
        method,
        url,
        body: body || '',
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequest)
        });

        // Keep only the newest 10
        let history = await getHistory();
        if (history.length > 10) {
            const sorted = history.sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            const oldest = sorted[sorted.length - 1];
            await deleteHistoryItem(oldest.id);
        }

        return await getHistory();
    } catch (err) {
        console.error('saveToHistory failed:', err);
        return [];
    }
}

export async function deleteHistoryItem(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        return await getHistory();
    } catch (err) {
        console.error('deleteHistoryItem failed:', err);
        return [];
    }
}
export async function updateHistoryItem(id, updates) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update');
        return await res.json();
    } catch (err) {
        console.error('updateHistoryItem failed:', err);
        return null;
    }
}