const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    // prendiamo in token dall'header
    const token = req.header('Authorization')

    if(!token){
        return res.status(401).send({
            errorType: 'token non presente',
            statusCode: 401,
            message: 'è necessario un token'
        })
    }

    try {
        // verifichiamo il token tramite JWT_SECRET
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified

        next()
    } catch (e) {
        res.status(403).send({
            errorType: 'token error',
            statusCode: 403,
            message: 'token scaduto o non valido'
        })
    }
}