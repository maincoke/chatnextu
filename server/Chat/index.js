// Funcionalidad de Chat
const express = require('express'),
    Storage = require('../Storage'),
    Router = express.Router();

Router.get('/users', (req, res) => {
    // GET Usuario
    Storage.getData('users')
        .then(users => {
            res.json(users);
        }).catch(error => {
            res.sendStatus(500).json(error)
        });
});

Router.get('/messages', (req, res) => {
    // GET Mensajes
    Storage.getData('messages')
        .then(messages => {
            res.json(messages);
        }).catch(error => {
            res.sendStatus(500).json(error)
        });
});

Router.post('/users', (req, res) => {
    // POST Usuario
    let user = req.body.user;
    Storage.getData('users')
        .then(users => {
            return new Promise((resolve, reject) => {
                Storage.saveData('users', user, users)
                    .then(users => { // message
                        resolve(users); // message
                    }).catch(err => {
                        reject(err);
                    })
            })
        }).then(users => { // message
            res.json(users); // message
        }).catch(err => {
            res.sendStatus(500).json(err);
        });
});

Router.post('/messages', (req, res) => {
    // POST Mensajes
    let message = req.body.message;
    Storage.getData('message')
        .then(message => {
            return new Promise((resolve, reject) => {
                Storage.saveData('messages', message, message)
                    .then(message => {
                        resolve(message);
                    }).catch(err => {
                        reject(err);
                    })
            })
        }).then(message => {
            res.json(message);
        }).catch(err => {
            res.sendStatus(500).json(err);
        });
});

module.exports = Router;