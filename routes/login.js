const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const UsersModel = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

login.post('/login', async(req, res)=>{

    // recupero un solo utente tramite email
    const user = await UsersModel.findOne({email: req.body.email})

    // controllo se non c'è l'utente
    if(!user){
        return res.status(404).send({
            message: 'nome utente errato o inesistente',
            statusCode: 404
        })
    }

    // constrollo validità passord comparando l'input con la password già esistente
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword){
        return res.status(400).send({
            message: 'email o password errati',
            statusCode: 400
        })
    }

    //generazione token con i dati scelti + la nostra frima segreta in .env 
    const token = jwt.sign({
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob
    }, process.env.JWT_SECRET,{
        // quanto il token resta attivo prima di scadere 
        expiresIn: '10d'
    })

    // me lo faccio restituire nel header che poi lo prendi nella pag login
    res.header('Authorization', token).status(200).send({
        message: 'login effettuato con successo',
        statusCode: 200,
        token
    })

})


module.exports = login