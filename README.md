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
