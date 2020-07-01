const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send('Access denied,No token provided')

    try{
        const payload = jwt.verify(token, 'IamFuck')
        req.user = payload;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid Token')
    }
} 