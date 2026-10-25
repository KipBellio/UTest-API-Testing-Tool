import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

// Force the middleware to bind to all interfaces
const middlewares = jsonServer.defaults({ host: '0.0.0.0' });

const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

// Keep the 0.0.0.0 here too
server.listen(port, '0.0.0.0', () => {
    console.log(`JSON Server running on http://0.0.0.0:${port}`);
});