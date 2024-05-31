const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const { Client } = require('ssh2');
const WebSocket = require('ws');
const config = require('./config');

const app = express();
const PORT = 9001;

// Session middleware setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Flash messages middleware setup
app.use(flash());

// Body parser middleware setup
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to serve static files (like CSS)
app.use(express.static('public'));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Login route
app.get('/login', (req, res) => {
    const error = req.flash('error');
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <title>Login</title>
        </head>
        <body class="bg-dark text-white">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-4">
                        <h1 class="text-center">Login</h1>
                        ${error.length ? `<div class="alert alert-danger">${error[0]}</div>` : ''}
                        <form method="post" action="/login">
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" id="username" name="username" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" id="password" name="password" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === config.web.username && password === config.web.password) {
        req.session.user = username;
        res.redirect('/');
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Serve the HTML page with a terminal UI if authenticated
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Setup WebSocket server for terminal communication
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    const conn = new Client();

    conn.on('ready', () => {
        conn.shell((err, stream) => {
            if (err) return ws.send(`Error: ${err.message}`);

            ws.on('message', (msg) => {
                stream.write(msg);
            });

            stream.on('data', (data) => {
                // Convert ANSI escape codes to HTML for colored output
                const formattedMessage = data.toString().replace(/\x1B[@-_][0-?]*[ -/]*[@-~]/g, '');
                ws.send(formattedMessage);
            }).on('close', () => {
                conn.end();
            });
        });
    }).connect({
        host: config.ssh.host,
        port: config.ssh.port,
        username: config.ssh.username,
        password: config.ssh.password
    });

    ws.on('close', () => {
        conn.end();
    });
});