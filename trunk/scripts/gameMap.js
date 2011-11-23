/*!
 * jQuery Isometric Map Plugin
 * http://www.cw-internetdienste.de/
 *
 * Version 0.1
 *
 * Copyright 2010, Christian Weber
 * Free for commercial and
 * non-commercial use. Please shoot
 * me an email if you use it. Would love
 * to see it in action. :)
 *
 * Date: Wed May 5 17:12:43 2010 +0100
 */
 
 // enables the $ function even if its disabled because of jQuery compatibility mode
(function($) {
    // create gameMap namespace / main function
    // so it can be used using $(element).gameMap();
    $.fn.gameMap = function(options) {
    
        // public property access
        // those set the base values 
        $.fn.gameMap.defaults = {
            xpos : 50,
            ypos : 50,
            mapsize:100,
            tilesize:64,
            xcorrection:30,
            ycorrection:15,
            bgcolor:'white',
            map : {},
			object: {}
        };
    
        // create the configuration file
        // this merges the defaults properties with the given options
        // the bool value at the beginning lets the function check recursively
        var config = $.extend(true,$.fn.gameMap.defaults,options);
        
        // get the elements height and width
        // self explaining
        var wWidth = $(this).width();
        var wHeight = $(this).height();
        
        // sets the baseline for rendering of the isometric tiles
        // as they go diagonal, we have to begin in the middle
        var half = (config.mapsize*(config.tilesize/2))/2;
        
        // just to be on the secure size we overload the variable to a local one
        // so we have access to it for every instance and not globally
        var obj = $(this);
        
        // reset the tile z index
        //var tileindex = config.mapsize*config.mapsize;
        //var objectindex = config.mapsize*config.mapsize*2;
        
        // create base function
        // this is the constructor function that gets 
        // called at the end of this plugin
        $.fn.gameMap.init_game_interface = function() {     
            
            // set the first game map properties
            // fill the background with a base color
            // isometric maps wont be filling at the corners
            obj.css('background-color',config.bgcolor);
            
            // check if the content container is existing
            // if not add it to the given div. this is needed
            // for easy displaying of the correct part of the map
            // if it is bigger than the elements size
            if(obj.children('div.content').length == 0) { obj.append('<div class="content"></div>'); }
            
            // paint the map
            // initialize the map rendering
            obj.gameMap.initMap();
        }
        
        // map rendering function
        $.fn.gameMap.initMap = function() {
            // set the size of the content element so nothing gets lost :)
            // the height gets only multiplicated with half of the tiles size
            // as they are positioned differently and only half of the tiles size
            // matters. else we would have free space between the tiles 
            obj.children('div.content').css('width',(config.mapsize*config.tilesize*1.2)+'px').css('height',(config.map[0].length*(config.tilesize))+'px');
                       
            // create the isomap
            // loops through the whole map data array
            // no matter where it starts
            for(var y in config.map) {
                for(var x in config.map[y]) {
                    // call the intern function to create a new tile
                    // can also be used to add new tiles after the 
                    // plugin got initialized
                    obj.gameMap.addTile(config.map[y][x],x,y);
                }
            }
            // move to the starting position
            // this will center on the given coordinates
            obj.gameMap.moveMap(config.xpos,config.ypos);
        }
        
        // tile adding function
        $.fn.gameMap.addTile = function(tile,x,y) {
            // calculate x and y position of the tile
            // sometimes the images have not totally correct dimensions like in our case
            // so we have to use x and y corrections to position everything correctly
            // for the xposition of the tile we just have to sum the x and y position 
            // as for example 1,0 and 0,1 will have the same x-position
            var xpos = config.tilesize+((x*config.xcorrection)+((y)*config.xcorrection));
            
            // the y position is a bit more complicated. we have to remember that sometimes 
            // it has to go up and sometimes down from the baseline, we calculated at the 
            // beginning. so we just subtract the calculation of the y value minus the x value
            // if a positive value will be subtracted from the baseline it will be an addition
            // as + and - results in - so the tile will be higher than the baseline.
            // on a negative value - - it will result in a positive value so the position of 
            // the tile will be lower than the baseline
            var ypos = half-(((y)*config.ycorrection)-(x*config.ycorrection));
            
            // check if this is the starting position and mark it
            // this was just for testing purposes so we can see
            // the given starting position visually 
            var hilight = '';
            if(x==config.xpos && y == config.ypos) { hilight = 'border:0px solid #990000;'; }
            
            // create element
            // we create a div element with the correct tile class and the calculated x and y 
            // positions as top and left values of the inline css
            // this also calculated the correct z-index as bottom left elements will always
            // need a higher priority than the tiles behind them. 
			
            //Set image classes
            tilegraphic = "";
			objectgraphic = "";
			if (config.map[y][x] == 0) {
				tilegraphic = "ground_0";
			} else if (config.map[y][x] == 1) {
				tilegraphic = "grass_0";
			} else if (config.map[y][x] == 2) {
				tilegraphic = "ground_user";
			}
			
			if (config.object[y][x] == 1) {
				objectgraphic = "tree_1";
			} else if (config.object[y][x] == 2) {
				objectgraphic = "tree_2";
			} else if (config.object[y][x] == 3) {
				objectgraphic = "house_1";
			} else if (config.object[y][x] == 4) {
				objectgraphic = "fountain_1";
			} else if (config.object[y][x] == 5) {
				objectgraphic = "cityhall_1";
			} else if (config.object[y][x] == 6) {
				objectgraphic = "cityhall_2";
			}
			//Update index
			//tileindex--;
			//objectindex--;
			tileindex = (config.mapsize-y)+x;
			objectindex = ((config.mapsize-y)+x)+config.mapsize;
            var el = '<div id="'+obj.attr('id')+'_tile_'+x+'_'+y+'"class="tile '+tilegraphic+'" style="'+hilight+'top:'+ypos+'px;left:'+xpos+'px;z-index:'+tileindex+';"><div class="object '+objectgraphic+'" style="z-index:'+objectindex+';"></div></div>';
            
            // add to content element
            // just adds the element to the content element
            $(el).appendTo(obj.children('div.content'));
            
            // attach information event
            // this was also added for testing purposes but might be useful
            obj.gameMap.tileInfo($('div#'+obj.attr('id')+'_tile_'+x+'_'+y),x,y);
        }
        
        // the information event i created for testing purposes
        $.fn.gameMap.tileInfo = function(tile,x,y) {
            // on mouse over it shows some details of the tile including its position 
            // and the top and left values
            tile.mouseover(function() {
                $('section#interface p').html(typeof(tile)+' ('+tile.attr('id')+') on '+x+','+y+' Pos: '+tile.css('left')+'px, '+tile.css('top')+'px');
            });
        }
        
        // this function centers the map on a given position
        $.fn.gameMap.moveMap = function(x,y) {
            // set the correct position of the object
            // the calculations are the same as the ones of each tile
            // except that we subtract the half of the elements height
            // and width to have the coordinate at the middle
            obj.scrollLeft((config.tilesize+((x*config.xcorrection)+((y)*config.xcorrection)))-(wWidth/2)).scrollTop((half-(((y)*config.ycorrection)-(x*config.ycorrection)))-(wHeight/2));
        }
        
		// this function returns the x position for given tile position
		$.fn.gameMap.getTileX = function(x,y) {
			var xpos = config.tilesize+((x*config.xcorrection)+((y)*config.xcorrection));
			return xpos;
		}

		// this function returns the y position for given tile position
		$.fn.gameMap.getTileY = function(x,y) {
			var ypos = half-(((y)*config.ycorrection)-(x*config.ycorrection));
			return ypos;
		}
		
        // call the constructor function
        $.fn.gameMap.init_game_interface();
        // return the jQuery object as every jQuery function does
        // enables something like this $(element).gameMap().css('border','5px solid #990000');
        return obj;
    };
    
    
})(jQuery);