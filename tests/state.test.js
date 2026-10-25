// tests/state.test.js

// Mock fetch globally before importing state.js
let mockResponse = [];
let mockOk = true;

globalThis.fetch = async (url, options = {}) => {
    if (options.method === 'DELETE' || options.method === 'PATCH') {
        return { ok: mockOk, json: async () => ({}) };
    }
    if (options.method === 'POST') {
        return { ok: mockOk, json: async () => ({ id: '99' }) };
    }
    // default GET
    return { ok: mockOk, json: async () => mockResponse };
};

// Mock window/localStorage not needed — state.js uses fetch now
const { getHistory, saveToHistory, deleteHistoryItem, updateHistoryItem } = await import('../js/state.js');

let passed = 0, failed = 0;

function assert(name, condition) {
    if (condition) { console.log(`✅ ${name}`); passed++; }
    else { console.error(`❌ ${name}`); failed++; }
}

// --- Test 1: getHistory returns empty array ---
mockResponse = [];
let h = await getHistory();
assert('getHistory returns [] on empty', Array.isArray(h) && h.length === 0);

// --- Test 2: getHistory returns records ---
mockResponse = [{ id: '1', method: 'GET', url: 'https://x.com' }];
h = await getHistory();
assert('getHistory returns records', h.length === 1 && h[0].url === 'https://x.com');

// --- Test 3: getHistory handles fetch failure ---
mockOk = false;
h = await getHistory();
assert('getHistory returns [] on fetch error', Array.isArray(h));
mockOk = true;

// --- Test 4: saveToHistory ignores empty url ---
const r1 = await saveToHistory('GET', '', '');
assert('saveToHistory returns [] if no url', Array.isArray(r1));

// --- Test 5: saveToHistory posts record ---
mockResponse = [{ id: '1' }]; // simulate 1 record after post
const r2 = await saveToHistory('POST', 'https://api.com/x', '{"a":1}');
assert('saveToHistory returns updated list', Array.isArray(r2));

// --- Test 6: deleteHistoryItem sends DELETE ---
const r3 = await deleteHistoryItem('1');
assert('deleteHistoryItem returns array', Array.isArray(r3));

// --- Test 7: updateHistoryItem sends PATCH ---
const r4 = await updateHistoryItem('1', { body: 'new' });
assert('updateHistoryItem returns object', r4 !== null);

// --- Summary ---
console.log(`\n🧪 state.test.js — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);