//-----FUNCIONES DEL DISEÑO ADAPTATIVO------//
function isMobile() {
    let screenSize = screen.width;
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
    let horas = $(".numHora");
    for (let i = 0; i < horas.length; i++) {
        $(horas[i]).prependTo($(horas[i]).prev());
    }
    let horasRecibido = $(".recibidos .numHora");
    for (let i = 0; i < horasRecibido.length; i++) {
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
                    this.fetchUserInfo(user => this.renderUser(user));
                    this.watchMessages();
                    this.socket.on('userJoin', user => this.renderUser(user));
                    this.socket.on('message', message => this.renderMessage(message));
                    this.socket.on('refreshUsers', () => {
                        $('.users-list').children('.collection-item').remove()
                        this.getInitialUsers();
                    });
                },
                fetchUserInfo: function(callback) {
                    this.$userDataModal.openModal();
                    let $guardaInfo = $('.guardaInfo');
                    $guardaInfo.on('click', () => {
                        let nameuser = $('.nombreUsuario').val();
                        let user = [{ nombre: nameuser, img: 'person.png' }];
                        this.socket.emit('userJoin', user[0]);
                        callback(user[0]);
                        this.joinUser(user[0]); // ----> Ingreso de usuario nuevo
                        this.userName = nameuser;
                        this.$userDataModal.closeModal();
                    });
                    this.getInitialUsers();
                },
                getInitialUsers: function() {
                    let endpoint = this.apiUrl + '/users';
                    this.ajaxRequest(endpoint, 'GET', {})
                        .done(data => {
                            if (data.length != 0) {
                                var users = data;
                                users.forEach(user => this.renderUser(user));
                            }
                        })
                        .fail(err => console.log(err));
                },
                ajaxRequest: function(url, type, data) {
                    return $.ajax({
                        url: url,
                        type: type,
                        data: data
                    });
                },
                joinUser: function(juser) {
                    let endpoint = this.apiUrl + '/users',
                        userObj = { user: juser };
                    this.ajaxRequest(endpoint, 'POST', userObj)
                        .done(confirm => console.log(confirm))
                        .fail(error => alert(error));
                },
                renderUser: function(user, img = 'person.png') {
                    if (user !== undefined) {
                        let userList = $('.users-list');
                        userList.append(`<li class="collection-item avatar">
                            <img src="image/${img}" class="circle">
                            <span class="title">${user.nombre}</span>
                            <p><img src="image/online.png"/> En línea </p>
                            </li>`);
                    }
                },
                watchMessages: function() {
                    this.$messageText.on('keypress', e => {
                        if (e.which == 13) {
                            if (this.$messageText.val().trim() != '') {
                                let message = {
                                    sender: this.userName,
                                    text: this.$messageText.val()
                                }
                                this.$messageText.val('');
                                this.$messageText.focus();
                                this.renderMessage(message);
                                this.socket.emit('message', message);
                            } else {
                                e.preventDefault();
                            }
                        }
                    });
                    this.$btnMessages.on('click', () => {
                        if (this.$messageText.val().trim() != '') {
                            let message = {
                                sender: this.userName,
                                text: this.$messageText.val()
                            }
                            this.$messageText.val('');
                            this.$messageText.focus();
                            this.renderMessage(message);
                            this.socket.emit('message', message);
                        }
                    });
                },
                renderMessage: function(message) {
                    let tipoMensaje = message.sender == this.userName ? 'recibidos' : 'enviados',
                        messageList = $('.historial-chat');
                    let currentDate = new Date();
                    const getTimeMessage = currentDate => {
                        function fix(n) { return n < 10 ? '0' + n : n }
                        return fix(currentDate.getHours()) + ':' + fix(currentDate.getMinutes());
                    }
                    let messageTime = getTimeMessage(currentDate);
                    messageList.append(
                        `<div class="${tipoMensaje}">
                        <div class="mensaje">
                        <div class ="imagen">
                        <img src="image/person.png" alt="Contacto"/></div>
                        <div class="texto">
                        <span class="nombre">${message.sender}</span><br>
                        <span>${message.text}</span></div>
                        <div class="hora">
                        <span class="numHora">${messageTime}</span></div>
                        </div></div>`);
                    $('.scroll-container').animate({ scrollTop: $('.scroll-container').get(0).scrollHeight }, 500);
                }
            }
        })()
        Chat.Init();
    })(document, window, undefined, jQuery, io);
});