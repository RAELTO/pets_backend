const { response } = require("express");

const validateFileUpload = (req, res = response, next) => {//los middlewares usan next

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img) {//preguntar si en la request viene la propiedad file
        //.file se refiere al nombre dentro de la peticion, en el caso de postman al key del form-data
        return res.status(400).json({
            msg: 'Falta cargar la imágen - ValidateFileUpload'
        });

    }

    next();

}

module.exports = {
    validateFileUpload
}