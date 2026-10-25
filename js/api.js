// js/api.js

export async function sendApiRequest(method, url, bodyText) {
    
    // My Cloudflare Worker URL
    const workerUrl = 'https://utestproxy.kipkoechdun676.workers.dev/';
    
    // Worker and my target url
    const proxyUrl = `${workerUrl}?url=${encodeURIComponent(url)}`;

    // Fetch options
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Add request body if not a GET method and body is there
    if (method !== 'GET' && bodyText) {
        options.body = bodyText;
    }

    const startTime = performance.now();
    
    try {
        // Make the request using my worker
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