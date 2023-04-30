import Jwt  from 'jsonwebtoken'
import User from '../models/user.js'

const secretKey= 'secret ingredient'

function createToken(id, time){
    return Jwt.sign({id}, secretKey, {expiresIn:time})
}

function isAuthentecated(req, res, next){
    const token= req.cookies.JWT
    if(token){
        Jwt.verify(token, secretKey, (error, dToken)=>{
            error? res.redirect('/accounts/login')
            : next()
        })
    }else{
        res.redirect('/accounts/login')
    }
}

function getCurrentUser(req, res, next){
    const token= req.cookies.JWT
    if(token){
        Jwt.verify(token, secretKey,async (error, dToken)=>{
            if(error){
                res.locals.user= null
            }else{
                let currentUser= await User.findById(dToken.id)
                res.locals.user= currentUser
            }                
            next()
        })
    }else{
        res.locals.user= null
        next()
    }
}

export {createToken, isAuthentecated, getCurrentUser}