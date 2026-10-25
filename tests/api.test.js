// tests/api.test.js

let mockStatus = 200;
let mockBody = '{"ok":true}';
let mockDelayMs = 0;

globalThis.fetch = async () => {
    if (mockDelayMs) await new Promise(r => setTimeout(r, mockDelayMs));
    return {
        status: mockStatus,
        statusText: mockStatus === 200 ? 'OK' : 'Error',
        text: async () => mockBody
    };
};

const { sendApiRequest } = await import('../js/api.js');

let passed = 0, failed = 0;

function assert(name, cond) {
    if (cond) { console.log(`✅ ${name}`); passed++; }
    else { console.error(`❌ ${name}`); failed++; }
}

// --- Test 1: GET returns 200 ---
mockStatus = 200; mockBody = '{"ok":true}';
let r = await sendApiRequest('GET', 'https://x.com', '');
assert('GET returns 200', r.status === 200);
assert('GET parses JSON', r.data.ok === true);
assert('GET measures time', typeof r.timeTaken === 'number');

// --- Test 2: POST parses JSON response ---
mockStatus = 201; mockBody = '{"id":"1"}';
r = await sendApiRequest('POST', 'https://x.com', '{"a":1}');
assert('POST returns 201', r.status === 201);
assert('POST parses body', r.data.id === '1');

// --- Test 3: non-JSON response is returned as raw string ---
mockStatus = 200; mockBody = 'plain text response';
r = await sendApiRequest('GET', 'https://x.com', '');
assert('Non-JSON returns string', typeof r.data === 'string');

// --- Test 4: error status ---
mockStatus = 404; mockBody = '{"error":"not found"}';
r = await sendApiRequest('GET', 'https://x.com', '');
assert('404 status preserved', r.status === 404);

// --- Summary ---
console.log(`\n🧪 api.test.js — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);