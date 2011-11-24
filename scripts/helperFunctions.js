//Progress bar functions
var updateProgressBar = function(percentage) {
	var currentwidth = $('#pageProgressBar_img').width();
	var width = percentage*2;
	var addwidth = 0;
	if (currentwidth < width) {
		addwidth = width - currentwidth;
	
		$('#pageProgressBar_img').animate({
			width: '+='+addwidth
		}, function() {
		   	//Hide Loading container
			if ($('#pageProgressBar_img').width() > 195) {
				$("#loading_container").css("display","none");
			}
		});
	}
};

//Popup functions
var loadPopup = function() {
	if (popupStatus == 0) {
		$("#popup_container").css("display","block");
		$("#popup_container").animate({
			opacity: 1
		});
		popupStatus = 1; 
	} else {
		$("#popup_container").animate({
			opacity: 0
		});
		$("#popup_container").css("display","none");
		popupStatus = 0;
		setTimeout("loadPopup();",1000);
	}
};
var disablePopup = function() {
	if (popupStatus == 1) {
		$("#popup_container").animate({
			opacity: 0
		});
		$("#popup_container").css("display","none");
		popupStatus = 0; 
	}
};