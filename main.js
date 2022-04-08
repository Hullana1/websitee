const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'khulan215',
	database : 'nodelogin'
});

const app = express();
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
	response.render('pages/Home');
});

app.post('/tolgn', function(request, response){
	response.render('pages/login');
});

app.post('/auth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.render('pages/Home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/toregister', function(request, response){
	response.render('pages/Register');
});

app.post('/registeract', function(request, response){
    let uname = request.body.uname;
    let pword = request.body.pword;
    let email = request.body.email;;
    if(uname && pword && email ){
        connection.query('INSERT INTO accounts (username, password, email) VALUES (?,?,?)',[uname,pword,email], function(error, results, fields){
            if(error){
                console.log('Reg failed');
            }else{
                console.log('Reg successfull')
            }
        });
    }
    response.end();
});

app.listen(3000);






















// http://localhost:3000/home
// app.get('/home', function(request, response) {
// 	// If the user is loggedin
// 	if (request.session.loggedin) {
// 		// Output username
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		// Not logged in
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });
