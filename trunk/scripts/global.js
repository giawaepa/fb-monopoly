var chartile = [1,1];
var prevtile = [0,0];

$(document).ready(function() {
	//Initialize global variables
	var xAngle = 0, yAngle = 0;
	var dice = false;
	var mapxpos = 10, mapypos = 10;
	
	//Map
	var map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
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
	$('div#map').gameMap({map:map,object:objectmap,xpos:10,ypos:0,mapsize:20}); 
	
	//Set character container initial position	
	$('#character').css('left','125px').css('top','365px');
	
	// Keep record of char direction
	var direction = 0;
	
	// Keep count of tiles to move
	var number = 0;
	
	// Keep record whether character still moving
	var isMoving = 0;
	var arrArrows = [0,0,0,0];
	
	// Set intersection arrow position
	$('#arrow_down_btn').css('left','-25px').css('top','-30px');
	$('#arrow_right_btn').css('left','45px').css('top','-65px');
	$('#arrow_up_btn').css('left','55px').css('top','-140px');
	$('#arrow_left_btn').css('left','-30px').css('top','-180px');
	
	// Set land selection position
	$('#land_down_btn').css('left','-30px').css('top','-168px');
	$('#land_right_btn').css('left','33px').css('top','-232px');
	$('#land_up_btn').css('left','30px').css('top','-329px');
	$('#land_left_btn').css('left','-32px').css('top','-393px');
	
	// Set intersection button click
	$('#arrow_down_btn').click(function() {
		direction = 3;
		moveChar();
	});
	
	$('#arrow_right_btn').click(function() {
		direction = 2;
		moveChar();
	});
	
	$('#arrow_up_btn').click(function() {
		direction = 1;
		moveChar();
	});
	
	$('#arrow_left_btn').click(function() {
		direction = 4;
		moveChar();
	});
	
	// Character movement and arrow display functions
	var moveChar = function() {
		// Hide arrows when character moving
		$('#arrow_up_btn').css('visibility','hidden');
		$('#arrow_right_btn').css('visibility','hidden');
		$('#arrow_down_btn').css('visibility','hidden');
		$('#arrow_left_btn').css('visibility','hidden');
			
		while( number > 0 )
		{
			// Check Tile
			if ( direction == 0 )
			{
				findDirection();
				if ( direction == 0 )
				{
					// intersection found
					// return and wait for user selection
					return;
				}
			}
			
			moveDirection();
			
			// Update map location
			mapxpos = chartile[0] + 5;
			mapypos = chartile[1] - 5;
			$('div#map').gameMap.moveMap(mapxpos,mapypos);
			
			number--;
		}
	};
	
	var findDirection = function() {
		//Get current tile
		y = chartile[1];
		x = chartile[0];
		
		// Check tile
		var numRoute = [0,0,0,0];
		if ((map[y+1][x] == 0)&&((y+1) != prevtile[1]))
		{
			numRoute[0] = 1;
			direction = 1;
		}
		
		if ((map[y][x+1] == 0)&&((x+1) != prevtile[0]))
		{
			numRoute[1] = 1;
			direction = 2;
		}
		
		if ((map[y-1][x] == 0)&&((y-1) != prevtile[1])) 
		{
			numRoute[2] = 1;
			direction = 3;
		}
		
		if ((map[y][x-1] == 0)&&((x-1) != prevtile[0])) 
		{
			numRoute[3] = 1;
			direction = 4;
		}
		
		if ( (numRoute[0]+numRoute[1]+numRoute[2]+numRoute[3]) > 1 )
		{
			// Intersection detected
			direction = 0;
			
			// Store intersection arrows
			arrArrows[0] = numRoute[0];
			arrArrows[1] = numRoute[1];
			arrArrows[2] = numRoute[2];
			arrArrows[3] = numRoute[3];
			
			// Show arrows
			showArrows();
		}
	};
	
	var showArrows = function() {
		if ( isMoving == 0 )
		{
			if ( arrArrows[0] )
			{
				$('#arrow_up_btn').css('visibility','visible');
			}
			
			if ( arrArrows[1] )
			{
				$('#arrow_right_btn').css('visibility','visible');
			}
			
			if ( arrArrows[2] )
			{
				$('#arrow_down_btn').css('visibility','visible');
			}
			
			if ( arrArrows[3] )
			{
				$('#arrow_left_btn').css('visibility','visible');
			}
			
			arrArrows = [0,0,0,0];
		}
	};
	
	var moveDirection = function() {
		//Get current tile
		y = chartile[1];
		x = chartile[0];
		
		// Update previous tile
		prevtile[0] = x;
		prevtile[1] = y;
		
		// Increment moving count
		isMoving++;
		
		// Debug info
		console.log("x:"+x+" y:"+y);
		//console.log("prev_x:"+prevtile[0]+" prev_y:"+prevtile[1]);
		
		//Save location to DB
		saveLocation(x + '.' + y);
		
		if ( direction == 1 )
		{
			// Up
			chartile[1]++;
			$('#character').animate({
				top: '-=15',
				left: '+=30'
			}, function() {
				// Animation complete.
				isMoving--;
				
				// Show arrows if necessary
				showArrows();
			});
		}
		else if ( direction == 2 )
		{
			// right
			chartile[0]++;
			$('#character').animate({
				top: '+=15',
				left: '+=30'
			}, function() {
				// Animation complete.
				isMoving--;
				
				// Show arrows if necessary
				showArrows();
			});
		}
		else if ( direction == 3 )
		{
			// down
			chartile[1]--;
			$('#character').animate({
				top: '+=15',
				left: '-=30'
			}, function() {
				// Animation complete.
				isMoving--;
				
				// Show arrows if necessary
				showArrows();
			});
		}
		else if ( direction == 4 )
		{
			// left
			chartile[0]--;
			$('#character').animate({
				top: '-=15',
				left: '-=30'
			}, function() {
				// Animation complete.
				isMoving--;				
				
				// Show arrows if necessary
				showArrows();
			});
		}
		
		// Reset direction
		direction = 0;
	};
	
	var moveEndAction = function() {
		// Pay Rent?
		
		// Purchase land
	}
	
	var buyProperty = function() {
		//Get current tile
		y = chartile[1];
		x = chartile[0];
		
		// Check tile
		var numLand = [0,0,0,0];
		if ((map[y+1][x] == 0)&&(objectmap[y+1][x] == 0))
		{
			numLand[0] = 1;
		}
		
		if ((map[y][x+1] == 0)&&(objectmap[y][x+1] == 0))
		{
			numLand[1] = 1;
		}
		
		if ((map[y-1][x] == 0)&&(objectmap[y-1][x] == 0))
		{
			numLand[2] = 1;
		}
		
		if ((map[y][x-1] == 0)&&(objectmap[y][x-1] == 0))
		{
			numLand[3] = 1;
		}		
	}
	
	//Content Container Key events
	$('body').keydown(function(evt) {
		switch(evt.keyCode) {
			case 37: // left				
				mapxpos -= 1;
				mapypos -= 1;
				break;
			case 38: // up				
				mapxpos -= 1;
				mapypos += 1;
				break;
			case 39: // right
				mapxpos += 1;
				mapypos +=1;
				break;
			case 40: // down
				mapxpos += 1;
				mapypos -=1;
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
		// Check to make sure character isn't moving still
		if ( number != 0 )
		{
			return;
		}
		
		//Animation dice up/down animation
		$('#cube').animate({top: '-=50'},100, 
		function() {
			$('#cube').animate({top: '+=50'});
		});
		
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
		
		setTimeout(function() 
		{
			moveChar();
		}, 1000);
	});	
});