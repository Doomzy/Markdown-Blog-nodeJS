import Article from '../models/article.js'
import User from '../models/user.js'
import showdown from 'showdown'
import multer from 'multer';
import path from 'path';

let converter = new showdown.Converter({tables: true});

let storage= multer.memoryStorage()
const upload= multer({
    storage: storage,
    limits: { fileSize: 10 *1000 *1000 },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
}).single('thumbnail')

function errorsCleaner(errs){
    let cleanedErrs= {}
    if(errs.code === 11000){
        cleanedErrs['title']= 'This title has been already used'
    }else{
        Object.values(errs.errors).forEach(err=>{
            cleanedErrs[err.path]= err.message
        })
    }
    
    return cleanedErrs
}

function cleanArticleContent(text){
    const regexArr= [
        '<script\\b[^<]*(?:(?!</script>)<[^<]*)*</script>',
        '<textarea\\b[^<]*(?:(?!</textarea>)<[^<]*)*</textarea>',
        '<select\\b[^<]*(?:(?!</select>)<[^<]*)*</select>',
        '<button\\b[^<]*(?:(?!</button>)<[^<]*)*</button>',
        '<audio\\b[^<]*(?:(?!</audio>)<[^<]*)*</audio>',
        '<video\\b[^<]*(?:(?!</video>)<[^<]*)*</video>',
        '<object\\b[^<]*(?:(?!</object>)<[^<]*)*</object>',
        '<iframe\\b[^<]*(?:(?!</iframe>)<[^<]*)*</iframe>',
        '<input\\b[^<]*>|</input>',
        '<link\\b[^<]*>|</link>',
        '<embed\\b[^<]*>|</embed>',
    ]
    let cleanedText= text.replace( new RegExp(regexArr.join('|'), 'g'), "")
    return cleanedText
}

async function getAll(req, res){
    const articles= await Article.find().sort({date:-1})
    res.render('index.ejs', {articles:articles})
}

async function createNew(req, res){

    upload(req, res,async (err)=>{
        let article = new Article({
            title:req.body.title, content:cleanArticleContent(req.body.content), 
            summary:req.body.summary, 
            })
        if(err || !req.file){
            const errors= {'thumbnail': 'You Have To Add a Thumbnail With These Types(.jpg/.jpeg/.png)'}
            res.render('articles/new.ejs', {article, errors})
        }else{
            article.author= res.locals.user.id
            article.thumbnail= {data: req.file.buffer, contentType:'image/png'}
            article= await article.save()
            .then(a=>res.redirect(`/articles/${article.id}`))
            .catch(e=>{
                const errors= errorsCleaner(e)
                res.render('articles/new.ejs', {article, errors})
            })
        }
    })
    
}

async function deleteArticle(req, res){
    const aid= req.params.id
    await Article.deleteOne({_id:aid, author:res.locals.user.id})
    .then((error)=>{
        if(error.deletedCount == 0){
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    })
}

async function showDetails(req, res){
    const id= req.params.id
    try{
        const article= await Article.findById(id)
        article.content= converter.makeHtml(article.content)
        const author= await User.findById(article.author)
        res.render('articles/show.ejs', {article, author})
    }catch(e){
        res.redirect('/')
    }
}

async function updateArticle(req, res){
    const aid= req.params.id
    let article= await Article.findOne({_id:aid, author:res.locals.user.id})
    upload(req, res, async(err)=>{
        if(err){
            const errors= {'thumbnail': 'You Have To Add a vail type(.jpg/.jpeg/.png)'}
            res.render('articles/update.ejs', {article, errors})
        }else{
            article.title= req.body.title
            article.content= cleanArticleContent(req.body.content)
            article.summary= req.body.summary
            if(req.file){
                article.thumbnail= {data: req.file.buffer, contentType:'image/png'}
            }
            await article.save()
            .then(a=>res.redirect(`/articles/${aid}`))
            .catch(e=> {
                const errors= errorsCleaner(e)
                res.render('articles/update.ejs', {article, errors})
            })
            
        }
    })

}

export{createNew, getAll, deleteArticle, showDetails, updateArticle}