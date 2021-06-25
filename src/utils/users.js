const users = []

// addUser
const addUser = ({username,id,room}) => {
    // clean the data
    username    = username.trim().toLowerCase()
    room        = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room) {
        return{
            error: 'Username and room are required'
        }
    }

    // Check for exesting user
    const existingUser = users.find( (i) => {

        // if both  conditions are met then function returns true
        return i.room===room && i.username===username
    })


    // Validate username
    if(existingUser){
        return {
            error: 'Username is already in use'
        }
    }


    // Store user
    const current_user = {username,id,room}
    users.push(current_user)



    return {current_user}


}

// removeUser
const removeUser = (id) => {
    
    const index = users.findIndex((i) => i.id===id )

    // index = number   (when a  match is found)
    // index = -1       (when no match is found)
    // 

    if(index!== -1){

        // returning the removed object
        return users.splice(index,1)[0]
    }
}

// getUser
const getUser = (id) => {

    return users.find((i) => i.id===id )
}

// getUsersInRoom
const getUsersInRoom = (room) => {

    room = room.trim().toLowerCase()
    return users.filter((i) => i.room===room )

}

module.exports = {

    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}







/* addUser({username: 'me',id:'1',room: 'p'})
addUser({username: 'mre',id:'2',room: 'p'})
addUser({username: 'mreq',id:'2',room: 'a'})
addUser({username: 'mred',id:'2',room: 'a'})
addUser({username: 'mrec',id:'2',room: 'a'})
addUser({username: 'mrez',id:'2',room: 'b'})



console.log(users)
console.log("\n\n")

removeUser({id:'1'})

console.log(users)
console.log("\n\n")


console.log(getUser('2'))


console.log(getUsersInRoom('tt'))


console.log(users) */