
const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {


    // check incomimg data 
    console.log(req.headers);

    //get authorization data from header
    const authHeader = req.headers.authorization;

    // check or validate
    if (!authHeader) {

        return res.status(400).json({
            success: false,
            message: "Auth Header not found!"

        })
    }
    //split the data( Format: 'Bearer token-sdfg')- only token
    const token = authHeader.split(' ')[1]

    //if token not found : stop the process(res)

    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: "Token not found!"

        })
    }
    //if token found : verify

    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeUserData;
        next()

    } catch (error) {
        res.status(400)({
            success: false,
            message: "Not Authenticated!"
        })
    }
    //if verified : next(function in controller)
    //if not verified : not auth

}

module.exports = {
    authGuard
}