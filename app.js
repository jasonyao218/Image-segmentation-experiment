var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');

var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
// delete later
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// index page
app.get('/', function(req, res, next){
    res.render('index');
});

app.get('/quiz.html', function(req,res,next){
    res.render('quiz');
});

app.use('/api', require('./routers/quiz'));
app.use('/api', require('./routers/main'));
app.listen(3000);