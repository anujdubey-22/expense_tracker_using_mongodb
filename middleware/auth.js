const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyToken = async (req,res,next) => {
    try{
        const token = req.header('authorization');
        console.log(token,'token in auth.js');
        const user = jwt.verify(token, 'shhhhh fir koi hai');
        console.log(user.userId,'user in auth');

        const data =  await User.findOne({ _id: user.userId });
        
        console.log(data,'data in verifytoken');
        req.user = user;
        next();
    }
    catch(error){
        console.log(error,'error in authorization middleware');
    }
}

module.exports = verifyToken;