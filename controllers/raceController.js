const { response, request } = require('express');
const Race = require('../models/race');


//Obtener todas las razas de la base de datos
const getAllRaces = async(req = request, res = response) => {
    await Race.findAll({attributes:[
        'id', 'race_name'
    ]})
        .then(race => {
            const data = JSON.stringify(race);
            const results = JSON.parse(data);
            if (results.length > 0) {
                res.json({
                    results
                });
            }else{
                res.status(404).send('There are no races in the database');
            }
        }).catch(error => {
            console.log(error);
        });
};


//Obtener una raza por id de la base de datos
const getOneRace = async(req = request, res = response) => {
    
    const race = await Race.findOne({where: { id: req.params.id }});

    if (race) {
        res.json({
            race
        });
    }else{
        res.status(404).send(`race with id ${req.params.id} not found`);
    }
    
};

//Crear una raza en la base de datos
const createNewRace = async(req = request, res = response) => {

 

    await Race.create({
        race_name: req.body.race_name,
        
    }, { fields: ['race_name'] })
        .then(race => {
            if (race) {
                res.status(200).send({
                    race,
                    msg: "race was created successfully"
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        
    
};


//Actualizar una raza por id de la base de datos
const updateOneRace = async(req = request, res = response) => {

    

    await Race.update({
        race_name: req.body.race_name,
        
    }, { where:{
        id: req.params.id
    } })
        .then(race => {
            if (race) {
                res.status(200).send({
                    race,
                    msg: "race was update successfully"
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        
    
};


//Eliminar una raza por su id en la base de datos
const deleteOneRace = async(req = request, res = response) => {


    await Race.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(race => {
            if (race != 0) {
                res.status(200).send(`Race with id: ${req.params.id} was delete succesfully`);
            }else{
                res.status(404).send(`Race with id: ${req.params.id} not found`);
            }
            
        }).catch(error => {
            console.log(error);
        })
    

    
};





module.exports = {
    getAllRaces,
    getOneRace,
    createNewRace,
    updateOneRace,
    deleteOneRace

};