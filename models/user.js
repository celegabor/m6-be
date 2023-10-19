const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    avatar:{
        type: String,
        required: true,
        default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    password:{
        type: String,
        required: true,
    }
}, {timestamps: true, strict: true})


module.exports = mongoose.model('UsersModel', UserSchema, 'users')