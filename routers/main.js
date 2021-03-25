var express = require('express');
var fs = require('fs');
var router = express.Router();

var response;

router.use(function(req, res, next){
    response = {
        filename: ''
    }
    next();
});

router.post('/main', function(req, res, next){
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;

    var user = {
        name: name,
        age: age,
        gender: gender,
        result: []
    };
    var date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
    var filename = 'public/result/' + year + '-' + month + '-' + date + '-' + hours + '-' + minutes + '-' + seconds + '-' + name.replace(/\s+/g, '') + '.json'; 
    var data = JSON.stringify(user);
    fs.writeFileSync(filename, data);
    response.filename = filename;
    console.log(response);
    res.json(response);
    return;
});



module.exports = router;