var fs = require('fs');
var path = require('path');
var Storage = require('../Storage');

module.exports = {

    deleteUser: function(user, callback) {
        Storage.getData('users')
            .then(function(users) {
                var resultUsers = users.filter(function(MapUser) {
                    return MapUser.nombre != user.nombre;
                });
                var userDataPath = path.join(__dirname, '../') + '/Storage/data/users.json';
                return new Promise(function(resolve, reject) {
                    fs.writeFile(userDataPath, JSON.stringify(resultUsers), function(error) {
                        if (error) reject(error)
                        resolve('Ok');
                    });
                });
            }).catch(function(err) {
                callback(err);
            });
    }

}