const { response, request } = require('express');
const Type = require('../models/type');

const getAllTypes = async(req = request, res = response) => {
    await Type.findAll({attributes:[
        'id', 'type_name'
    ]})
        .then(type => {
            const data = JSON.stringify(type);
            const results = JSON.parse(data);
            if (results.length > 0) {
                res.json({
                    results
                });
            }else{
                res.status(404).send('There are no types in the database');
            }
        }).catch(error => {
            console.log(error);
        });
};


const getOneType = async(req = request, res = response) => {
    //res.send(`Get course ${req.params.id}`);
    const type = await Type.findOne({where: { id: req.params.id }});

    if (type) {
        res.json({
            type
        });
    }else{
        res.status(404).send(`type with id ${req.params.id} not found`);
    }
    
};


const createNewType= async(req = request, res = response) => {

    // pass encrypt

    await Type.create({
        type_name: req.body.type_name,
        
    }, { fields: ['type_name'] })
        .then(type => {
            if (type) {
                res.status(200).send({
                    type,
                    msg: "type was created successfully"
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        
    
};

const updateOneType = async(req = request, res = response) => {

    // pass encrypt

    await Type.update({
        type_name: req.body.type_name,
        
    }, { where:{
        id: req.params.id
    } })
        .then(type => {
            if (type) {
                res.status(200).send({
                    type,
                    msg: "type was update successfully"
                });
            } else {
                res.status(400).send('Error in insert new record');
            }
            
        }).catch(error => {
            console.log(error);
        });

        
    
};



const deleteOneType = async(req = request, res = response) => {


    await Type.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(type => {
            if (type != 0) {
                res.status(200).send(`type with id: ${req.params.id} was delete succesfully`);
            }else{
                res.status(404).send(`type with id: ${req.params.id} not found`);
            }
            
        }).catch(error => {
            console.log(error);
        })
    

    
};


module.exports = {
    getAllTypes,
    getOneType,
    createNewType,
    updateOneType,
    deleteOneType
};