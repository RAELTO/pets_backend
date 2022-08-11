const { response, request } = require('express');
const Role = require('../models/roles');

const getAllRoles = async(req = request, res = response) => {//obtener todos los roles
    await Role.findAll({attributes:[
        'id', 'role_name'
    ]})
        .then(role => {
            const data = JSON.stringify(role);
            const results = JSON.parse(data);
            if (results.length > 0) {
                res.json({
                    results
                });
            }else{
                res.status(404).send('There are no roles in the database');
            }
        }).catch(error => {
            console.log(error);
        });
};

module.exports = {
    getAllRoles,
};