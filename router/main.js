module.exports = function(app,fs)
{
  app.get('/',function(req,res){
    var sess = req.session;
    res.render('index',{ //확장자를 안붙이면 index.ejs로 감
      title: "MY HOMEPAGE",
      length: 5,
      name : sess.name,
      username : sess.username
    })
  });

  app.get('/login/:username/:password',function(req,res){
    var sess = req.session;
    fs.readFile(__dirname + "/../data/user.json",'utf8',function(err,data){
      var users = JSON.parse(data);
      var username = req.params.username;
      var password = req.params.password;
      var result = {};
      if(!users[username]){
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }
      if(users[username]["password"] == password){
        result["success"] = 1;
        sess.username = username;
        sess.name = users[username]["name"];
        res.json(result);
      }else{
        result["success"] = 0;
        result["error"] = "incorrect";
        res.json(result);
      }
    });
  });

  app.get('/logout',function(req,res){
    sess = req.session;
    if(sess.username){
      req.session.destroy(function(err){
        if(err) console.log(err);
        else res.redirect('/');
      })
    }
    else{
      res.redirect('/');
    }
  });

  app.get('/about',function(req,res){
    res.render('about.html');
  });

  //API:GET/list
  app.get('/list',function(req,res){
    //console.log(__dirname);
    //__dirname은 이 파일이 있는 경로를 표시함(파)
    fs.readFile(__dirname + "/../data/" + "user.json",'utf8',function(err,data){
      console.log(data);
      res.end(data);
    });
  });

  //API:GET/getUser/:username
  app.get('/getUser/:username',function(req,res){
    fs.readFile(__dirname+"/../data/user.json",'utf8',function(err,data){
      var users = JSON.parse(data);
      res.json(users[req.params.username]);
    });
  });

  //API:POST addUser/:username
  //body:{"password":"___","name":"___"}
  //req(클라이언트->서버),res(서버->클라이언트)
  app.post('/addUser/:username',function(req,res){
    var reault = {};
    var username = req.params.username;

    //password또는 name이 null일 경우
    if(!req.body["password"] || !req.body["name"]){
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // LOAD DATA & CHECK DUPLICATION
    fs.readFile(__dirname+"/../data/user.json",'utf8',function(err,data){
      var users = JSON.parse(data);
      //같은 이름이 있을 경우
      if(users[username]){
        result["success"] = 0;
        result["error"] = "deplicate";
        res.json(result);
        return;
      }

      //데이터 추가
      users[username] = req.body;

      //데이터 저장
      fs.writeFile(__dirname+"/../data/user.json",JSON.stringify(users,null,'\t'),'utf8',function(err,data){
        result = {"success":1};
        res.json(result);
      });
    });
  });

  //API:PUT updateUser/:username
  //body:{"password":"___","name":"___"}
  app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

  //API:DELETE deleteUser/:username
  app.delete('/deleteUser/:username',function(req,res){
    var result = {};
    fs.readFile(__dirname + '/../data/user.json','utf8',function(err,data){
      var users = JSON.parse(data);

      //이름이 없으면
      if(!users[req.params.username]){
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }
      delete users[req.params.username];
      fs.writeFile(__dirname+"/../data/user.json",JSON.stringify(users,null,'\t'),'utf8',function(err,data){
        result["success"] = 1;
        res.json(result);
        return;
      })
    })
  })

}
