const validatePost = (req, res, next) =>{
    const errors = []

    const {title, category, cover, readTime, content, author} = req.body

    const { value, unit} = readTime;
    // const {name, avatar} = author;

    if(typeof title !== 'string'){
        errors.push('title must be a string')
    }
    if(typeof category !== 'string'){
        errors.push('category must be a string')
    }
    // if(typeof cover !== 'string'){
    //     errors.push('cover must be a string')
    // }
    if(typeof value !== 'number'){
        errors.push('readTime => value must be a number')
    }
    if(typeof unit !== 'string'){
        errors.push('readTime => unit must be a string')
    }
    if(typeof content !== 'string'){
        errors.push('content must be a string')
    }
    if(typeof author !== 'string'){
        errors.push('author must be a string')
    }
    // if(typeof name !== 'string'){
    //     errors.push('author => name must be a string')
    // }
    // if(typeof avatar !== 'string'){
    //     errors.push('author => avatar must be a string')
    // }

    if(errors.length > 0){
        res.status(400).send({errors})
    } else {
        next()
    }
    
}

module.exports = validatePost