// js/api.js

export async function sendApiRequest(method, url, bodyText) {
    
    // 1. YOUR Cloudflare Worker URL
    const workerUrl = 'https://utestproxy.kipkoechdun676.workers.dev/';
    
    // 2. Combine your worker with the target URL
    const proxyUrl = `${workerUrl}?url=${encodeURIComponent(url)}`;

    // 3. Setup Fetch Options
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Only add body if it's not a GET request and if there is text
    if (method !== 'GET' && bodyText) {
        options.body = bodyText;
    }

    const startTime = performance.now();
    
    try {
        // 4. Make the Request using YOUR Worker
        const response = await fetch(proxyUrl, options);
        const endTime = performance.now();
        const timeTaken = Math.round(endTime - startTime);

        const textData = await response.text();
        
        let formattedData;
        try {
            formattedData = JSON.parse(textData);
        } catch (error) {
            formattedData = textData;
        }

        return {
            status: response.status,
            statusText: response.statusText,
            timeTaken: timeTaken,
            data: formattedData
        };
        
    } catch (error) {
        throw new Error("Failed to connect to the API or Proxy. " + error.message);
    }
}