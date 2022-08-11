const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { Role, User } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const getAllUsers = async(req = request, res = response) => {
    const users = await User.findAll({include: [{ model: Role}]});

    if (users.length > 0) {
        res.json({
            users
        });
    }else{
        res.status(404).send('There are no users in DB yet');
    }
};

const getOneUser = async(req = request, res = response) => {
    //res.send(`Get course ${req.params.id}`);
    const user = await User.findOne({where: { id: req.params.id }, include: [{ model: Role}]});

    if (user) {
        res.json({
            user
        });
    }else{
        res.status(404).send(`User with id ${req.params.id} not found`);
    }
    
};

const createNewUser = async(req = request, res = response) => {

    // pass encrypt
    const salt = bcryptjs.genSaltSync();

    await User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role_id: req.body.role_id,
        status: req.body.status,
        password: bcryptjs.hashSync( req.body.password.toString(), salt )
    }, { fields: ['name', 'lastName', 'email',
    'phoneNumber', 'role_id', 'status', 'password'] })
        .then(user => {
            if (user) {
                res.status(200).send({
                    user,
                    msg: "User was created successfully"
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        if (req.files) {
            const users = await User.findAll();
            let model;

            model = await User.findByPk(users[users.length - 1].dataValues.id);

            //Limpiar imagenes previas
            if (model.img) {
                const nombreArr = model.img.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.'); //id publico de cloudinary
                cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
            }

            const { tempFilePath } = req.files.img

            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

            model.img = secure_url;

            await model.save();
        }
    
};

const updateOneUser = async(req = request, res = response) => {

    if (req.body.password) {
        // pass encrypt
        const salt = bcryptjs.genSaltSync();
        await User.update({
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            role_id: req.body.role_id,
            status: req.body.status,
            password: bcryptjs.hashSync( req.body.password.toString(), salt )
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(user => {
                if (user != 0) {
                    res.status(200).send(`User with id: ${req.params.id} was updated`);
                }else{
                    res.status(404).send(`User with id: ${req.params.id} was not found`);
                }
                
            }).catch(error => {
                console.log(error);
            });

        if (req.files) {
            let model;
            model = await User.findByPk(req.params.id);

            //Limpiar imagenes previas
            if (model.img) {
                const nombreArr = model.img.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.'); //id publico de cloudinary
                cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
            }

            const { tempFilePath } = req.files.img

            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

            model.img = secure_url;

            await model.save();
        }

    }else{
        await User.update({
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            role_id: req.body.role_id,
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(user => {
                if (user != 0) {
                    res.status(200).send(`Usuario con id: ${req.params.id} fue actualizado correctamente`);
                }else{
                    res.status(404).send(`Usuario con id: ${req.params.id} no encontrado`);
                }
                
            }).catch(error => {
                console.log(error);
            });

        
        if (req.files) {
            let model;
            model = await User.findByPk(req.params.id);

            if (model.img && model.documento) {
                const nombreArr = model.img.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.');
                cloudinary.uploader.destroy( public_id );

            }

            const { tempFilePath } = req.files.img
            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

            model.img = secure_url;

            await model.save();
        }

    }
};

const deleteOneUser = async(req = request, res = response) => {

    //Limpiar imagenes
    let model = await User.findByPk(req.params.id);
    if (model.img) {
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.'); //id publico de cloudinary
        cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
    }

    await User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(user => {
            if (user != 0) {
                res.status(200).send(`Usuario con id: ${req.params.id} fue borrado correctamente`);
            }else{
                res.status(404).send(`Usuario con id: ${req.params.id} no encontrado`);
            }
            
        }).catch(error => {
            console.log(error);
        })
    

    
};

module.exports = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateOneUser,
    deleteOneUser
};