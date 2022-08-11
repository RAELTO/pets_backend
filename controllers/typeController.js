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

module.exports = {
    getAllTypes,
};