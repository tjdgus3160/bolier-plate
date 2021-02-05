const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser') 
// badyParser : 클라이언트에서 보낸 정보를 서버에서 분석해서 가져올수 있게 함
const { User } = require('./models/User')

// application/x-www-form-urlencoded 형식의 데이터 분석해서 가져올 수 있게 옵션 줌
app.use(bodyParser.urlencoded({extended:true}))

// application/json 형식의 데이터 분석해서 가져올 수 있게 옵션 줌
app.use(bodyParser.json())

const mongoose = require('mongoose')
const config = require('./config/key')

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, // 옵션 줘야지 에러가 안남
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/',(req,res) => res.send('Hello World!'))

app.post('/register',(req,res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
