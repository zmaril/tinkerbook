var emailRules = {"email": {required: true, email: true}};
var emailMessages = {"email": "Please enter a valid email address"};

function postContactToGoogle(){
    var email = $('#email').val();
    $.ajax({
        url: "https://spreadsheets.google.com/formResponse",
        data: {"entry.0.single" : email,
               formkey: "dDhjREJ2enpYLTdydHg4bkV2MTBQOHc6MQ"},
        type: "POST",
        dataType: "xml",
        statusCode: {
            0: function (){
                $('#email').val("");
		
                alert('1111'); //Success message
		
            },
            200: function (){
		$('#email').val("");
		   
                alert('2222'); //Success Message
		    
            }
        }
    });
}

$(document).ready(function(){

    $("#invite").validate({
	rules: emailRules,
	messages: emailMessages,
               
    });

    $('#invite').submit(function(e){
	e.preventDefault(); // prevents form submission
	alert('hi');
	postContactToGoogle();
    });




});


    

