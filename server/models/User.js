const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 글자 수
const jwt = require('jsonwebtoken');

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
        type: Number,   // 일반유저 0, 그 외 관리자
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        // 비밀번호 암호화 과정
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
    next();
});

// 비밀번호 확인 함수
userSchema.methods.comparePassword = function(plainPassword, cb){
    var user = this;
    bcrypt.compare(plainPassword, user.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
}

// 토크 생성 함수
userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용하여 token 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secretToken');   // user._id + 'secretToken' => 토큰 생성
    user.token = token
    user.save(function(err, uesr){
        if(err) return cb(err);
        cb(null, user);
    });
}   

// 토큰으로 유저 찾는 함수
userSchema.statics.findByToken = function(token, cb){
    var user = this;
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용하여 유저를 찾은 후
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null, user);
        });
    });
}

const User = mongoose.model('User',userSchema);

module.exports = { User };