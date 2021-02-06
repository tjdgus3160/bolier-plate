const { User } = require("../models/User")

let auth = (req, res, next) => {
    // 인증 처리

    // 1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    // 2. 토큰을 복호화 한 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next();
    })

    // 3. 유자가 있으면 인증 ok 없으면 no
}
module.exports = { auth };