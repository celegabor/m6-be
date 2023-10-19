// richiedi le varie cose
const express = require('express');
const CommentModel = require('../models/comment')
// rotta dei commenti
const comment = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const validateComment = require('../middlewares/validateComment')
// importa dati .env (dati nascost)
require('dotenv').config()

// get
comment.get('/comment/get',verifyToken, async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('author')

        res.status(200).send({
            statusCode: 200,
            comments
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// get per ottenere tutti i commenti di un post specifico
comment.get('/posts/:postId/comment',verifyToken, async (req, res) => {
    const postId = req.params.postId;

    try {
        const commentsForPost = await CommentModel.find({ postId: postId }).populate('author').exec();

        if (!commentsForPost || commentsForPost.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: "Nessun commento trovato per questo post."
            });
        }

        res.status(200).send({
            statusCode: 200,
            postId: postId,
            comments: commentsForPost
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// get per ottenere un commento specifico di un post specifico
comment.get('/posts/:postId/comment/:commentId',verifyToken, async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    try {
        const specificComment = await CommentModel.findOne({ _id: commentId, postId: postId }).populate('author').exec();

        if (!specificComment) {
            return res.status(404).send({
                statusCode: 404,
                message: "Commento non trovato per questo post."
            });
        }

        res.status(200).send({
            statusCode: 200,
            postId: postId,
            commentId: commentId,
            comment: specificComment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// put
comment.put('/comment/put/:commentId',verifyToken, async (req, res) => {
    const { commentId } = req.params;

    // Controlla se il post esiste
    const commentExist = await CommentModel.findById(commentId);

    if (!commentExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This comment does not exist!"
        });
    }

    try {
        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await CommentModel.findByIdAndUpdate( commentId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post saved successfully",
            result 
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
});

// post
comment.post('/posts/:postId/comment/post',verifyToken, validateComment, async (req, res) => {
    
    const { postId } = req.params;

    const newComment = new CommentModel({
        comment: req.body.comment,
        postId: postId,
        author: req.body.author
    });

    try {

        const comment = await newComment.save();

        res.status(200).send({
            statusCode: 200,
            message: "Comment added successfully",
            payload: comment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
});

// delete
comment.delete('/comment/delete/:commentId',verifyToken, async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await CommentModel.findByIdAndDelete(commentId);

        if(!comment){

            return res.status(404).send({
                statusCode: 404,
                message: "Comment not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "comment deleted"
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
})


module.exports = comment;
