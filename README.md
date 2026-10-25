## Project title
UTest API Testing Tool

## Description
A simple webtool that allows users to test APIs for their functionality by inputting a HTTP method and a URL link together with a request body for GET requests, inspecting responses and errors, and reusing, editing and deleting their request history all in one place.

## Live demo link
* Figma wireframe link: 
* Live application link:
* GitHub repo link:

## Features list
- Send requests with all five common HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Editable request body (JSON) for non-GET methods
- Formatted response output with syntax highlighting
- Response timing and HTTP status code display
- Persistent request history with `reuse`, `edit`, and `delete` actions
- Cloudflare Worker proxy to bypass CORS restrictions on third-party APIs
- Request history stored in a deployed JSON Server REST backend

## Technologies used
* Frontend : HTML5, CSS3, Vanilla JavaScript (ES Modules)
* Backend (history): JSON Server v0.17 
* Proxy: Cloudflare Workers 
* Testing: Node.js (native `assert`, mocked `fetch`) 
* Hosting: GitHub Pages (frontend), Render (backend) 
* Design: Figma 

## How to run locally
* Prerequisites
1. Install Node.js (version 18 or higher).
2. Open your terminal (or VS Code terminal) and ensure you are in the root folder of the project (UTest-API-Testing-Tool).
* Install the project dependencies by running: npm install
* In your current terminal, start the database server by running: npm start
* Verify it works: Open http://localhost:3001/history in your browser. You should see [] or your saved request history.
(Leave this terminal running.)
* Open a second, new terminal tab/window and navigate back to the project root folder.
* Start the frontend development server by running: npx live-server
* The terminal will output a local URL (usually http://127.0.0.1:8080). Open that URL in your browser.
* To open the API tester, navigate to http://127.0.0.1:8080/tool.html (or click the "Get Started" button on the home page).
* Stop the Servers
* When you are done testing, click into each terminal window and press Ctrl + C to stop both servers cleanly.

## What i learned 
* How CORS actually works — and how to beat it with a proxy
I learned that the browser blocks cross-origin requests by default, and that this isn't a bug in your code. I built a Cloudflare Worker to forward requests server-side, added Access-Control-Allow-Origin headers, and learned that preflight OPTIONS requests need their own handling for POST/PUT/PATCH/DELETE.

* How to build a real backend with JSON Server and deploy it
I moved from localStorage to a real REST API with db.json, wrote GET/POST/PATCH/DELETE endpoints, and learned why server.listen(port, '0.0.0.0') is required on cloud hosts like Render (binding to localhost makes your server unreachable).

* How to write and run automated tests with mocked dependencies
I wrote unit tests for pure logic (utils.js), mock-based tests for fetch in api.js, and mock-based tests for localStorage in state.js. I learned to mock browser globals (DOMParser, localStorage) in Node.js, and how "type": "module" and ../js/ import paths affect test execution.

* How to structure JavaScript into ES Modules
I split one giant file into tool.js, api.js, state.js, and utils.js, with clean import/export boundaries. I learned that when a function becomes async (like state.js after adding fetch), every caller must await it — and that DOM-bound modules (tool.js) are hard to unit test compared to pure modules (utils.js).

## Known limitations
The deployed backend runs on Render's free plan, which uses an ephemeral filesystem. This means the server's db.json file is rebuilt from the version committed to GitHub whenever the container restarts. A restart happens automatically after about 15 minutes of inactivity (the free tier sleeps), on every redeploy, or if the service crashes.

As a result, requests saved, edited, or deleted through the deployed frontend will persist during a session and across page reloads, but will be reset if the service sleeps or redeploys. For full production persistence, a paid Render plan with a persistent disk, or a dedicated database service such as PostgreSQL or MongoDB Atlas, would be required.