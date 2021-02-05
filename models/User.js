const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 // 글자 수
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50   
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    if(this.isModified('password')){
        // 비밀번호 암호화 과정
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(this.password, salt, function(err, hash){
                if(err) return next(err)
                this.password = hash
                next()
            })
        })
    }
    next()
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    // jsonwebtoken을 이용하여 token 생성하기
    const token = jwt.sign(this._id.toHexString(), 'secretToken')   // user._id + 'secretToken' => 토큰 생성
    this.token = token
    this.save(function(err, uesr){
        if(err) return cb(err)
        cb(null, this)
    })
}   

const User = mongoose.model('User',userSchema)

module.exports = { User }