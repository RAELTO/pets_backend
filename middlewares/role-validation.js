const { response } = require('express');


const adminRole = (req, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            
            msg: 'Token requires validation first before role verify'

        });
    }


    const { role_id, name } = req.user;

    if( role_id !== 1 ){
        return res.status(401).json({
            msg: `${name} is not an admin - action not allowed`
        });
    }

    next();
}

const hasRole = ( ...roles ) =>{

    return (req, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'Validate the token first to verify the role'
            });
        }

        if (!roles.includes( req.user.role_id )) {
            return res.status(401).json({
                msg: `The service requires one of the following roles: ${roles}`
            })
        }

        next();
    }
    
}

module.exports = {
    adminRole,
    hasRole
}
