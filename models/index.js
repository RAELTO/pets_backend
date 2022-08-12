const Pet = require('./pet');
const Race = require('./race');
const Role = require('./roles');
const Server = require('./server');
const Type = require('./type');
const User = require('./user');

//--- Models relationship to be included in the get all requests and get one requests ---

//FK user-role
User.belongsTo(Role, {foreignKey: 'role_id'});
Role.hasMany(User, {foreignKey: 'role_id'});

//FK pet-race
Pet.belongsTo(Race, {foreignKey: 'race_id'});
Race.hasMany(Pet, {foreignKey: 'race_id'});
//FK pet-type
Pet.belongsTo(Type, {foreignKey: 'type_id'});
Type.hasMany(Pet, {foreignKey: 'type_id'});
//FK pet-user
Pet.belongsTo(User, {foreignKey: 'user_id'});
User.hasMany(Pet, {foreignKey: 'user_id'});

module.exports = {//es adecuado que este en orden alfabetico
    Pet,
    Race,
    Role,
    Server,
    Type,
    User
}
