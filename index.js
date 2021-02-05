const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser') 
// badyParser : 클라이언트에서 보낸 정보를 서버에서 분석해서 가져올수 있게 함
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')

// application/x-www-form-urlencoded 형식의 데이터 분석해서 가져올 수 있게 옵션 줌
app.use(bodyParser.urlencoded({extended:true}))

// application/json 형식의 데이터 분석해서 가져올 수 있게 옵션 줌
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
const config = require('./config/key')

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, // 옵션 줘야지 에러가 안남
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/',(req, res) => res.send('Hello World!'))

app.post('/api/user/register',(req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져와서 db에 넣어준다.

    const user = new User(req.body) // req.body : json형식으로 클라이언트에서 보낸 정보
    // mongodb에 저장
    user.save((err, userInfo) => {
      if(err) return res.json({ success: false, err})
      return res.status(200).json({
        success: true
      })
    }) 
})

app.post('/api/user/login', (req, res) => {
  
  // 1. 요청된 이메일을 db에서 찾는다.
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 2. 요청된 이메일이 db에 있다면 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({
          loginSuccess: false, 
          message: "비밀번호가 틀렸습니다."
        })
      }
      // 3. 비밀번호까지 같으면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장(로컬스토리지, 세션스토리지 등)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
