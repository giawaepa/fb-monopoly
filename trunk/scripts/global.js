var chartile = [1,1];

$(document).ready(function() {
	//Instantialize global variables
	var xAngle = 0, yAngle = 0;
	var dice = false;
	var mapxpos = 10, mapypos = 10;
	
	//Map
	var map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	//Object Map
	var objectmap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,3,3,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,3,3,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
	
	//Generate the map
	$('div#map').gameMap({map:map,object:objectmap,xpos:0,ypos:0,mapsize:20}); 
	
	//Set character initial position
	$('#character').css('left','124px').css('top','365px');
	//var chartile = [1,1]; 
	var prevtile = [1,1];
	
	var moveChar = function() {
		//Get current tile
		y = chartile[1];
		x = chartile[0];
		console.log("x:"+x+" y:"+y);
		console.log("prev_x:"+prevtile[0]+" prev_y:"+prevtile[1]);
		
		//Check surrounding tile
		if ((map[y+1][x] == 0)&&((y+1) != prevtile[1])) {
			chartile[1]++;
			prevtile[0] = x;
			prevtile[1] = y;
			$('#character').animate({
				top: '-=15',
				left: '+=30'
			})
		} else if ((map[y][x+1] == 0)&&((x+1) != prevtile[0])) {
			chartile[0]++;
			prevtile[0] = x;
			prevtile[1] = y;
			$('#character').animate({
				top: '+=15',
				left: '+=30'
			})			
		} else if ((map[y-1][x] == 0)&&((y-1) != prevtile[1])) {
			chartile[1]--;
			prevtile[0] = x;
			prevtile[1] = y;
			$('#character').animate({
				top: '+=15',
				left: '-=30'
			})			
		} else if ((map[y][x-1] == 0)&&((x-1) != prevtile[0])) {
			chartile[0]--;
			prevtile[0] = x;
			prevtile[1] = y;
			$('#character').animate({
				top: '-=15',
				left: '-=30'
			})			
		}
		
	};
	
	//Content Container Key events
	$('body').keydown(function(evt) {
		switch(evt.keyCode) {
			case 37: // left
				mapxpos -= 1;
				break;
			case 38: // up
				mapypos += 1;				
				break;
			case 39: // right
				mapxpos += 1;
				break;
			case 40: // down
				mapypos -= 1;
				break;
		};
		$('div#map').gameMap.moveMap(mapxpos,mapypos);
	});
	
	//Profile Container events
	$('#profile_container').mouseenter(function() {
		$(this).animate({opacity: 1}, 100);
	}).mouseleave(function() {
		$(this).animate({opacity: 0.8}, 100);
	});
	
	//Dice events
	$('#cube_btn').mouseenter(function() {
		$('#bubble_dice').animate({
		    opacity: 1,
		    left: '-=10'
		  }, 100);
		$('#diceview').animate({opacity: 1});
	}).mouseleave(function() {
		$('#bubble_dice').animate({
		    opacity: 0,
		    left: '+=10'
		  }, 100);
		$('#diceview').animate({opacity: 0.8});
	});
		
	$('#cube_btn').click(function() {
		//Animation dice up/down animation
		$('#cube').animate({top: '-=50'},100, 
		function() {
			$('#cube').animate({top: '+=50'});
		})
		
		//LEFT   yAngle -= 90
		//RIGHT  yAngle += 90
		//UP     xAngle += 90
		//DOWN   xAngle -= 90
		//Setting rotation animation value
		if (!dice) {
			yAngle = 360;
			xAngle = 360;
			dice = true;
		} else {
			yAngle = 0;
			xAngle = 0;
			dice = false;
		}
		//Randomize a number to display
		number = Math.round(Math.random()*5)+1;
		//number = 2;
		if (number == 2) {
			//Do nothing because original position is 2
		} else if (number == 3) {
			yAngle -= 90;
		} else if (number == 4) {
			xAngle += 180;
		} else if (number == 5) {
			yAngle += 90;
		} else if (number == 6) {
			xAngle += 90;
		} else if (number == 1) {
			xAngle -= 90;	
		}
		//Perform the rotate animation
		$('#cube')[0].style.webkitTransform = "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)";
		$('#console').html("");
		$('#console').html("Move " + number + " spaces.");
		for (i=0;i<number;i++) {
			setTimeout(function() {
				moveChar();
				mapxpos = chartile[0];
				mapypos = chartile[1];
				$('div#map').gameMap.moveMap(mapxpos,mapypos);
			},1000);
		}
	});	
});