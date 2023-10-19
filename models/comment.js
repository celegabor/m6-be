const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UsersModel', 
        required: true
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('commentModel', CommentSchema, 'comment')