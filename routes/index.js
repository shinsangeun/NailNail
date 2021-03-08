const express = require('express');
const router = express.Router();
const db_config = require('../db/config');
const conn = db_config.init();
db_config.connect(conn);

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index.html');
});

router.get('/generic', (req, res) => {
  res.render('generic.html');
});

router.get('/elements', (req, res) => {
  res.render('elements.html');
});

router.get('/reservation', (req, res) => {
  res.render('./reservation/reserve.html');
});

router.post('/reservation/save', (req, res) => {
  console.log("date:", req.body.date);

  if(req.body.date === '' || req.body.category === '' || req.body.time === ''){
    res.status(400).send("날짜, 시간, 시술을 선택해 주세요.");
  }else {
    let sql = "INSERT INTO reservation (category, reserveDate, reserveTime) VALUES (?, ?, ?);";
    let params = [decodeURI(req.body.category), req.body.date, req.body.time+":00"];

    conn.query(sql, params,  (err, rows, fields) =>{
      if (err) {
        console.log('query is not...', err);
      } else {
        console.log("rows:", rows);

        res.render('./reservation.html');
      }
    })
  }
});

router.get('/review/list', (req, res) => {
  res.render('./review/list.html');
});

router.get('/review/list/data', (req, res) => {
  let sql = "SELECT * FROM review";
  conn.query(sql,  (err, rows, fields) => {
    if(err){
      console.log('query is not...', err);
    }else{
      res.send({data: rows});
    }
  })
});

router.get('/review/write', (req, res) =>{
  res.render('./review/write.html');
});

router.post('/review/write', (req, res) => {
  console.log("Req:", req.body.date, req.body.data);

  if(req.body.title === '' || req.body.body === ''){
    res.status(400).send("제목과 내용을 입력해 주세요.");
  }else {
    let sql = "INSERT INTO review (title, name, email, message, image, date) VALUES (?, ?, ?, ?, ?, ?);";
    let params = [req.body.title, req.body.name, req.body.email, req.body.message, req.body.image, new Date()];

    conn.query(sql, params,  (err, rows, fields) =>{
      if (err) {
        console.log('query is not...', err);
      } else {
        console.log("rows:", rows);
        res.render('./review/list.html', {list: rows});
      }
    })
  }
});

router.get('/review/view/:id', (req, res) => {
  res.render('./review/view.html');
});

router.get('/review/data/:id', (req, res) => {
  console.log("params2:", req.params.id.split('=')[1], req.query.id);
  let id = req.params.id.split('=')[1];

  // 특정 id 받아 오도록 수정
  let sql = "SELECT * FROM review where id =" + id;
  conn.query(sql,  (err, rows) => {
    if(err){
      console.log('query is not...', err);
    }else{
      res.send({data: rows});
    }
  })
});

/* TODO 좋아요 페이지 id 파라미터 수정 필요 */
router.post('/review/:id/like', (req, res) => {
  console.log("param:", req.param.id);

  // 특정 id 받아 오도록 수정
  let sql = "UPDATE review SET likeCnt = likeCnt + 1 where id = 20";
  conn.query(sql,  (err, rows) => {
    if(err){
      console.log('query is not...', err);
    }else{
      res.send({data: rows});
    }
  })
});

router.get('/review/modify', (req, res) => {
  res.render('./review/modify.html');
});

/* TODO 수정 필요 */
router.get('/review/modify/:id', (req, res) => {
  let id = req.params.id;
  console.log("id==>", id);

  let sql = "SELECT * FROM review where id=" + id;
  conn.query(sql,  (err, rows, fields) => {
    if(err){
      console.log('query is not...', err);
    }else{
      console.log("rows:", rows);
      res.send({data: rows});
     // res.redirect('/review/modify?id=' + id);
    }
  })

  // 후기 업데이트 구문
  /*
  let upTitle = req.body.updateTitle;
  let upContent = req.body.upContent;
  let id = req.params.id;
  let sql = "UPDATE review set title=?, content=? where id=?";
  let params = [upTitle, upContent];

  conn.query(sql, params, (err, rows)=> {
    console.log("rows:", rows);

    res.redirect('/review/modify?id=' + id);
  })
  // res.render('./review/modify.html');
  */
});

router.get('/myPage', (req, res) => {
  res.render('./myPage/myPage.html');
});

/* 적립금 조회 */
router.get('/myPage/balance', (req, res) => {
  let sql = "SELECT * FROM mypage";
  conn.query(sql,  (err, rows, fields) => {
    if(err){
      console.log('query is not...', err);
    }else{
      res.send({data: rows});
    }
  })
});

/* 예약 조회 */
router.get('/myPage/reservation', (req, res) => {
  let sql = "SELECT * FROM reservation";
  conn.query(sql,  (err, rows, fields) => {
    if(err){
      console.log('query is not...', err);
    }else{
      res.send({data: rows});
    }
  })
});

router.get('/login', (req, res) => {
  res.render('./login/login.html');
});

router.get('/common/menu', (req, res) => {
  res.render('./common/menu.html');
});

router.get('/common/banner', (req, res) => {
  res.render('./common/banner.html');
});

router.get('/common/header', (req, res) => {
  res.render('./common/header.html');
});

module.exports = router;
