/*
 * Google App Engine Channel API JS Client
 * Description: Handles GAE channel connections: getToken, openChannel, onOpen, onMessage, sendMessage
 */

//Global variables


//Initialization - Get token and open channel
function initialize() {
	var token = getToken();
	if ( token != null  && token != 'error') {
		//strip newline from returned token
		cleantoken =  token.replace("\n", "", "g");
		openChannel(cleantoken);  
	} else {
		alert('[STATUS] Error fetching token');
	}
};
//Request a token from the server
function getToken(){
	$("#loading_container").html("");
	$("#loading_container").html("Connecting to Game Channel...");
	var xhr = new XMLHttpRequest(); 
	var url = '/getToken?userid='+user_id+'&username='+encodeURIComponent(user_name);
	console.log("[STATUS] Requesting token...");
	xhr.open('GET', url, false);
	xhr.send(null);        
	if (xhr.status == 200) {
		return(xhr.responseText);
	}     
};
//Open the channel with a given token from the server
function openChannel(token){
	var channel = new goog.appengine.Channel(token);
	var handler = {
		'onopen': onOpened,
		'onmessage': onMessage,
		'onerror': function() {},
		'onclose': function() {}
	};
	var socket = channel.open(handler);
};
//Handle events after channel is opened
function onOpened() {
	console.log("[STATUS] Channel established.");
	$("#loading_container").html("");
	$("#loading_container").html("Game Channel connected...");
	//Hide Loading container
	$("#loading_container").css("display","none");
	
	//Request for current location of user
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=getUserLocation&userid='+user_id, true);
    xhr.send(null);  
    
    //Request for list of online users
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=updateUsers', true);
    xhr.send(null);     
};
//Handle events when messages are received on the channel
function onMessage(m) {
    newMessage = JSON.parse(m.data);
    //console.log("[STATUS] Received new message...");
    if (newMessage.method == "updateUserLocation") {
    	//Debug info
    	console.log("[STATUS] Updating User location...");
    	console.log("[INFO] Location: " + newMessage.location);
    	
    	//Parse Location
    	end = newMessage.location.indexOf('.');
    	chartile[0] = parseInt(newMessage.location.substring(0,end));
    	chartile[1] = parseInt(newMessage.location.substring(end+1));
    	prevtile[0] = chartile[0];
		prevtile[1] = chartile[1];
    	
    	//Map character tile to location on page
    	var init_top = 400;
    	var init_left = 125; 
    	var left = 0,top = 0;
    	for (i=0;i<chartile[0]-1;i++) {
    		left+=30;
    		top+=15;
    	}
    	for (j=0;j<chartile[1]-1;j++) {
    		left+=30;
    		top-=15;
    	}
    	
    	//Position character
    	$('#character').css('left',init_left + left).css('top',init_top + top);
    } else if (newMessage.method == "updateUsers") {
    	console.log("[STATUS] Updating User List...");
    	list = "";
    	//location = newMessage.userlocations;
    	for (i=0;i<newMessage.userlist.length;i++) {
    		list += newMessage.userlist[i].name + "<br/>";
    	}
    	console.log("[INFO] List: " + list);
    	$("#userlist").html(list);
    } else {
    	console.log("[STATUS] Method not handled.");
    }
};

function saveLocation(location) {
    //Request to be removed from channel
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=save&userid='+user_id+'&location='+location, true);
    xhr.send(null);
};

function leaveChannel() {
    //Request to be removed from channel
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=leave&userid='+user_id, true);
    xhr.send(null);
};