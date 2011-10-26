/*
 * Google App Engine Channel API JS Client
 * Description: Handles GAE channel connections: getToken, openChannel, onOpen, onMessage, sendMessage
 */

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
    	var left = 0,top = 0;

      	left = 30*(chartile[0] + chartile[1]-2);
    	top = (15*chartile[0])-(15*chartile[1]) + 100;
    	
    	//Position character
    	$('#character').css('left',init_left + left).css('top',init_top + top);
    	
    	//Hide Loading container
    	$("#loading_container").css("display","none");
    	
    } else if (newMessage.method == "updateUsers") {
    	console.log("[STATUS] Updating User List...");
    	var list = "";
    	
    	//Create container for all other characters
    	//$('<div id="character_other" style="position:relative;top:0px;left0px;"></div>').prependTo("#map");
    	
    	for (i=0;i<newMessage.userlist.length;i++) {
    		list += newMessage.userlist[i].name + "<br/>";
    		
    		//If user ID is not current user then add a new character in
    		if ((newMessage.userlist[i].id != user_id)&&($('#char_'+newMessage.userlist[i].id).length == 0)) {
	    		//Parse location
	    	   	end = newMessage.userlist[i].location.indexOf('.');
	        	var userx = parseInt(newMessage.userlist[i].location.substring(0,end));
	        	var usery = parseInt(newMessage.userlist[i].location.substring(end+1));
	    		
	    		//Create character element
	    		var left = 30*(userx + usery-2) + init_left;
	    		var top = (15*userx)-(15*usery) + init_top;
	    		var el = '<div id="char_'+newMessage.userlist[i].id+'" class="char_image" style="top:'+top+'px; left:'+left+'px;"></div>';
	    		//Add character
	    		$(el).appendTo('#character_other');
    		}
    	}
    	console.log("[INFO] List: " + list);
    	$("#userlist").html(list);
    } else if (newMessage.method == "updateOneUser") {
    	console.log("[STATUS] Update Other User location");
    	
		//Parse location
	   	end = newMessage.location.indexOf('.');
    	var userx = parseInt(newMessage.location.substring(0,end));
    	var usery = parseInt(newMessage.location.substring(end+1));
		var left = 30*(userx + usery-2) + init_left;
		var top = (15*userx)-(15*usery) + init_top;
    	
    	//Update User location
    	$('#char_'+newMessage.userid).css("top",top+"px").css("left",left+"px");
    } else if (newMessage.method == "deleteUser") {
    	console.log("[STATUS] Deleting User");
    	//Remove element from DOM
    	$('#char_'+newMessage.userid).remove();
    	
    	//Clear User list
    	$("#userlist").html('');
    	
        //Request for list of online users
    	var xhr = new XMLHttpRequest(); 
        xhr.open('GET', '/client?method=updateUsers', true);
        xhr.send(null); 
    	
    } else if (newMessage.method == "chatMessage") {   	
    	if (newMessage.userid != user_id) {
        	console.log("[STATUS] Update User Message");
	    	//Add new chat bubble
        	console.log(newMessage.userid + " said: " + newMessage.message);
        	
        	//Add bubble if it's not there. Otherwise change the message.
        	if ($('#bubble_'+newMessage.userid).length == 0) {
        		$('#char_'+newMessage.userid).prepend('<div id="bubble_'+newMessage.userid+'" class="bubble">'+newMessage.message+'</div>');
        	} else {
        		$('#bubble_'+newMessage.userid).html('');
        		$('#bubble_'+newMessage.userid).html(newMessage.message);
        	}
	    	
			$('#bubble_'+newMessage.userid).animate({
			    opacity: 1,
			    top: '-=10'
			  }, 100, function() {
				  setTimeout(function() {
					  $('#bubble_'+newMessage.userid).animate({
						    opacity: 0
					  }, 100);
					  $('#bubble_'+newMessage.userid).remove();
				  },5000);
			  });
    	}
    } else {
    	console.log("[STATUS] Method not handled.");
    }
};

function sendMessage() {
	//Get the message
	message = $('#message_box').val();
	
	//Add bubble if it's not there. Otherwise change the message.
	if ($('#bubble_'+user_id).length == 0) {
		$('#character').prepend('<div id="bubble_'+user_id+'" class="bubble">'+message+'</div>');

		$('#bubble_'+user_id).animate({
		    opacity: 1,
		    top: '-=10'
		  }, 100, function() {
			  setTimeout(function() {
				  $('#bubble_'+user_id).animate({
					    opacity: 0
				  }, 100);
				  $('#bubble_'+user_id).remove();
			  },5000);
		  });
	} else {
		$('#bubble_'+user_id).html('');
		$('#bubble_'+user_id).html(newMessage.message);
	}

	//Clear the message box
	$('#message_box').val('');
	
    //Send message to clients
	var xhr = new XMLHttpRequest(); 
    xhr.open('GET', '/client?method=sendMsg&userid='+user_id+'&chatMessage='+message, true);
    xhr.send(null);
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