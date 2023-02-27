const socket = io()

console.log(username)

//signaler qu'il y a un nouvel utilisateur

socket.emit('joined', username, room)

//event quand utilisateur rejoint

socket.on('justJoined', (Users) => {
    Users.forEach(element => {
        if(element.room == room){
            newUser(element.un)
        }
    });
})

//fonction qui permet d'ajouter un nouveau message avec un nom d'utilisateur et un content

function newMessage(user, content){
    var mainDiv = jQuery('<div>', {
        class: 'message'
    })
    
    var usernameDiv = jQuery('<div>', {
        class: 'usernameDiv'
    }).appendTo(mainDiv)

    var contentDiv = jQuery('<div>', {
        class: 'contentDiv'
    }).appendTo(mainDiv)

    jQuery('<p>', {
        class : 'usernameMessage'
    }).html(user).appendTo(usernameDiv)

    jQuery('<p>', {
        class : 'contentMessage'
    }).html(content).appendTo(contentDiv)
    
    mainDiv.prependTo("#div1")
}

//fonction appelé quand le bouton "envoyer" est appuyé pour emit un event au serveur

function sendMessage(){
    console.log($("#messageInput").val())
    socket.emit('sendMessage', username, $("#messageInput").val())
    $("#messageInput").val(" ")
}

//créer un message quand l'event nouveau message est envoyé par le serveur

socket.on('newMessage', (user, content) => {
    newMessage(user, content)
})

//fonction pour ajouter qu'il y a un utilisateur dans la room

function newUser(username) {
    var divUser = jQuery('<div>', {
        class : 'userBox',
        id : username
    })

    jQuery('<p>', {
        class : 'oneUser'
    }).html(username).appendTo(divUser)

    divUser.appendTo("#div3")
}

//event nouvel utilisateur, afficher 

socket.on('newUser', (pseudo, roomS) => {
    if(roomS == room){
        newUser(pseudo)
    }
})

//quitté

socket.on('left', (leftUn) => {
    var idleft = '#' + leftUn.toString()
    $(idleft).remove()
})

//bouton quitter est appuyé

function leaveRoom() {
    document.location.href = "/"
}