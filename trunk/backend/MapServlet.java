package com.fbmonopoly.main;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

import com.fbmonopoly.main.PMF;

@SuppressWarnings("serial")
public class MapServlet extends HttpServlet {
  
  private static final Logger log = Logger.getLogger(ClientServlet.class.getName());
  public static final long DELAY = 3000;
  
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/plain");

  	//Start Persistence manager and channel service
    PersistenceManager pm = PMF.get().getPersistenceManager();
    ChannelService channelService = ChannelServiceFactory.getChannelService();
    
    // Get all channel client ids available
    String query = "select from " + MapClient.class.getName();
    List<MapClient> locations = (List<MapClient>) pm.newQuery(query).execute();
    
    //Check what type of request it is
    String method = req.getParameter("method");
    log.info("METHOD = " + method);
    
    if (method.equals("getPurchased")) {	 
    	String userId = req.getParameter("userid");
		JSONObject jsonMessage = new JSONObject();
		JSONArray maparray = new JSONArray();
		try {
			//Construct json message
    		for (MapClient n : locations) {
					  JSONObject item = new JSONObject();
					  item.put("location", n.getKey());
					  item.put("userid", n.getUserid());
					  item.put("type",n.getType());
					  maparray.put(item);
    		}
    		jsonMessage.put("maplist", maparray);
    		jsonMessage.put("method", "getPurchased");
    		
			channelService.sendMessage(new ChannelMessage(userId, jsonMessage.toString()));
			log.info("MESSAGE SENT: " + jsonMessage.toString());
		} catch (JSONException e) {
			log.severe("Cannot update map!");
			e.printStackTrace();
		}
    } else if (method.equals("updatePurchased")) {
    	String userid = req.getParameter("userid");
    	String location = req.getParameter("location");
    	String type = req.getParameter("type");
    	
    	//Check if item already exist and update item
    	Boolean itemExist = false;
    	for (MapClient n : locations) {
    		if (n.getKey().equals(location)) {
    			itemExist = true;
    			n.setUserid(userid);
    			n.setType(type);
    		}
    	}
    	
    	//Create new item if it doesn't already exist
    	if (!itemExist) {
    		MapClient mclient = new MapClient();
			mclient.setKey(location);
    		mclient.setUserid(userid);
			mclient.setType(type);
			pm.makePersistent(mclient);
    	}
    	
    	//Update channel users
    	JSONObject jsonMessage = new JSONObject();
    	try {
    		jsonMessage.put("location", location);
    		jsonMessage.put("userid", userid);
    		jsonMessage.put("type", type);
    		jsonMessage.put("method", "updatePurchased");
    		
    		//Get Channel IDs
    	    query = "select from " + ChannelClient.class.getName();
    	    List<ChannelClient> ids = (List<ChannelClient>) pm.newQuery(query).execute();
    	    
    		for (ChannelClient n : ids) {
	    		//Send message
	    		channelService.sendMessage(new ChannelMessage(n.getKey(), jsonMessage.toString()));
	    		log.info("MESSAGE SENT: " + jsonMessage.toString());
    		}
    	} catch (JSONException e) {
			log.severe("Cannot create JSON message for updatePurchased!");
			e.printStackTrace();
		}
    }
    
  }
}