/*
 * FB JS Client
 * Description: Handles all FB variables and events
 */

//Global Variables
var app_id = 127119890725609;
var app_domain = 'http://fb-monopoly.appspot.com';
var access_token;
var user_id;
var user_name;

//FB initialization
FB.init({ 
    appId:app_id, 
    cookie:true,
    domain: app_domain,
    status:true, 
    xfbml:true,
    channelURL: app_domain + '/channel.html',
    oauth: true
});         

//Checks login state on page load
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
		console.log('[STATUS] Welcome!  Fetching your information.... ');
		access_token = response.authResponse.accessToken;
		user_id = response.authResponse.userID;
	  	console.log('[INFO] access_token = ' + access_token);
	  	console.log('[INFO] user_id = ' + user_id);
	  	displayGeneralInfo();
	}
});

//Subscribe login, logout handlers
FB.Event.subscribe('auth.logout', function(response) {
	$("div#content_container").css('display','none');
	//Leave the channel
	leaveChannel();
	window.location.reload();
});
FB.Event.subscribe('auth.login', function(response) {
	console.log('[STATUS] Welcome!  Fetching your information.... ');
	access_token = response.authResponse.accessToken;
	user_id = response.authResponse.userID;
  	console.log('access_token = ' + access_token);
  	console.log('user_id = ' + user_id);
  	displayGeneralInfo();
});

//Displays Profile information on page
function displayGeneralInfo() {
	//Display content container
	$("div#content_container").css('display','block');
	
    FB.api('/me', function(response) {
	       console.log('[STATUS] Good to see you, ' + response.name + '.');
	       user_name = response.name;
	       $("#img_profile").append('<img src="https://graph.facebook.com/' + response.id + '/picture" />');
	       $("#txt_profile").append('Name: ' + response.name + '<br/>'+'Gender: ' + response.gender + '<br/>');
	       
	       //Connect to channel
	       initialize();
    });    
};