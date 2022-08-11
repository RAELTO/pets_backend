const { response, request } = require('express');
const Race = require('../models/race');

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

module.exports = {
    getAllRaces,
};