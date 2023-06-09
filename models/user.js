import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const UserSchema= mongoose.Schema({
    first_name: {type: String, maxLength: 20, required:[true, 'please enter a first name']},
    last_name: {type: String, maxLength: 20, required:[true, 'please enter a last name']},
    full_name: {type: String, required:true},
    email: {
        type: String, 
        required:[true, 'please enter an email'], 
        unique: true, 
        lowercase:true,
        validate:[validator.isEmail, 'please enter a valid email']
    },
    password: {
        type: String, 
        required:[true, 'please enter a password'], 
        minLength:[8, 'The password should be more than 8 characters']
    },
    bio: {type: String, maxLength: 150, required:[true, 'please enter your bio']},
    join_date: {type:Date, default:Date.now},
})

UserSchema.pre('validate', function(next){
    if(this.first_name && this.last_name){
        this.full_name= this.first_name + ' ' + this.last_name
    }
    next()
})

UserSchema.pre('save', async function(next){
    const salt= await bcrypt.genSalt()
    this.password= await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.statics.login= async function(email, password){
    const user= await this.findOne({email})
    if(user){
        const correctPass= await bcrypt.compare(password, user.password)
        if(correctPass){
            return user
        }throw Error('Incorrect Password')
    }throw Error('Incorrect Email')
}

export default mongoose.model('User', UserSchema)