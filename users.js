const users = [];
 

const adduser = ({id,name,room})=>{
      name = name.trim().toLowerCase();
      room = room.trim().toLowerCase();
     const existuser = users.find((user)=>{
         user.room === room && user.name===name 
     });
     if(existuser)
     {
       
         return { error: 'Username is taken.' }
     }
     else{
         
         const user = {id,name,room};
         users.push(user);
         console.log(user);
         return {user};
     }
 }

 const removeuser = (id) => {
    const index = users.findIndex((user) => user.id === id);
  
    if(index !== -1) return users.splice(index, 1)[0];
  }

const getuser = (id) => users.find((user) => user.id === id);
  



function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }



module.exports = {adduser,removeuser,getuser,getRoomUsers};
