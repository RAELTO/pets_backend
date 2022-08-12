const { response, request } = require('express');
const Role = require('../models/roles');

const getAllRoles = async(req = request, res = response) => {//brings all the roles from the DB
    await Role.findAll({attributes:[
        'id', 'role_name'
    ]})
        .then(role => {
            if (role.length > 0) {
                res.json({
                    role
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