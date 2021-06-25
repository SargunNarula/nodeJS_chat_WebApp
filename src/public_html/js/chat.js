const socket = io() // To initiate a socket

/*
    socket.on   --> To listen to events
    socket.emit --> To send events

    socket.emit --> To send data to a connected user
    io.emit     --> To send data to all connected users

*/


/*
    Event Acknowledgements --> It is a confirmation sent ,when the event is completely processed
                            
*/





// DOM 1
document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    //console.log('Clicked')
    
    let value = document.querySelector('input').value
    document.getElementById('myInput').value = ''
    //console.log("sending message: "+value)
    socket.emit('send',value)
})





// DOM 2

document.querySelector('#send-location').addEventListener('click', () => {

    //console.log('Clicked')
    if(!navigator.geolocation){
        return alert('Not available')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.coords.latitude)
        //console.log(position.coords.longitude)

        const data = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }
        socket.emit('send_Location',data)
    })
})





// DOM 3
// Automatic Scrolling
const autoscroll = () => {
    
    const newMessage        = document.querySelector('#messages').lastElementChild

    // getComputedStyled is a built in function
    const newMessageStyles  = getComputedStyle(newMessage)
    const newMessageMargin  = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight  = document.querySelector('#messages').lastElementChild.offsetHeight + newMessageMargin
    
    
    // Visible height/ Visible height
    const visibleHeight     = document.querySelector('#messages').offsetHeight

    // Height of messages container
    const containerHeight   = document.querySelector('#messages').scrollHeight


    // How far have I scrolled?
    const scrollOffset      = document.querySelector('#messages').scrollTop + visibleHeight

 /*    console.log(newMessage)
    console.log(newMessageStyles)
    console.log(newMessageMargin)
    console.log(newMessageHeight)
    console.log(visibleHeight)
    console.log(containerHeight)
    console.log(scrollOffset) */

    if (containerHeight - newMessageHeight <= scrollOffset) {
        document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight
    }
    
}









// Templates
const msg_template      = document.querySelector("#message-template").innerHTML 
const location_template = document.querySelector("#location-message-template").innerHTML
const sidebar_template  = document.querySelector("#sidebar-template").innerHTML 
const c_notf_template     = document.querySelector("#c-notification-template").innerHTML
const d_notf_template     = document.querySelector("#d-notification-template").innerHTML




// Options   --- parsing arguments from address bar
const {username,room} = Qs.parse(location.search, { ignoreQueryPrefix:true })





// Sending details to server (Initialization of chat room)
socket.emit('join', {username,room}, (error)     => {
    if(error){
    alert(error)
    location.href = '/'
    }
})





// Listener 1
socket.on('message', (message) => {
    //console.log(message)

    const html = Mustache.render(msg_template,{
        username: message.username,
        msg: message.text,
        createdAt: moment(message.createdAT).format('h:mm A')
    })
    document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
    autoscroll()

})

// Listener 2
socket.on('connected_notification', (message) => {
    //console.log(message)

    const html = Mustache.render(c_notf_template,{
        username: message.username,
    })
    document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// Listener 3
socket.on('disconnect_notification', (message) => {
    //console.log(message)

    const html = Mustache.render(d_notf_template,{
        username: message.username,
    })
    document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// Listener 4
socket.on('recieve',(message) => {
    //console.log('recieved message: ' + message)
    document.getElementById('recieve').textContent = message
})


// Listener 5
socket.on('recieve_Location',(message) => {
    
/*
    / / Create a "li" element then create text , then append that text to the li element
    node        = document.createElement("div")
    textnode    = document.createTextNode(`Latitude:   ${message.lat}`)
    node.appendChild(textnode);
    

    node_2      = document.createElement("LI")
    textnode_2  = document.createTextNode(`Longitude:   ${message.lon}` )
    node_2.appendChild(textnode_2);


    // Appending li elements to ul list
    document.getElementById("location_list").appendChild(node)
    document.getElementById("location_list").appendChild(node_2) 
*/
    //console.log(message)

    const html = Mustache.render(location_template,{
        username: message.username,
        location_link: message.location,
        createdAt: moment(message.createdAT).format('h:mm A')
    })
    document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
    autoscroll()



})


// Listener 6
socket.on('roomData', ( {room,users} ) => {
    const html = Mustache.render(sidebar_template,{
        room: room,
        users: users
    })
    document.querySelector('#sidebar').innerHTML = html  
})
