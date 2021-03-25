var express = require('express');
var fs = require('fs');
var router = express.Router();

var response;

router.use(function(req, res, next){
    response = {
        nextFolder: '',
        dataSet: ''
    }
    next();
});

router.post('/quiz', function(req, res, next){
    function nextFolder(root, nextId){
        var files = fs.readdirSync(root + nextId);
        if(files.length != 0){
            return nextId; 
        }
        while(parseInt(nextId) < 500){
            var nextId = parseInt(nextId) + 1;
            if(nextId < 10){
                var nextId = "00" + nextId;
            }
            else if(nextId < 99){
                var nextId = "0" + nextId;
            }
            else{
                var nextId = nextId.toString();
            }
            files = fs.readdirSync(root + nextId);
            if(files.length != 0){
                return nextId; 
            }
        }
        return '0'
    }
    var dataSet = "cityscape";
    var currId = req.body.curr_id;
    console.log(req.body);
    var nextFolder = nextFolder('public/ECCV_AMT/cityscape/Sum/', req.body.next_id);
    var savedFile = req.body.saved_file;
    // write user's answer to saved json file.
    var img_src = req.body.img_src;
    var picked;
    if(img_src.includes("Shape")){
        picked = "shape";
    }
    else if(img_src.includes("MulExp")){
        picked = "mulexp";
    }
    else if(img_src.includes("BothLoss")){
        picked = "bothloss";
    }
    else{
        picked = "lsgan";
    }
    // console.log(savedFile);
    response.nextFolder = nextFolder;
    response.dataSet = 'cityscape';
    fs.readFile(savedFile,function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);
        // console.log(parseJson.table);
        // parseJson.table.push({
        //     image_set: dataSet,
        //     image_number: currId,
        //     answer: picked
        // })
        var newRecord = {
            image_set: dataSet,
            image_number: currId,
            answer: picked
        }
        parseJson['result'].push(newRecord);
        console.log(parseJson);
        fs.writeFile(savedFile,JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
    });
    // var data = JSON.stringify({
    //     image_set: dataSet,
    //     image_number: currId,
    //     answer: picked
    // });
    // fs.writeFileSync(savedFile, data);
    res.json(response);
    return;
});

module.exports = router;