function ckChange(ckType){
	var ckName = document.getElementsByName(ckType.name);
    var checked = document.getElementById(ckType.id);

    if (checked.checked) {
      for(var i=0; i < ckName.length; i++){

          if(!ckName[i].checked){
              ckName[i].disabled = true;
          }else{
              ckName[i].disabled = false;
          }
      } 
    }
    else {
      for(var i=0; i < ckName.length; i++){
        ckName[i].disabled = false;
      } 
    } 
}

function getId(){
	// Get the directory of the current image folder
	var img = document.getElementById("missing").src;
	console.log(img);
	// Find current folder id.
	var index = img.indexOf("Sum") + 4;
	var curr = img.substring(index, index+3);
	console.log(curr);
	return curr;
}
function getNext(curr){
	// Calculate next folder id.
	var next_id = parseInt(curr) + 1;
	if(next_id < 10){
		var res = "00" + next_id;
	}
	else if(next_id < 99){
		var res = "0" + next_id;
	}
	else{
		var res = next_id.toString();
	}
	return res;
}
// var currId = getId();
// var nextId = getNext(currId);
var $next = $('#next');

// Set title.
var $trail_num = $('#trail_number');


// console.log(savedFile);

function getImg(){
	var choices = [$('#choice1'), $("#choice2"), $("#choice3"), $("#choice4")];
	// console.log(choices);
	for(var i = 0; i < choices.length; i++){
		if(choices[i].prop("checked", true)){
			// console.log(choices[i].parent().find("img"));
			return choices[i].parent().parent().find("img").attr('src');
		}	
	}
	return "invalid";

}

// var nextFolder;
// var nextDataSet;

function sendReq(currId, nextId){
	return new Promise((resolve, reject) => {
		var savedFile = localStorage.getItem("savedFile");
		var currId = getId();
		var nextId = getNext(currId);
		var imgFile = getImg();
		$.ajax({
			type: 'post',
			url: 'api/quiz',
			data: {
				curr_id: currId,
				next_id: nextId,
				saved_file: savedFile,
				img_src: imgFile
			},
			dataType: 'json',
			success: function(data){
				resolve(data);
			},
			error: function(err){
				reject(err);
			}
		});
	});
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeImg(nextFolder, nextDataSet){
	var next_dir = '/public/ECCV_AMT/' + nextDataSet + '/Sum/' + nextFolder + '/';
	var groudTruth = "GroundTruth_epoch" + nextFolder + "_Real_image.jpg";
	var missing = "RemovalPart_epoch" + nextFolder + "_InCom_img.jpg";
	var shape = "BasicPipeline_Shape_epoch" + nextFolder + "_SynMask_image_colormap.jpg";
	var mulexp = "BasicPipeline_MulExp_epoch" + nextFolder + "_SynMask_image_colormap.jpg";
	var bothloss = "BasicPipeline_BothLoss_epoch" + nextFolder + "_SynMask_image_colormap.jpg";
	var lsgan = "LSGAN_epoch" + nextFolder + "_SynMask_image_colormap.jpg";
	var picks = [shape, mulexp, bothloss, lsgan];
	shuffle(picks)
	document.getElementById("truth").src = next_dir + groudTruth;
	document.getElementById("missing").src = next_dir + missing;
	document.getElementById("method1").src = next_dir + picks[0];
	document.getElementById("method2").src = next_dir + picks[1];
	document.getElementById("method3").src = next_dir + picks[2];
	document.getElementById("method4").src = next_dir + picks[3];
}

$next.on('click', function(){
	sendReq()
	.then(data => {
		$('input[type=checkbox]').prop('checked',false);
		$('input[type=checkbox]').prop('disabled',false);
		var nextFolder = data.nextFolder;
		var nextDataSet = data.dataSet;
		$trail_num.html(nextFolder + '/' + nextDataSet);
		changeImg(nextFolder, nextDataSet);
	})
	.catch(err => {
		console.log(err);
	});
});


// var next = getNext();
// console.log(next);

// function nextImgSet(){
// 	// Get the id for next image folder.
// 	var next = getNext();
// 	var curr_dir = document.getElementById("missing").src;
// 	var index = curr_dir.indexOf("Sum") + 4;
// 	var next_dir = curr_dir.substring(0,index) + next;
// 	if(next >= 500){
// 		console.log("error");
// 	}
// 	else{
// 		var checkbox = ["choice1","choice2","choice3","choice4"]
// 		var groudTruth = "GroundTruth_epoch" + next + "_Real_image.jpg";
// 		var missing = "RemovalPart_epoch" + next + "_InCom_img.jpg";
// 		var shape = "BasicPipeline_Shape_epoch" + next + "_MaskPlusSyn_image.jpg";
// 		var mulexp = "BasicPipeline_MulExp_epoch" + next + "_MaskPlusSyn_image.jpg";
// 		var bothloss = "BasicPipeline_BothLoss_epoch" + next + "_MaskPlusSyn_image.jpg";
// 		var normal = "BasicPipeline_epoch" + next + "_MaskPlusSyn_image.jpg";
// 		document.getElementById("truth").src = next_dir + "/" + groudTruth;
// 		document.getElementById("missing").src = next_dir + "/" + missing;
// 		document.getElementById("shape").src = next_dir + "/" + shape;
// 		document.getElementById("mulexp").src = next_dir + "/" + mulexp;
// 		document.getElementById("bothloss").src = next_dir + "/" + bothloss;
// 		document.getElementById("normal").src = next_dir + "/" + normal;
// 		for(i = 0; i < checkbox.length; i++){
// 			document.getElementById(checkbox[i]).checked = false;
// 		}
// 	}
// }

// function prevImgSet(){

// }