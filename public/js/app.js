//-----FUNCIONES DEL DISEÑO ADAPTATIVO------//
function isMobile() {
    var screenSize = screen.width;
    if (screenSize < 992) {
        return true
    } else return false;
}

function inicioOrganizacion() {
    if (isMobile() == true) {
        $('#btnMessage').attr('class', 'btn-floating hide-on-large-only')
        organizarMensaje();
    }
}

function organizarMensaje() {
    $(".numHora").unwrap();
    var horas = $(".numHora");
    for (var i = 0; i < horas.length; i++) {
        $(horas[i]).prependTo($(horas[i]).prev());
    }
    var horasRecibido = $(".recibidos .numHora");
    for (var i = 0; i < horasRecibido.length; i++) {
        $(horasRecibido[i]).next().after(horasRecibido[i]);
    }

}

function slideContactos(direction) {
    if (desplegado == false) {
        if (direction == "left") {
            $(".right-side")
                .css({
                    position: "absolute",
                    zIndex: "3",
                    right: "0px",
                    display: "none"
                })
                .removeClass("hide-on-small-only")
                .show("slide", { direction: "right" }, 300)
            desplegado = true;
        }

    } else {
        if (direction == "right") {
            $(".right-side").hide("slide", { direction: "right" }, 300)

            desplegado = false;
        }


    }
}

var desplegado = false;
$(function() {
    //----VARIABLES Y FUNCIONES DEL DISEÑO ADAPTATIVO -----//
    $(".container").css("height", $(window).height());
    inicioOrganizacion();
    if (isMobile()) {
        $(".input-contenedor button").html("<i class='material-icons right'>send</i>")
        $("body").swipe({
            swipe: function(event, direction, distance, duration, fingerCount) {
                slideContactos(direction);
            },
            allowPageScroll: "vertical"
        })
        $(".titulo-chat button").on("click", function() {
            slideContactos("left");
        })
    }

    (function(document, windows, undefined, $, io) {
        (function() {
            return Chat = {
                // Codigo de Aplicacion Chat Englobada en un modulo POO.
                apiUrl: '/chat',
                $userDataModal: $('#modalCaptura'),
                $btnMessages: $('#btnMessage'),
                $messageText: $('#messageText'),
                userName: '',
                socket: io(),

                Init: function() {
                    var self = this;
                    this.fetchUserInfo(function(user) {
                        self.renderUser(user);
                    });
                    this.watchMessages();
                    self.socket.on('userJoin', function(user) {
                        self.renderUser(user);
                    });
                    self.socket.on('message', function(message) {
                        self.renderMessage(message);
                    });
                    self.socket.on('disconnect', function(id) {
                        console.log(id);
                        if (id != null) {
                            self.getInitialUsers();
                        }
                    });
                },
                fetchUserInfo: function(callback) {
                    var self = this;
                    this.$userDataModal.openModal();
                    var $guardaInfo = $('.guardaInfo');
                    $guardaInfo.on('click', function() {
                        var nameuser = $('.nombreUsuario').val();
                        var user = [{ nombre: nameuser, img: 'person.png' }];
                        self.socket.emit('userJoin', user[0]);
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
                            var users = data;
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
                    });
                },
                joinUser: function(juser) {
                    var self = this;
                    var endpoint = self.apiUrl + '/users';
                    var userObj = { user: juser };
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
                    var userList = $('.users-list');
                    var userTemplate = '<li class="collection-item avatar">' +
                        '<img src="image/:image:" class="circle">' +
                        '<span class="title">:nombre:</span>' +
                        '<p><img src="image/online.png"/> En línea </p>' +
                        '</li>';
                    if (users.length != 0) {
                        users.map(function(user) {
                            var newUser = userTemplate
                                .replace(':image:', 'person.png')
                                .replace(':nombre:', user.nombre);
                            userList.append(newUser);
                        });
                    } else {
                        userList.children('<li>').remove()
                    }
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
                                $(this).val('');
                                $(this).focus();
                                self.renderMessage(message);
                                self.socket.emit('message', message);
                            } else {
                                e.preventDefault();
                            }
                        }
                    });
                    self.$btnMessages.on('click', function() {
                        if (self.$messageText.val().trim() != '') {
                            var message = {
                                sender: self.userName,
                                text: self.$messageText.val()
                            }
                            self.$messageText.val('');
                            self.$messageText.focus();
                            self.renderMessage(message);
                            self.socket.emit('message', message);
                        }
                    });
                },
                renderMessage: function(message) {
                    var self = this;
                    var tipoMensaje = message.sender == self.userName ? 'recibidos' : 'enviados';
                    var messageList = $('.historial-chat');
                    var messageTemplate = '<div class=":tipoMensaje:">' +
                        '<div class="mensaje">' +
                        '<div class ="imagen">' +
                        '<img src="image/person.png" alt="Contacto"/></div>' +
                        '<div class="texto">' +
                        '<span class="nombre">:nombre:</span><br>' +
                        '<span>:mensaje:</span></div>' +
                        '<div class="hora">' +
                        '<span class="numHora">:hora:</span></div>' +
                        '</div></div>';
                    var currentDate = new Date();

                    function getTimeMessage(currentDate) {
                        function fix(n) { return n < 10 ? '0' + n : n }
                        return fix(currentDate.getHours()) + ':' + fix(currentDate.getMinutes());
                    }
                    var messageTime = getTimeMessage(currentDate);
                    var newMessage = messageTemplate
                        .replace(':tipoMensaje:', tipoMensaje)
                        .replace(':nombre', message.sender)
                        .replace(':mensaje:', message.text)
                        .replace(':hora:', messageTime);
                    messageList.append(newMessage);
                    $('.historial-chat').animate({ scrollTop: $('.historial-chat').scrollHeight }, 500);
                }
            }
        })()
        Chat.Init();
    })(document, window, undefined, jQuery, io);
});