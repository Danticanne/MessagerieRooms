const express = require("express")
const app = express()
const httpServer = require("http").createServer(app)
const {Server} = require("socket.io")
const io = new Server(httpServer, {})

app.set('viewport', 'ejs')
app.set('views', 'public')

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use("/modules", express.static(__dirname + "/node_modules"))

let Users = []

app.get("/", (req, res) => {
    res.render('connexion.ejs')
})

app.post("/messagerie", (req, res) => {
    res.render('messagerie.ejs', {username: req.body.username})
})

//pour chaque connection

io.on("connection", (socket) => {

    socket.on("sendMessage", (user, content) => {
        io.emit('newMessage', user, content)
    })

    socket.on('joined', (username) => {
        console.log(username)
        socket.pseudo = username
        Users.push({id : socket.id, un : socket.pseudo})
        console.log(Users)
        io.emit('newUser', username)
    })

    socket.on('disconnect', () => {
        io.emit('left', (socket.pseudo))
        for (var i = Users.length - 1; i >= 0; i--) {
            if (Users[i].id == socket.id) Users.splice(i, 1);
        }
        console.log(Users)
    })

    socket.emit('justJoined', Users)
})

httpServer.listen(3000)