const express = require('express')
const app = express()
const port = process.env.PORT || 5001
const path = require('path')
const { env } = require('process')
var server = require('http').Server(app)
var io = require('socket.io')(6000)
const users = {}

app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})


app.get('/getusers', function (_req, res) {
    res.json(users)
})

app.use('/components', express.static('components'))
app.use('/node_modules', express.static('node_modules'))

const nameonly = []
const avataronly = []

io.on('connection', socket => {
    socket.on('send-chat-message', mess => {
        socket.broadcast.emit('chat-msg', mess)
    })

    socket.on('join-message', mess => {
        users[socket.id] = mess
        console.log(users[socket.id])
        socket.broadcast.emit('join-msg', mess)
        nameonly.push(mess)
        console.log(nameonly)
    })

    socket.on('send-typing-message', username => {
        console.log(username)
        socket.broadcast.emit('typing-msg', username)
    })

    socket.on('remove-typing-message', username => {
        socket.broadcast.emit('remove-msg', username)
    })

    socket.on('add-avatar-image', image => {
        avataronly.push(image)
        socket.broadcast.emit('add-avatar', image)
    })

    socket.on('add-avatar-initials', initials => {
        socket.broadcast.emit('add-initials', initials)
    })

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} disconnected`)
        socket.broadcast.emit('disconnect-msg', users[socket.id])
        deleteusers[socket.id]
    })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))



