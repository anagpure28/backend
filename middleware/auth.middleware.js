const jwt = require("jsonwebtoken");
require("dotenv").config()

const auth = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(token){
        try {
            const decoded = jwt.verify(token,process.env.secretKey);
            if(decoded){
                req.body.userID = decoded.userID
                next()
            }else{
                res.status(200).json({msg: "Not Authorized!!"});
            }
        } catch (err) {
            res.status(200).json({error: err.message});
        }
    }else{
        res.status(400).json({msg: "Please Login!!"})
    }
}

module.exports = {
    auth
}