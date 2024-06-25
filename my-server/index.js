const http = require('http');
const url = require('url');
const mysql = require('mysql2');

const hostname = '127.0.0.1';
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ChatBotTests'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

const handleGetAllItems = (req, res) => {
  connection.query('SELECT * FROM Items', (error, results) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
  });
};

const handleAddItem = (req, res) => {
  const query = url.parse(req.url, true).query;
  const { name, desc } = query;

  if (!name || !desc) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid parameters' }));
    return;
  }

  connection.query('INSERT INTO Items (name, `desc`) VALUES (?, ?)', [name, desc], (error, results) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: results.insertId, name, desc }));
  });
};

const handleDeleteItem = (req, res) => {
  const query = url.parse(req.url, true).query;
  const { id } = query;

  if (!id || isNaN(parseInt(id))) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid parameters' }));
    return;
  }

  connection.query('DELETE FROM Items WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id }));
  });
};

const handleUpdateItem = (req, res) => {
  const query = url.parse(req.url, true).query;
  const { id, name, desc } = query;

  if (!id || isNaN(parseInt(id)) || !name || !desc) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid parameters' }));
    return;
  }

  connection.query('UPDATE Items SET name = ?, `desc` = ? WHERE id = ?', [name, desc, id], (error, results) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id, name, desc }));
  });
};

const routes = {
  '/getAllItems': handleGetAllItems,
  '/addItem': handleAddItem,
  '/deleteItem': handleDeleteItem,
  '/updateItem': handleUpdateItem
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
