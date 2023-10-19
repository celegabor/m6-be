// richiedi le varie cose
const express = require('express');
const mongoose = require('mongoose');
const postsRoute = require('./routes/posts')
const userRoute = require('./routes/users')
const emailRoute = require('./routes/sendMail')
const path = require('path')
const cors = require('cors')
const githubRoute = require('./routes/github')
const googleRoute = require('./routes/google')
const loginRoute = require('./routes/login')
const commentRoute = require('./routes/commentPost')

require('dotenv').config()

// x usare tutti metodi che la libreria mette a disposizione si dichiara in una costante
const app = express();

// dichiara la porta (http://localhotst:2015/......)
const PORT = 2105;

// rendi accessibile pubblicamente x non avere problemi di errori dal server in caso di puntamento a questo indirizzo, è una cartella che contiene indirizzi statici
app.use('/pubblic', express.static(path.join(__dirname, './pubblic')))

// app.use(express.static('pubblic'))
app.use(express.json())

// aggiungi cors per autenticare i blocchi cors
app.use(cors())

// dichiaragli le varie rotte
app.use('/', postsRoute)
app.use('/', userRoute)
app.use('/', emailRoute)
app.use('/', loginRoute)
app.use('/', githubRoute)
app.use('/', googleRoute)
app.use('/', commentRoute)

// in fase di lancio deve agganciarsi al database/ primo parametro stringa database
mongoose.connect(process.env.MONGODB_URL,{
    uSeNewUrLParser: true,
    useUnifiedTopology: true,
})

// costante che ascolta e fa in base alla situazione
const db = mongoose.connection;

// ogni volta che ce un errore 
db.on('error', console.error.bind(console,'error during db connection'))

// solo una volta al lancio restituisce la callback
db.once('open', ()=>{
    console.log('database successfully open');
})

// dove deve restare in ascolto per le varie chiamate in client
app.listen(PORT, ()=> console.log('server up', PORT));