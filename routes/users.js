const express = require('express');
const UsersModel = require('../models/user')
const users = express.Router();
const validateUser = require('../middlewares/validateUser')
const bcrypt = require('bcrypt')
const verifiToken = require('../middlewares/verifyToken')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const crypto = require('crypto');
const verifyToken = require('../middlewares/verifyToken');
require('dotenv').config();

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLAUDINARY_CLOUD_NAME,
    api_key: process.env.CLAUDINARY_API_KEY,
    api_secret: process.env.CLAUDINARY_API_SECRET
});

// Configura il caricamento in Cloudinary
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'userAvatars',
        format: async (req, file) => 'png', 
        public_id: (req, file) => file.name
    }
});

const cloudUpload = multer({ storage: cloudStorage });

// get
users.get('/users/get',verifyToken, async (req,res) =>{

    const{ page = 1, pageSize = 10} = req.query

    try {
        const users = await UsersModel.find()
            .limit(pageSize)
            .skip((page -1) * pageSize );

        const totalUsers = await UsersModel.count();


        res.status(200)
            .send({
                statusCode: 200,
                courentPage: Number(page),
                totalPages: Math.ceil(totalUsers / pageSize ),
                totalUsers,
                users
            })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
});

// get by Id
users.get('/users/get/:userId',verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UsersModel.findById(userId);

        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post non trovato!"
            });
        }

        res.status(200).send({
            statusCode: 200,
            user
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// post
users.post('/users/post', validateUser, async(req,res) =>{

    // per la complessità dell'algoritmo da usare
    const salt = await bcrypt.genSalt(10)

    // hash metodo per andare a generare
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    const newUser = new UsersModel({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        dob: Number(req.body.dob),
        avatar: req.body.avatar,
        // usa per creare la password criptata
        password: hashedPassword,
    })
    try {
        const user = await newUser.save()
    
        res.status(201).send({
            statusCode: 201,
                message: "utente salvato con successo",
                payload: user,
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
});

// put
users.put('/users/put/:userId',verifyToken, async (req,res)=>{
    const { userId } = req.params;

    const userExist = await UsersModel.findById(userId);

    if(!userExist){
        return res.status(404).send({
            statusCode: 404,
            message: "this user does not exist!"
        })
    }

    try {
        const dataToUpdateUser = req.body;
        const optionsUser = { new: true };
        const resultUser = await UsersModel.findByIdAndUpdate( userId, dataToUpdateUser, optionsUser)

        res.status(200).send({
            statusCode: 200,
            message: "User saved successfully",
            resultUser 
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
})

// put per caricare un'immagine di copertina (avatar) in Cloudinary per un utente specifico
users.put('/users/:userId/avatar',verifyToken, cloudUpload.single('avatar'), async (req, res) => {
    const userId = req.params.userId;

    try {
        // Verifica se l'immagine è stata caricata correttamente in Cloudinary
        if (req.file) {
            res.status(200).json({
                statusCode: 200,
                message: "Immagine di copertina caricata con successo",
                avatarUrl: req.file.path
            });
        } else {
            res.status(400).json({
                statusCode: 400,
                message: "Caricamento dell'immagine di copertina non riuscito"
            });
        }
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// delete
users.delete('/users/delete/:userId',verifyToken, async (req, res)=>{
    const { userId } = req.params;

    try {
        const user = await UsersModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "user cancellato"
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
})


module.exports = users;