require('dotenv').config();

module.exports = {
    web: {
        username: process.env.WEB_USERNAME || 'admin',
        password: process.env.WEB_PASSWORD || 'admin'
    },
    ssh: {
        host: process.env.SSH_HOST || '127.0.0.1',
        port: process.env.SSH_PORT || 22,
        username: process.env.SSH_USERNAME || 'root',
        password: process.env.SSH_PASSWORD || 'password'
    }
};
