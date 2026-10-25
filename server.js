import jsonServer from 'json-server';
import http from 'http';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Force the port from Render, default to 3001 locally
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

// Create the app instance
const app = server;

// Bind explicitly to 0.0.0.0 using Node's http module
const httpServer = http.createServer(app);

httpServer.listen(port, '0.0.0.0', () => {
    console.log(`JSON Server running on http://0.0.0.0:${port}`);
});