function getName() {return document.getElementById('name').value}
function getAge() {return document.getElementById('age').value}
function getGender() {
    if(document.getElementById('male').checked == true){
        return 'male';
    }
    else if(document.getElementById('female').checked == true){
        return 'female';
    }
    else if(document.getElementById('other').checked == true){
        return 'other';
    }
    return 'invalid';
}

var $submit = $('#submit');

function sendReq(){
	return new Promise((resolve, reject) => {
		var name = getName();
        var age = getAge();
        var gender = getGender();
		$.ajax({
			type: 'post',
			url: 'api/main',
			data: {
				name: name,
                age: age,
                gender: gender
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


$submit.on('click', function(){
    sendReq()
	.then(data => {
		localStorage.setItem("savedFile", data.filename);
	})
	.catch(err => {
		console.log(err);
	});
});