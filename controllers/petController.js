const { response, request } = require('express');
const { Type, User, Pet } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const getAllPets = async(req = request, res = response) => {
    const pets = await Pet.findAll({include: [{ model: Type}, { model: User }]});

    if (pets.length > 0) {
        res.json({
            pets
        });
    }else{
        res.status(404).send('There are no pets in DB yet');
    }
};

const getOnePet = async(req = request, res = response) => {
    const pets = await Pet.findOne({where: { id: req.params.id }, include: [{ model: Type}, { model: User }]});

    if (pets) {
        res.json({
            pets
        });
    }else{
        res.status(404).send(`Pet with id ${req.params.id} was not found`);
    }
    
};

const createNewPet = async(req = request, res = response) => {

    await Pet.create({
        name: req.body.name,
        race_id: req.body.race_id,
        age: req.body.age,
        type_id: req.body.type_id,
        user_id: req.body.user_id,
        status: req.body.status
    }, { fields: ['name', 'race_id', 'age',
    'type_id', 'user_id', 'status'] })
        .then(pet => {
            if (pet) {
                res.status(200).send({
                    pet,
                    msg: `The pet: ${req.body.name} was created successfully`
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        if (req.files) {
            const pets = await Pet.findAll();
            let model;

            model = await Pet.findByPk(pets[pets.length - 1].dataValues.id);

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

const updateOnePet = async(req = request, res = response) => {

        await Pet.update({
            name: req.body.name,
            race_id: req.body.race_id,
            age: req.body.age,
            type_id: req.body.type_id,
            user_id: req.body.user_id,
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(pet => {
                if (pet != 0) {
                    res.status(200).send(`Pet with id: ${req.params.id} was updated`);
                }else{
                    res.status(404).send(`Pet with id: ${req.params.id} not found`);
                }
                
            }).catch(error => {
                console.log(error);
            });

        if (req.files) {
            let model;
            model = await Pet.findByPk(req.params.id);

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

const deleteOnePet = async(req = request, res = response) => {

    //Limpiar imagenes
    let model = await Pet.findByPk(req.params.id);
    if (model.img) {
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.'); //id publico de cloudinary
        cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
    }

    await Pet.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(pet => {
            if (pet != 0) {
                res.status(200).send(`Pet with id: ${req.params.id} was successfully deleted`);
            }else{
                res.status(404).send(`Pet with id: ${req.params.id} was not found`);
            }
            
        }).catch(error => {
            console.log(error);
        })
    

    
};

module.exports = {
    getAllPets,
    getOnePet,
    createNewPet,
    updateOnePet,
    deleteOnePet
};