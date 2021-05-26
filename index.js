var express = require("express");
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var app = express();
app.listen(3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use('/static', express.static('public'));
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
var mysql = require('mysql');
const { render } = require("ejs");
// 資料庫連線位置
var connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "",
    database: "wc_db",
})
// 建立連線
connection.connect();

// 首頁輸出
app.get('/', function (req, res) {
    var nowTimeHour = (new Date().toTimeString()).slice(0, 2)      // 06:53:09 GMT+0800 (台北標準時間)
    var sqlquery = `SELECT * FROM wc WHERE SUBSTR(Businesshours,1,2) <= "${nowTimeHour}" AND SUBSTR(Businesshours,6,2) >="${nowTimeHour}" OR Businesshours ="F" ORDER BY Id ASC`
    connection.query(sqlquery, function (error, rows, fields) {
        if (error) throw error;
        // 將資料庫搜尋出來的資料存到一個 local variables 
        // JSON.stringify() 將任何物件轉為 JSON 字串
        // JSON.parse 將JSON 字串轉為 JavaScript 的值
        // 一個都不能少!
        app.locals.renderData = JSON.parse(JSON.stringify(rows));
        res.render('index.ejs')
    })
})

// 送出回報表單
app.post('/add', function (req, res) {
    // 接收 index.js 傳過來的 AJAX
    // body-parser 讓 req.body 可以抓到 body 的資料
    // daytime 新增日期後並把格式轉為 MySQL 日期格式存到 currentMonth
    // data 定義 body 內要抓的 name，wcid 是在 AJAX 自訂的物件 name
    // 最後 connection.query 將資料加入資料庫。
    var body = req.body;
    var daytime = new Date(+new Date() + 8 * 3600 * 1000); //加入相差的8小時
    var currentMonth = daytime.toISOString().substr(0, 19).replace('T', " ");
    var sql = `INSERT INTO reportstatus(Wcid, Status, Type, Reporttime) VALUES(?,?,?,?);`
    var data = [body.wcid, body.cri, body.type, currentMonth]
    connection.query(sql, data, function (error, results, fields) {
        if (error) {
            console.log(error)
        };
    })
});
// FAQ顯示
app.get('/FAQ', function(req, res){
    connection.query('SELECT * FROM customerservice ORDER BY ID DESC LIMIT 5', (error, row) => {
        data = row
        res.render('FAQ', {
            data
        });
        console.log(data);
    })
});
// 傳送表單
app.post('/FAQ', (req, res) => {
    var userName = req.body.userName;
    var message = req.body.message;
    var daytime = new Date(+new Date() + 8 * 3600 * 1000); //加入相差的8小時
    var day = daytime.toISOString().substr(0, 19).replace('T', " ");
    connection.query(`INSERT INTO customerservice(Author, Postcontent, Postingtime ) VALUES('${userName}','${message}','${day}')`)
})