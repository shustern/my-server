const http = require('http');
const url = require('url');
const mysql = require('mysql2');
const TelegramBot = require('node-telegram-bot-api');

// Укажите ваш токен Телеграм бота
const token = '7247482385:AAHEnSplHM4g5mD6IWCimFAV-gQMepmfWKQ';

// Создание бота
const bot = new TelegramBot(token, { polling: true });

// Подключение к базе данных
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ChatBotTests'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет, октагон!');
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const helpMessage = `Список доступных команд:
    /help - возвращает список команд с их описанием
    /site - отправляет в чат ссылку на сайт октагона
    /creator - отправляет в чат ваше ФИО
    /randomItem - возвращает случайный предмет
    /deleteItem - удаляет предмет из БД по ID
    /getItemByID - возвращает предмет из БД по ID`;
    bot.sendMessage(msg.chat.id, helpMessage);
});

// Команда /site
bot.onText(/\/site/, (msg) => {
    bot.sendMessage(msg.chat.id, 'https://octagon.ru');
});

// Команда /creator
bot.onText(/\/creator/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Stepan Porozov');
});

// Команда /randomItem
bot.onText(/\/randomItem/, (msg) => {
    const query = 'SELECT * FROM Items ORDER BY RAND() LIMIT 1';
    connection.query(query, (err, results) => {
        if (err) {
            bot.sendMessage(msg.chat.id, 'Ошибка при получении случайного предмета');
            return;
        }
        if (results.length > 0) {
            const item = results[0];
            bot.sendMessage(msg.chat.id, `(${item.id}) - ${item.name}: ${item.desc}`);
        } else {
            bot.sendMessage(msg.chat.id, 'Предметы не найдены');
        }
    });
});

// Команда /deleteItem
bot.onText(/\/deleteItem (.+)/, (msg, match) => {
    const itemId = match[1];
    const query = 'DELETE FROM Items WHERE id = ?';
    connection.query(query, [itemId], (err, result) => {
        if (err) {
            bot.sendMessage(msg.chat.id, 'Ошибка при удалении предмета');
            return;
        }
        if (result.affectedRows > 0) {
            bot.sendMessage(msg.chat.id, 'Удачно');
        } else {
            bot.sendMessage(msg.chat.id, 'Ошибка');
        }
    });
});

// Команда /getItemByID
bot.onText(/\/getItemByID (.+)/, (msg, match) => {
    const itemId = match[1];
    const query = 'SELECT * FROM Items WHERE id = ?';
    connection.query(query, [itemId], (err, results) => {
        if (err) {
            bot.sendMessage(msg.chat.id, 'Ошибка при получении предмета');
            return;
        }
        if (results.length > 0) {
            const item = results[0];
            bot.sendMessage(msg.chat.id, `(${item.id}) - ${item.name}: ${item.desc}`);
        } else {
            bot.sendMessage(msg.chat.id, '{}');
        }
    });
});

// Запуск сервера
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Привет, Октагон!</h1>');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});


