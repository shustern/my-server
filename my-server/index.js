const http = require('http');
const url = require('url');
const mysql = require('mysql2');

const hostname = '127.0.0.1';
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // или ваш пользователь базы данных
  password: '',  // или ваш пароль базы данных
  database: 'ChatBotTests'
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.stack);
    return;
  }
  console.log('Подключение к базе данных успешно выполнено');
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/getAllItems') {
    db.query('SELECT * FROM Items', (err, results) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Database error' }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(results));
    });
  } else if (pathname === '/addItem' && req.method === 'POST') {
    const name = query.name;
    const desc = query.desc;
    if (name && desc) {
      db.query('INSERT INTO Items (name, `desc`) VALUES (?, ?)', [name, desc], (err, results) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Database error' }));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ id: results.insertId, name, desc }));
      });
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify(null));
    }
  } else if (pathname === '/deleteItem' && req.method === 'POST') {
    const id = parseInt(query.id);
    if (!isNaN(id)) {
      db.query('DELETE FROM Items WHERE id = ?', [id], (err, results) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Database error' }));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(results.affectedRows > 0 ? {} : null));
      });
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify(null));
    }
  } else if (pathname === '/updateItem' && req.method === 'POST') {
    const id = parseInt(query.id);
    const name = query.name;
    const desc = query.desc;
    if (!isNaN(id) && name && desc) {
      db.query('UPDATE Items SET name = ?, `desc` = ? WHERE id = ?', [name, desc, id], (err, results) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Database error' }));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(results.affectedRows > 0 ? { id, name, desc } : {}));
      });
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify(null));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
