var express = require('express');
var Router = express.Router();

Router.get('/users', function(req, res) {
    // GET Usuario
});

Router.get('/messages', function(req, res) {
    // GET Mensajes
});

Router.post('/users', function(req, res) {
    // POST Usuario
});

Router.post('/messages', function(req, res) {
    // POST Mensajes
});

module.exports = Router;