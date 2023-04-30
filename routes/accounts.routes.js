import express from 'express'
import {login_user, signup_user, logout_user, user_profile} from '../controllers/accounts.js'
import User from '../models/user.js'

const router= express.Router()

router.get('/u/:id', user_profile)

router.get('/login', (req, res)=> 
    res.render('accounts/login.ejs', {errors:''})
)
router.post('/login', login_user)
router.get('/signup', (req, res)=> 
    res.render('accounts/signup.ejs', {userData: User(), errors:''})
)
router.post('/signup', signup_user)
router.get('/logout', logout_user)

export default router