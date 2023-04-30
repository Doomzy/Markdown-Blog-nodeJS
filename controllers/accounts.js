import User from '../models/user.js'
import Article from '../models/article.js'
import{createToken} from '../utils/auth.js'

function errorsCleaner(errs){
    let cleanedErrs= {}
    if(errs.code === 11000){
        cleanedErrs['email']= 'This email has been already used'
    }
    else{
        Object.values(errs.errors).forEach(err=>{
            cleanedErrs[err.path]= err.message
        })
    }
    
    return cleanedErrs
}

const expiresIn= 5 * 24*60*60 //seconds

async function login_user(req, res){
    const userData= req.body
    try{
        const myUSer= await User.login(userData.loginEmail, userData.loginPass)
        const uToken= createToken(myUSer._id, expiresIn)
        res.cookie('JWT', uToken,{httpOnly:true, maxAge:expiresIn*1000}) //ms
        res.redirect('/')
    }catch(e){
        res.render('accounts/login.ejs', {errors:e.message})
    }
}

async function signup_user(req, res){
    const userData= req.body
    const newUser= new User({
        first_name: userData.fName,
        last_name: userData.lName,
        email: userData.email,
        password: userData.oPassword,
        bio: userData.bio,
    })
    try{
        await newUser.save()
        const uToken= createToken(newUser._id, expiresIn)
        res.cookie('JWT', uToken,{httpOnly:true, maxAge:expiresIn*1000}) //ms
        res.redirect('/')
    }catch(e){
        const errors= errorsCleaner(e)
        res.render('accounts/signup.ejs', {userData: newUser, errors:errors})
    }
}

function logout_user(req, res){
    res.cookie('JWT', '', {maxAge:1})
    res.redirect('/')
}

async function user_profile(req, res){
    const uid= req.params.id
    try{
        const profileData= await User.findById(uid)
        const userArticles= await Article.find({author: uid}).sort({date:-1})
        res.render('accounts/profile.ejs', {profileData, articles: userArticles})
    }catch(e){
        res.redirect('/')
    }
}

export {login_user, signup_user, logout_user, user_profile}