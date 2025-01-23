const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, Data!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});


// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
