const express   = require('express')
const http      = require('http')
const socketio  = require('socket.io')

const {generated_msg}       = require('./utils/messages.js')
const {generated_location}  = require('./utils/messages.js')

const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users.js')
const { callbackify } = require('util')


const app       = express()


const port      = process.env.PORT | 3000
const server    = http.createServer(app)   // Need to create server manually for socketio

const io        = socketio(server)

server.listen(port, (error) => {
    if(error){
        console.log("Server Not Starting")
    }
    console.log("Express Server Started")
})

console.log(__dirname)
app.use(express.static('public_html/'))







/*
    server(emit) --> client (countUpdated)
    client(emit) --> seever (increment)
*/



io.on('connection', (socket) => {       // Connection established

    console.log('New WebSocket Created')



    
    
    
    // Listener 1
    // We used callback() to implement the concept of acknowledgememt
    socket.on('join',({username,room},  callback) => {
        

        // If user added we get back an object
        // OR
        // we get back an error
        const {error,current_user} = addUser({
            username:username,
            id:socket.id,
            room:room
        })

        // Acknowledgemt that user cannot join
        if(error){
            return callback(error)
        }







        // This line creates a room to group together specific clients
        // and server
        
        socket.join(current_user.room)
        console.log(current_user.room)
        /*
            socket.emit             - send msg to attached clien
            socket.broadcast.emit   - send msg to everyone except this socket client
            socket.broadcast.to.emit- send msg to everyone except this socket client but in a room
                                        (room has a limited grp of clients)
            
            io.emit     - send msg to everyone
            io.to.emit  - send msg to everyone in a specific room
        */


       socket.emit('message', generated_msg(current_user.username,"Welcome!")) 
       socket.broadcast.to(current_user.room).emit('message', generated_msg(`${current_user.username} has joined!`))
        io.to(current_user.room).emit('roomData', {
            room: current_user.room,
            users: getUsersInRoom(current_user.room)
        })


       // Acknowledgement that user can join
    })
    
    
    // Listener 2
    socket.on('send', (message) => {
        console.log('sending message: '+ message)
        //io.emit('recieve',message)
        const current_user = getUser(socket.id)
        if(current_user){
        io.to(current_user.room).emit('message',generated_msg(current_user.username,message))
        }
    })

    
    
    
    // Listener 3
    socket.on('disconnect', () => {
        console.log( 'User Disconnected')
        const current_user = removeUser(socket.id)
        if(current_user){
            io.to(current_user.room).emit('message', generated_msg(`${current_user.username} has disconnected`))
            io.to(current_user.room).emit('roomData', {
                room: current_user.room,
                users: getUsersInRoom(current_user.room)
            })
        }

    })

    
    
    
    // Listener 4
    socket.on('send_Location',(message) => {
        console.log("server --",message)
        const current_user = getUser(socket.id)
        io.to(current_user.room).emit('recieve_Location',generated_location(current_user.username,message))
    })

    
    
    
    
    
    
    
    /* const message = "Welcome!"
    socket.emit('message', message) 

    let count = 0 


    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count += 1
        io.emit('countUpdated',count)
    }) 

    */
})



app.get('/', (req,res)=>{
    res.send('Express Server Started')
})

