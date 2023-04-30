import express from 'express'
import method_override from 'method-override'
import articlesRouter from './routes/articles.routes.js'
import accountsRouter from './routes/accounts.routes.js'
import dbConnection from './config/db.js'
import cookieParser from 'cookie-parser'
import {getCurrentUser} from './utils/auth.js'
import {getAll} from './controllers/articles.js'

const app= express()
app.use(express.urlencoded({extended: false}))
app.use(method_override('_method'))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(cookieParser())

async function startApp(){
    try{
        await dbConnection('db URI')
        app.listen('server path', ()=> console.log('server is running!'))
    }catch(e){
        console.log(e)
    }
}

app.all('*', getCurrentUser)
app.get('', getAll)
app.get('/guide', (req, res)=> res.render('guide.ejs'))
app.use('/articles', articlesRouter)
app.use('/accounts', accountsRouter)
startApp()

