const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        const token = req.cookies['userProfile'].token
        if(token != undefined){
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.userDate = decoded
        }else{
            return res.redirect('/');
        }
    } catch (error) {
        return res.redirect('/');
    }
    next()
}