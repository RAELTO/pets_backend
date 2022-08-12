const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { Role, User } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const getAllUsers = async(req = request, res = response) => {//Brings all the users in the DB

    const users = await User.findAll({include: [{ model: Role}]});

    if (users.length > 0) {
        res.json({
            users
        });
    }else{//if the DB table is empty then this message will be displayed
        res.status(404).send('There are no users in DB yet');
    }
};

const getOneUser = async(req = request, res = response) => {//brings an user from the DB by using an ID

    const user = await User.findOne({where: { id: req.params.id }, include: [{ model: Role}]});

    if (user) {
        res.json({
            user
        });
    }else{//if the DB table is empty then this message will be displayed
        res.status(404).send(`User with id ${req.params.id} not found`);
    }
    
};

const createNewUser = async(req = request, res = response) => {

    // pass encrypt
    const salt = bcryptjs.genSaltSync();//uses the bcrypt npm package

    await User.create({ // Sequelize method for create a new user with the required info from the body
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role_id: req.body.role_id,
        status: req.body.status,
        password: bcryptjs.hashSync( req.body.password.toString(), salt )//password encryption and number to string convertion
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

        if (req.files) {//if there is a file in the body, then it will be stored in cloudinary
            const users = await User.findAll();//brings all the users from db
            let model;

            model = await User.findByPk(users[users.length - 1].dataValues.id);//finds the last record added

            //Cleans the previous images
            if (model.img) {
                const nombreArr = model.img.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.'); //id publico de cloudinary
                cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
            }

            const { tempFilePath } = req.files.img //stores the image path

            const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); //saves the image in cloudinary and obtains the url

            model.img = secure_url; //saves the url in the model image to be displayed when is required

            await model.save();
        }
    
};

const updateOneUser = async(req = request, res = response) => {//function to update an user

    if (req.body.password) {//if the password is send in the body, then is encrypted again
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

            
            if (model.img) {
                const nombreArr = model.img.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id ] = nombre.split('.'); //public id from cloudinary
                cloudinary.uploader.destroy( public_id ); //cloudinary method that deletes using the public_id
            }

            const { tempFilePath } = req.files.img

            const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

            model.img = secure_url;

            await model.save();
        }

    }else{//if the password is not send in the body, then just updates the other data from the specified user
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

        
        if (req.files) {//if an image is send in the form data, then it will be replaced by the new one
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

    //deletes the user image from the cloudinary storage
    let model = await User.findByPk(req.params.id);
    if (model.img) {
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.'); 
        cloudinary.uploader.destroy( public_id );
    }

    await User.destroy({// delete method from Sequelize - an id is required in order to delete the specified user
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