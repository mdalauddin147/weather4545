const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWTSECRET

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
       jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if(err){
            return res.status(401).json({
                message: "Token not Authorized",
            })
        }else{
            if(decodedToken.role !== "admin"){
                return res.status(401).json({
                    message: "Not Authorized, not an admin"
                })
            }else{
                next()
            }
        }
       }) 
    }else{
        res.status(401).json({
            message: "Not Authorized, token not available for the admin",
        })
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "Token Not Authorized"})
            }else{
                if(decodedToken.role !== "Basic"){
                    return res.status(401).json({message: "Not Authorized"})
                }else{
                    res.locals.userData = {
                        username: decodedToken.username,
                        defaultlocation: decodedToken.defaultlocation
                    }
                    next()
                }
            }
        })
    }else{
        res.status(401).json({
            message: "Not authorized, token not available for the user",
        })
    }
}