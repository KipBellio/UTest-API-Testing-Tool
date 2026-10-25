// js/utils.js

export function formatResponseData(data) {
    // 1. Convert the object to a formatted JSON string
    let jsonString = "";
    if (typeof data === 'object' && data !== null) {
        jsonString = JSON.stringify(data, null, 2);
    } else {
        jsonString = String(data);
    }

    // 2. Escape HTML characters to prevent XSS attacks
    jsonString = jsonString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 3. Use Regex to wrap different parts of the JSON in HTML spans
    // This is a clever trick to colorize JSON without external libraries
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number'; // Default to number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key'; // It's a key
            } else {
                cls = 'json-string'; // It's a string value
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
    });
}