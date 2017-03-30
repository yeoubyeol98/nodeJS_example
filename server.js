var express = require('express'); //express 모듈 불러오기
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session'); //직접 쿠키에 접근
var fs = require('fs'); //파일열기

app.set('views',__dirname + '/views');  //서버가 읽을 수 있도록 HTML의 위치를 정의

/**
 * EJS 템플릿 엔진
 * 템플릿 엔진이란, 템플릿을 읽어 엔진의 문법과 설정에 따라서 파일을 HTML 형식으로 변환시키는 모듈
 * 1. <% 자바스크립트 코드 %>
 * 2. <% 출력 할 자바스크립트 객체 %>
 * 2번에서는 자바스크립트 객체를 router 에서 받아 올 수도 있음
 */
app.set('view engine','ejs'); //서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정함
app.engine('html',require('ejs').renderFile); //서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정함

var server = app.listen(3000,function(){
  console.log("Express server has started on port 3000")
});

app.use(express.static('public'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded()); body-parser deprecated undefined extended: provide extended option server.js:51 : 20이란 에러가 난다.
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: '@#@$MYSIGN#@$#$', //쿠키를 임의로 변조하는것을 방지하기 위한 sing값, 원하는 값을 넣어도 됨
  resave: false,  // 세션을 언제나 저장할지(변경되지 않아도)정하는값, express-session documentation에서는 이 값을 false로 하는 것을 권장
  saveUninitialized: true //uninitialized 세션이란 새로 생겼지만 변경되지 않은 세션을 의미합니다. Documentation에서 이 값을 true로 설정하는것을 권장
}));

/**
 * 이 코드가 bodyParser  설정 아래부분에 있다면 제대로 작동하지 않는다
 * router 에서 fs 모듈을 사용 할 수 있도록 인자로 추가
 */
var router = require('./router/main')(app,fs); //라우터 모듈인 main.js를 불러와서 app에 전달
