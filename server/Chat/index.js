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
    var user = req.body.users;
    Storage.getData('users')
        .then(function(users) {
            return new Promise(function(resolve, reject) {
                Storage.saveData('users', user, users)
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

Router.post('/messages', function(req, res) {
    // POST Mensajes
    var user = req.body.message;
    Storage.getData('message')
        .then(function(message) {
            return new Promise(function(resolve, reject) {
                Storage.saveData('users', message, message)
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

(function(document, windows, undefined, $) {
    (function() {
        return Chat = {
            // Codigo de Aplicacion Chat Englobada en un modulo POO.
            apiUrl: '/chat',
            $userDataModal: $('#modalCaptura'),
            $btnMessages: $('#btnMessage'),
            $messageText: $('#messageText'),
            userName: '',

            Init: function() {
                var self = this;
                this.fetchUserInfo(function(user) {
                    self.renderUser(user);
                });
            },
            fetchUserInfo: function(callback) {
                var self = this;
                this.$userDataModal.openModal();
                var $guardaInfo = $('.guardaInfo');
                $guardaInfo.on('click', function() {
                    var nameuser = $('.nombreUsuario').val();
                    var user = [{ nombre: nameuser, img: 'p2.png' }];
                    callback(user);
                    self.joinUser(user[0]); // ----> Ingreso de usuario nuevo
                    self.userName = nameuser;
                    self.$userDataModal.closeModal();
                });
                self.getInitialUsers();
            },
            getInitialUsers: function() {
                var self = this;
                var endpoint = self.apiUrl + '/users';
                self.ajaxRequest(endpoint, 'GET', {})
                    .done(function(data) {
                        var users = data.current;
                        self.renderUser(users);
                    })
                    .fail(function(err) {
                        console.log(err);
                    })
            },
            ajaxRequest: function(url, type, data) {
                return $.ajax({
                    url: url,
                    type: type,
                    data: data
                })
            },
            joinUser: function(user) {
                var self = this;
                var endpoint = self.apiUrl + '/users';
                var userObj = { user: user };
                self.ajaxRequest(endpoint, 'POST', userObj)
                    .done(function(confirm) {
                        console.log(confirm)
                    })
                    .fail(function(error) {
                        alert(error);
                    });
            },
            renderUser: function(users) {
                var self = this;
                var userList = $('.user-list');
                var userTemplate = '<li class="collection-item avatar">' +
                    '<img src="image/:image:" class="circle">' +
                    '<span class="title">:nombre:</span>' +
                    '<p><img src="image/online.png"/> En línea</p>' +
                    '</li>';
                users.map(function(user) {
                    var newUser = userTemplate
                        .replace(':image:', 'p2.png')
                        .replace(':nombre:', user.nombre);
                });
            },
            watchMessages: function() {
                var self = this;
                self.$messageText.on('keypress', function(e) {
                    if (e.which == 13) {
                        if ($(this).val().trim() != '') {
                            var message = {
                                sender: self.userName,
                                text: $(this).val()
                            }
                            self.renderMessage(message);
                            $(this).val('')
                        } else {
                            e.preventDefault();
                        }
                    }
                });
                self.$btnMessages.on('click', function() {
                    if (self.$messageText.val() != '') {
                        var message = {
                            sender: self.userName,
                            text: $(this).val()
                        }
                        self.renderMessage(message);
                        self.$messageText.val('');
                    }
                })
            },
            renderMessage: function(message) {
                var self = this;
                var tipoMensaje = message.sender == self.userName ? 'recibidos' : 'enviados';
                var messageList = $('.historial-chat');
                var messageTemplate = '<div class=":tipoMensaje:">' +
                    '<div class="mensaje">' +
                    '<div class ="imagen">' +
                    '<img src="image/p2.jpg" alt="Contacto"/></div>' +
                    '<div class="texto">' +
                    '<span class="nombre">:nombre:</span><br>' +
                    '<span>:mensaje:</span></div>' +
                    '<div class="hora">' +
                    '<span class="numHora">:hora:</span></div>' +
                    '</div></div>';
                var currentDate = new Date();
                var newMessage = messageTemplate
                    .replace(':tipoMensaje:', tipoMensaje)
                    .replace(':nombre', message.sender)
                    .replace(':mensaje:', message.text)
                    .replace(':hora:', currentDate.getHours() + ':' + currentDate.getMinutes());
                messageList.append(newMessage);
                $('.scroller-chat').animate({ scrollTop: $('scroller-chat').get(0).scrollHeight }, 500);
            }
        }
    })()
    Chat.Init();
})(document, window, undefined, jQuery)