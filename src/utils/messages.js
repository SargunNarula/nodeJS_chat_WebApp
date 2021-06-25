

/*
   We need this function to attach extra information with 
   a normal message that the server sends to client
*/


const generateMessage = (username,text) => {


    // Returning a JS object to the client listeners
    return {
        username: username,
        text: text,
        createdAT: new Date().getTime()
    }

}

const generateLocation = (username,message) => {

    message = 'https://google.com/maps?q='+message.lat+','+message.lon
    console.log(message)


    // Returning a JS object to the client listeners
    return {
        username: username,
        location: message,
        createdAT: new Date().getTime()
    }

}


// JS Object ... key values will be used for destructuring in index.js file
module.exports = { 
    generated_msg: generateMessage,
    generated_location: generateLocation 
}


