// js/tool.js

import { sendApiRequest } from './api.js';
import { getHistory, saveToHistory, deleteHistoryItem, updateHistoryItem } from './state.js';
import { formatResponseData } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const requestBodyInput = document.getElementById('json');
    const sendBtn = document.getElementById('sendr');

    const statusText = document.getElementById('status');
    const responseContainer = document.querySelector('.response-body');
    const historyContainer = document.querySelector('.response-history');

    // --- Send Request ---
    async function handleSendRequest(e) {
        if (e) e.preventDefault();

        const method = methodSelect.value;
        const url = urlInput.value;
        const bodyText = requestBodyInput.value;

        if (!url) {
            alert('Please enter an API URL');
            return;
        }

        statusText.textContent = 'Status: Loading...';
        responseContainer.innerHTML = '';
        sendBtn.disabled = true;

        try {
            const result = await sendApiRequest(method, url, bodyText);

            statusText.textContent = `Status: ${result.status} ${result.statusText} (${result.timeTaken}ms)`;
            responseContainer.innerHTML = formatResponseData(result.data);

            await saveToHistory(method, url, bodyText);
            await renderHistory();

        } catch (error) {
            statusText.textContent = 'Status: Error';
            responseContainer.textContent = `Failed to fetch:\n${error.message}\n\nNote: If this is a CORS error, the API does not allow browser requests.`;
        } finally {
            sendBtn.disabled = false;
        }
    }

    // --- Render History (async) ---
    async function renderHistory() {
        if (!historyContainer) return;

        const history = await getHistory();
        historyContainer.innerHTML = '';

        if (!history || history.length === 0) {
            historyContainer.innerHTML = '<p style="font-family: monospace;">No history yet.</p>';
            return;
        }

        // Newest first
        const sorted = [...history].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sorted.forEach((req) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.fontFamily = 'monospace';
            div.style.marginBottom = '5px';

            div.innerHTML = `
    <span>${req.method} - ${req.url}</span>
    <span>
        <button class="reuse-btn" data-id="${req.id}" style="cursor:pointer; border:none; background:none; font-family: monospace;">reuse</button>
        <button class="edit-btn" data-id="${req.id}" style="cursor:pointer; border:none; background:none; font-family: monospace;">edit</button>
        <button class="del-btn" data-id="${req.id}" style="cursor:pointer; border:none; background:none; font-family: monospace;">del</button>
    </span>
`;
            historyContainer.appendChild(div);
        });

         // REUSE LISTENER GOES HERE
    document.querySelectorAll('.reuse-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const fresh = await getHistory();
            const req = fresh.find(r => String(r.id) === String(id));
            if (!req) return;

            methodSelect.value = req.method;
            urlInput.value = req.url;
            requestBodyInput.value = req.body || '';
        });
    });

    // EDIT LISTENER GOES HERE
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const fresh = await getHistory();
            const req = fresh.find(r => String(r.id) === String(id));
            if (!req) return;

            const newBody = prompt(
                `Edit request body for ${req.method} ${req.url}\n\nLeave blank to clear it.`,
                req.body || ''
            );
            if (newBody === null) return;

            await updateHistoryItem(id, { body: newBody });
            await renderHistory();
        });
    });

        // Delete
        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                await deleteHistoryItem(id);
                await renderHistory();
            });
        });
    }

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleSendRequest);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendRequest(e);
        }
    });

    // --- Initial Load ---
    renderHistory();
});