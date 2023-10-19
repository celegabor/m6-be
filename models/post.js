const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        default: "general"
    },
    cover:{
        type: String,
        required: false,
    },
    readTime:{
        value: {
            type: Number,
            default: 0,
        },
        unit: {
            type: String,
            default: "mt"
        }
    },
    content:{
        type: String,
        required: false
    }, 
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UsersModel',
        required: true
    },
    content: {
        type: String,
        required: true,
        default: "contenuto"
    }


}, {timestamps: true, strict: true})

module.exports = mongoose.model('postModel', PostsSchema, 'posts')