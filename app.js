require('dotenv').config();
const Server = require('./models/server'); //imports the server module

const server = new Server();

server.listen();