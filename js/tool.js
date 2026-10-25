// js/tool.js

import { sendApiRequest } from './api.js';
import { getHistory, saveToHistory, deleteHistoryItem } from './state.js';
import { formatResponseData } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab all the elements from your HTML
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const requestBodyInput = document.getElementById('json');
    const sendBtn = document.getElementById('sendr');
    
    const statusText = document.getElementById('status');
    const responseContainer = document.querySelector('.response-body');
    const historyContainer = document.querySelector('.response-history');

    // 2. Function to send the API Request
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
        responseContainer.textContent = ''; 

        try {
            // Call the API module
            const result = await sendApiRequest(method, url, bodyText);

            // Update Status
            statusText.textContent = `Status: ${result.status} ${result.statusText} (${result.timeTaken}ms)`;

            // Format and display data using utils module
            responseContainer.innerHTML = formatResponseData(result.data);

            // Save to history using state module
            saveToHistory(method, url);
            renderHistory();

        } catch (error) {
            statusText.textContent = 'Status: Error';
            responseContainer.textContent = `Failed to fetch:\n${error.message}\n\nNote: If this is a CORS error, the API does not allow browser requests.`;
        }
    }

    // 3. Function to handle History UI
    function renderHistory() {
        if (!historyContainer) return;
        
        // Get history from state module
        const history = getHistory();
        historyContainer.innerHTML = '';

        if (history.length === 0) {
            historyContainer.innerHTML = '<p style="font-family: monospace;">No history yet.</p>';
            return;
        }

        history.forEach((req, index) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.fontFamily = 'monospace';
            div.style.marginBottom = '5px';
            
            div.innerHTML = `
                <span>${req.method} - ${req.url}</span>
                <span>
                    <button class="reuse-btn" data-index="${index}" style="cursor:pointer; border:none; background:none; font-family: monospace;">reuse</button>
                    <button class="del-btn" data-index="${index}" style="cursor:pointer; border:none; background:none; font-family: monospace;">del</button>
                </span>
            `;
            historyContainer.appendChild(div);
        });

        // Add click events to "reuse" buttons
        document.querySelectorAll('.reuse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const req = history[index];
                methodSelect.value = req.method;
                urlInput.value = req.url;
                requestBodyInput.value = ''; 
            });
        });

        // Add click events to "del" buttons
        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteHistoryItem(index); // Use state module to delete
                renderHistory(); // Re-render UI
            });
        });
    }

    // 4. Event Listeners
    sendBtn.addEventListener('click', handleSendRequest);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendRequest(e);
        }
    });

    // Load history when page loads
    renderHistory();
});