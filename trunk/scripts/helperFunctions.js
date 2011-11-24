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
var loadPopup = function(type) {
	if (type == "ok") {
		//$("#popup_popup").prepend('<a class="popup_button" id="popup_close" href="#">x</a>');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspOK&nbsp&nbsp</a>');
	} else if (type == "upgrade") {
		$("#popup_popup").append('<a class="popup_button" href="#">Upgrade</a>&nbsp&nbsp');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspNo&nbsp&nbsp</a>');
	} else if (type == "buy") {
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspYes&nbsp&nbsp</a>&nbsp&nbsp');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspNo&nbsp&nbsp</a>');
	}
	//Reset button functions
	$('.popup_button').click(function() {
		disablePopup();
	});
	
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
	$(".popup_button").remove();
	if (popupStatus == 1) {
		$("#popup_container").animate({
			opacity: 0
		});
		$("#popup_container").css("display","none");
		popupStatus = 0; 
	}
};