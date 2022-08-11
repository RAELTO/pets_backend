//controlador para login o autenticación
const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { genJWT } = require("../helpers/gen-jwt");

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        
        //Verificar si el email existe
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(400).json({
                msg: "User / Password incorrect - email",
                validLogin: false
            });
        }
        
        //Verificar si el usuario esta activo
        if(!user.status){
            return res.status(400).json({
                msg: "User / Password incorrect - status: false",
                validLogin: false
            });
        }

        // Password verify
        const validPassword = bcryptjs.compareSync( password, user.password );//compara la passw del body vs la del usuario, retorna un booleano
        if (!validPassword) {
            return res.status(400).json({
                msg: "User / Password incorrect - password",
                validLogin: false
            });
        }

        // Generar el JWT
        const token = await genJWT( user.id );

        res.json({
            user,
            token,
            validLogin: true
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Consult with the administrator"
        })
    }

}

module.exports = {
    login
}