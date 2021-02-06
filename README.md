## bolier-plate
### React + Node

client 실행 npm run client
server 실행 npm run server
한번에 실행 npm run dev

### 사용한 npm모듈

server(Node)
+ express : node express
+ mongoose : mongodb를 사용하기 편하게 모델링
+ badyParser : 클라이언트에서 보낸 정보를 서버에서 분석해서 가져올수 있게 함
+ bcrypt : db에서 비밀번호 암호화
+ jsonwebtoken : JWT 토큰 생성
+ cookie-parser : 토큰 쿠키에 저장

client(React)
+ react-router-dom : 페이지 이동