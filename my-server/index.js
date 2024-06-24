const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/static') {
    res.statusCode = 200;
    res.end(JSON.stringify({ header: 'Hello', body: 'Octagon NodeJS Test' }));
  } else if (pathname === '/dynamic') {
    const a = parseFloat(query.a);
    const b = parseFloat(query.b);
    const c = parseFloat(query.c);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
      const result = (a * b * c) / 3;
      res.statusCode = 200;
      res.end(JSON.stringify({ header: 'Calculated', body: result.toString() }));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ header: 'Error' }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ header: 'Error' }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
