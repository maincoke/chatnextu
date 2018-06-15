// Funcionalidad de Chat
var express = require('express');
var Storage = require('../Storage');
var Router = express.Router();

Router.get('/users', function(req, res) {
    // GET Usuario
    Storage.getData('users')
        .then(function(users) {
            res.json(users);
        }).catch(function(error) {
            res.sendStatus(500).json(error)
        });
});

Router.get('/messages', function(req, res) {
    // GET Mensajes
    Storage.getData('messages')
        .then(function(messages) {
            res.json(messages);
        }).catch(function(error) {
            res.sendStatus(500).json(error)
        });
});

Router.post('/users', function(req, res) {
    // POST Usuario
    var user = req.body.user;
    Storage.getData('users')
        .then(function(users) {
            return new Promise(function(resolve, reject) {
                Storage.saveData('users', user, users)
                    .then(function(users) { // message
                        resolve(users); // message
                    }).catch(function(err) {
                        reject(err);
                    })
            })
        }).then(function(users) { // message
            res.json(users); // message
        }).catch(function(err) {
            res.sendStatus(500).json(err);
        });
});

Router.post('/messages', function(req, res) {
    // POST Mensajes
    var message = req.body.message;
    Storage.getData('message')
        .then(function(message) {
            return new Promise(function(resolve, reject) {
                Storage.saveData('messages', message, message)
                    .then(function(message) {
                        resolve(message);
                    }).catch(function(err) {
                        reject(err);
                    })
            })
        }).then(function(message) {
            res.json(message);
        }).catch(function(err) {
            res.sendStatus(500).json(err);
        });
});

module.exports = Router;