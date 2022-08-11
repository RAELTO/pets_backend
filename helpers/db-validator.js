
const { 
    User, Type, Pet, Race, Role
} = require('../models');

//Validar si un rol es valido comparando con los disponibles en la DB
const validRoles = async(id = '') => {
    const role_Exists = await Role.findOne({ where: { id: id } });
    if ( !role_Exists ) {
            throw new Error(`The role with id: ${id} is not in the database`);
    }
}

//Validar si un correo ya esta registrado en la DB
const emailValidator = async(email = '') => {
    
    const emailExists = await User.findOne({ where: { email: email } });
    if ( emailExists ){
        throw new Error(`The email: ${email}, is already registered`);
    }

}

//Validar si un usuario existe en la DB -- validador personalizado
const userExistingId = async(id = '') => {
    
    const userExisting = await User.findByPk(id);
    if ( !userExisting ){
        throw new Error(`The user with id: ${id} doesn't exists`);
    }

}

//Validar si la mascota existe en la DB -- validador personalizado
const petExistingId = async(id = '') => {
    
    const petExisting = await Pet.findByPk(id);
    if ( !petExisting ){
        throw new Error(`The pet with id: ${id} doesn't exists`);
    }

}

//Validar si un tipo de mascota es válido comparando con los disponibles en la DB
const validType = async(id = '') => {
    const type_Exists = await Type.findOne({ where: { id: id } });
    if ( !type_Exists ) {
            throw new Error(`The type with id: ${id} is not in the database`);
    }
}

//Validar si una raza es válida comparando con los disponibles en la DB
const validRace = async(id = '') => {
    const race_Exists = await Race.findOne({ where: { id: id } });
    if ( !race_Exists ) {
            throw new Error(`The race with id: ${id} is not in the database`);
    }
}


module.exports = {
    validRoles,
    emailValidator,
    userExistingId,
    petExistingId,
    validType,
    validRace,
}