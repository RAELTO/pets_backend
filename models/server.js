const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

//server en clase
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            pets: '/api/v1/pets',
            roles: '/api/v1/roles',
            types: '/api/v1/types',
            races: '/api/v1/races',
            passValidate: '/api/v1/pass-validation',
        }

        //db connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();//dispara el motodo routes
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );

        //Lectura y parseo body
        this.app.use( express.json() );

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));

    }

    routes() {//my routes configuration

        this.app.get('/', (req, res) => {
            res.send('<h1>Hola desde land page!</h1>');
        });
        
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.users, require('../routes/users') );
        this.app.use( this.paths.pets, require('../routes/pets') );
        this.app.use( this.paths.roles, require('../routes/roles') );
        this.app.use( this.paths.types, require('../routes/types') );
        this.app.use( this.paths.races, require('../routes/races') );
        this.app.use( this.paths.passValidate, require('../routes/passVal') );

        this.app.get('*', (req, res) => {
            res.status(404).send(`<h1>404 | Endpoint: " ${req.url} " not found</h1>`);
        });
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`)
        });
    }

}



module.exports = Server;