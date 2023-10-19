const express = require('express')
const { createTransport } = require('nodemailer')
const email = express.Router()

// const transporter = createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'icie.dibbert@ethereal.email',
//         pass: 'XABWbM3dphzeV8Uyt9'
//     }
// });

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'judson.schumm@ethereal.email',
        pass: 'JnUkZjmGXEASznUV6u'
    }
});

email.post('/send-email', async(req, res)=>{
    const { recipient, subject, text } = req.body

    const mailOptions = {
        from: 'celegabor@gmail.com',
        to: 'judson.schumm@ethereal.email',
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error) {
            console.log(error);
            res.status(500).send('errore durante invio mail')
        } else {
            console.log('mail inviata');
            res.status(200).send('email inviata')
        }
    })

})

module.exports = email