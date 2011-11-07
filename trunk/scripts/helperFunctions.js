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