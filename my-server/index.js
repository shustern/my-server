const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const handleStaticRoute = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ header: 'Hello', body: 'Octagon NodeJS Test' }));
};

const handleDynamicRoute = (req, res) => {
  const query = url.parse(req.url, true).query;
  const params = ['a', 'b', 'c'];
  const values = params.map(param => parseFloat(query[param]));

  if (values.every(value => !isNaN(value))) {
    const result = values.reduce((acc, value) => acc * value, 1) / 3;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ header: 'Calculated', body: result.toString() }));
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ header: 'Error' }));
  }
};

const routes = {
  '/static': handleStaticRoute,
  '/dynamic': handleDynamicRoute
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  const routeHandler = routes[pathname];
  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
