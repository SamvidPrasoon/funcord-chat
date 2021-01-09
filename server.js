const express = require('express');
const router = require('../backend/routes');
const socketsio = require ('socket.io');
const cors = require('cors');
const http = require('http');

const {adduser,removeuser,getuser,getRoomUsers} = require('../backend/users'); 
const PORT = process.env.PORT || 5000;


const app = express();
app.use(router);
app.use(cors());
const server = http.createServer(app);


const io = socketsio(server,{cors:{origin:'*'}});
io.on('connection',(socket)=>{
    console.log('we have a new connection');

   socket.on("Join",({name,room},callback)=>{
     
       const {error,user} = adduser({id:socket.id,name,room});
    //    if(error)
    //    {
    //        return callback(error);
           
    //    }
       

       
          if(name){
           socket.emit("message",{user:"admin",text:`${user.name},welcome to the room ${user.room} `});
           socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name},has joined`})

           socket.join(user.room);
           io.to(user.room).emit('roomdata',{room:user.room,users:getRoomUsers(user.room)})
          //console.log(getuserInroom(user.room)) ;
        }
         
   })
     
   socket.on("sendmessage",(message,callback)=>{
       //console.log(message);
         console.log(socket.id);
         const user = getuser(socket.id);
         console.log(user);
         io.to(user.room).emit('message',{user:user.name,text:message});
         
        
        callback();

   })
   
    socket.on('disconnect',()=>{
        const user =  removeuser(socket.id);
       // console.log(user);
        if(user)
        {
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room`})
            io.to(user.room).emit('roomdata',{room:user.room,users:getRoomUsers(user.room)});
        }
    })
})

server.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`)
});