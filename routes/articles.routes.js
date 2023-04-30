import express from 'express'
import {createNew, deleteArticle, showDetails, updateArticle} from '../controllers/articles.js'
import Article from '../models/article.js'
import {isAuthentecated} from '../utils/auth.js'

const router= express.Router()

router.get('/new', isAuthentecated, (req, res)=> 
    res.render('articles/new.ejs', {article: Article(), errors:{}})
)
router.get('/update/:id', isAuthentecated, async (req, res)=> 
    res.render('articles/update.ejs', {article:await Article.findById(req.params.id), errors:{}})
)
router.get('/:id', showDetails)
router.put('/:id', isAuthentecated, updateArticle)
router.delete('/:id', isAuthentecated, deleteArticle)
router.post('/', isAuthentecated, createNew)


export default router