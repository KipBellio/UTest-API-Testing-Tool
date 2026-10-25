// tests/utils.test.js

import { formatResponseData } from '../js/utils.js';

function runTests() {
    console.log("Running utils tests...");

    // Test 1: Object formatting with syntax highlighting
const testObj = { name: "UTest", type: "API Tool" };
const resultObj = formatResponseData(testObj);

if (
    resultObj.includes('\n') &&
    resultObj.includes('<span class="json-key">"name":</span>') &&
    resultObj.includes('<span class="json-string">"UTest"</span>')
) {
    console.log("✅ Test 1 Passed: Object formatted with HTML highlighting.");
} else {
    console.error("❌ Test 1 Failed: Object was not formatted correctly.");
    console.log("   Actual output:", resultObj);
}

    // Test 2: String formatting (should not break)
    const testStr = "Just a raw string response";
    const resultStr = formatResponseData(testStr);
    
    if (resultStr === testStr) {
        console.log("✅ Test 2 Passed: String returned as-is.");
    } else {
        console.error("❌ Test 2 Failed: String was modified incorrectly.");
    }
}

runTests();