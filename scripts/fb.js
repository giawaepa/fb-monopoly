//Global Variables
var app_id = 127119890725609;
var app_domain = 'http://fb-monopoly.appspot.com';
var access_token;
var user_id;

FB.init({ 
    appId:app_id, 
    cookie:true,
    domain: app_domain,
    status:true, 
    xfbml:true,
    channelURL: app_domain + '/channel.html',
    oauth: true
});         

FB.getLoginStatus(function(response) {
	if (response.status == "not_authorized") {
	  	FB.ui({
	  	    client_id: app_id,
	  	    method: 'oauth',
	  	    scope: 'user_photos',
	  	    redirect_uri: app_domain + '/callback.html',
	  	    response_type: 'token'
	  	});
	} else if (response.status == "unknown") {
	} else if (response.status == "connected") {
		console.log('Welcome!  Fetching your information.... ');
		access_token = response.authResponse.accessToken;
		user_id = response.authResponse.userID;
	  	console.log('access_token = ' + access_token);
	  	console.log('user_id = ' + user_id);
	  	displayGeneralInfo();
	}
});
FB.Event.subscribe('auth.logout', function(response) {
	$("div#content_container").css('display','none');
	window.location.reload();
});
FB.Event.subscribe('auth.login', function(response) {
	console.log('Welcome!  Fetching your information.... ');
	access_token = response.authResponse.accessToken;
	user_id = response.authResponse.userID;
  	console.log('access_token = ' + access_token);
  	console.log('user_id = ' + user_id);
  	displayGeneralInfo();
});

function getUserStatus() {
	FB.getLoginStatus(function(response) {
		if (response.authResponse) {
			alert("User is logged in.");
		} else {
			alert("User is not logged in.");
		}
	});
};
function displayGeneralInfo() {
	//Display content container
	$("div#content_container").css('display','block');
	
    FB.api('/me', function(response) {
	       console.log('Good to see you, ' + response.name + '.');
	       //$("#container").html('');
	       $("#img_profile").append('<img src="https://graph.facebook.com/' + response.id + '/picture" />');
	       $("#txt_profile").append('Name: ' + response.name + '<br/>'+'Gender: ' + response.gender + '<br/>');
    });        
};