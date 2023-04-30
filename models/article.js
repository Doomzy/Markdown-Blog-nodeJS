import mongoose from 'mongoose'

const ArticleSchema= mongoose.Schema({
    "title": {type:String, required: true, unique:true, max:[100, 'too many Words']},
    "date": {type:Date, default:Date.now},
    "summary": {type:String, required: true, max:[400, 'too many Words']},
    "thumbnail": {data:Buffer, conteType:String},
    "content": {type:String, min:[10, 'too few Words'], max:[75000, 'too many Words'], required: true},
    "author": {required:true, type:mongoose.SchemaTypes.ObjectId, ref:"User"}
})

export default mongoose.model('Article', ArticleSchema)