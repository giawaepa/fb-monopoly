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
    	console.log("[STATUS] Updating User location...");
    	console.log("[INFO] Location: " + newMessage.location);
    	end = newMessage.location.indexOf('.');
    	chartile[0] = newMessage.location.substring(0,end);
    	chartile[1] = newMessage.location.substring(end+1);
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

function leaveChannel() {
    //Request to be removed from channel
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=leave&userid='+user_id, true);
    xhr.send(null);
};