/**
 * Funcionalidad de File System de la App Chat.
 * Se exportan dos funciones que realizan la lectura y escritura del Chat.
 */
const fs = require('fs'),
    path = require('path');

module.exports = {

    saveData: function(dataType, newData, data) {
        var dataPath = dataType == 'users' ?
            __dirname + path.join('/data/users.json') :
            __dirname + path.join('/data/messages.json');
        data.push(newData);
        return new Promise((resolve, reject) => {
            fs.writeFile(dataPath, JSON.stringify(data), err => {
                if (err) reject(err)
                resolve('Ok');
            });
        });
    },
    getData: function(dataType) {
        var dataPath = dataType == 'users' ?
            __dirname + path.join('/data/users.json') :
            __dirname + path.join('/data/messages.json');
        return new Promise((resolve, reject) => {
            fs.readFile(dataPath, 'utf8', (err, readData) => {
                if (err) reject(err)
                resolve(JSON.parse(readData));
            });
        });
    }
}