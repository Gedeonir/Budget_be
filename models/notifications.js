const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    receiver: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }],

    sender: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }],

},{timestamps:true});

module.exports = mongoose.model("Notifications", notificationSchema)