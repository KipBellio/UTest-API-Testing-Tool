import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Render provides the PORT environment variable
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(port, () => {
    console.log(`JSON Server running on port ${port}`);
});