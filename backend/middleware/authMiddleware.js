const jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({error : 'Access Denied'});
    }
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(err){
        res.status(400).json({error : 'Invalid Token'});
    }
};
