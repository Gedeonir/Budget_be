const socketIO = require('socket.io')({
    cors:{
        origin:"*",
    }
})
const jwt = require("jsonwebtoken");
const Notification = require('../models/notifications')
const emitter = require('./Emitter')

const tokenVerification = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRETE);
}

const getNotifications = async (user) =>{
    return Notification.find({ receiver: { $in: user } , isRead:false})
    .populate('receiver') // Optionally populate the receiver field
    .populate('sender') 
    .sort({ createdAt: -1 })
}


const socketMethod = {};

socketMethod.socketStarter = server =>{
    socketIO.attach(server);
    socketIO.on("connection", async (socket) => {
        emitter.on("notification request", async () => {
            const token = socket.handshake.auth.token
            console.log(token)
            const verifyToken = tokenVerification(token);
            const userInfo = await getNotifications(verifyToken._id);
            socket.emit('Notification',userInfo);
        });
    });
};

module.exports = {socketMethod,socketIO}