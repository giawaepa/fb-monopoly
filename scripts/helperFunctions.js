/*
 * Javascript Helper Functions
 * Description: ProgressBar, Popups
 */

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
var loadPopup = function(type,msg) {
	
	//Set type of popup
	if (type == "ok") {
		//$("#popup_popup").prepend('<a class="popup_button" id="popup_close" href="#">x</a>');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspOK&nbsp&nbsp</a>');
		$('#popup_header').html("Update");
	} else if (type == "upgrade") {
		$("#popup_popup").append('<a class="popup_button" id="btn_upgrade" href="#">Upgrade</a>&nbsp&nbsp');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspNo&nbsp&nbsp</a>');
		$('#popup_header').html("Upgrade");
	} else if (type == "buy") {
		$("#popup_popup").append('<a class="popup_button" id="btn_buy" href="#">&nbsp&nbspYes&nbsp&nbsp</a>&nbsp&nbsp');
		$("#popup_popup").append('<a class="popup_button" href="#">&nbsp&nbspNo&nbsp&nbsp</a>');
		$('#popup_header').html("Purchase");
	}
	$('#popup_text').html(msg);
	
	//Reset button functions
	$('.popup_button').click(function() {
		disablePopup();
	});
	$('#btn_upgrade').click(function() {
		upgradeland();
	})
	$('#btn_buy').click(function() {
		buyland();
	})
	
	//Popup animations
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