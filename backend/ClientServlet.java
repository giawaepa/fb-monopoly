package com.fbmonopoly.main;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;

import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskAlreadyExistsException;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

import com.fbmonopoly.main.PMF;

@SuppressWarnings("serial")
public class ClientServlet extends HttpServlet {
  
  private static final Logger log = Logger.getLogger(ClientServlet.class.getName());
  public static final long DELAY = 3000;
  
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/plain");
  
    //Start Persistence manager and channel service
    PersistenceManager pm = PMF.get().getPersistenceManager();
    ChannelService channelService = ChannelServiceFactory.getChannelService();
    
    // Get all channel client ids available
    String query = "select from " + ChannelClient.class.getName();
    List<ChannelClient> ids = (List<ChannelClient>) pm.newQuery(query).execute();

    //Get all monopoly client ids available
    query = "select from " + MonopolyClient.class.getName();
    List<MonopolyClient> mids = (List<MonopolyClient>) pm.newQuery(query).execute();

    //Check what type of request it is
    String method = req.getParameter("method");
    log.info("METHOD = " + method);
    
    //MonopolyClient loop
	if (method.equals("getUserLocation")) {	 
		String userId = req.getParameter("userid");
		for (MonopolyClient mclient : mids) {
    		if (mclient.getKey().equals(userId)) {
    			JSONObject jsonMessage = new JSONObject();
    			try {
    				jsonMessage.put("method", "updateUserLocation");
    				jsonMessage.put("location", mclient.getLocation());
    				channelService.sendMessage(new ChannelMessage(userId, jsonMessage.toString()));
    				log.info("MESSAGE SENT: " + jsonMessage.toString());
    			} catch (JSONException e) {
    				log.severe("Cannot update user location!");
    				e.printStackTrace();
    			}
    		}
		}
	} else if (method.equals("save")) {
		String userId = req.getParameter("userid");
		String location = req.getParameter("location");
	
		//Find client in db and save the new location
		for (MonopolyClient mclient : mids) {
    		if (mclient.getKey().equals(userId)) {
    			mclient.setLocation(location);
    			pm.makePersistent(mclient);
    		}
		}
		
		//Create JSON message
		JSONObject jsonMessage = new JSONObject();
		try {
			jsonMessage.put("method","updateOneUser");
			jsonMessage.put("userid",userId);
			jsonMessage.put("location",location);
		} catch (JSONException e) {
			log.severe("Cannot update user location!");
			e.printStackTrace();			
		}
		//Send JSON message to all clients
		for (ChannelClient n : ids) {
	    	channelService.sendMessage(new ChannelMessage(n.getKey(), jsonMessage.toString()));
	    	log.info("MESSAGE SENT: " + jsonMessage.toString());
		}
	} else if (method.equals("updateUsers")) {	    
    	String listOfClients = "";
    	
		JSONObject jsonMessage = new JSONObject();
		JSONArray userarray = new JSONArray();
		try {
			//Construct json message
    		for (ChannelClient n : ids) {
					  //Get username and locations
					  String location = "";
					  String name = "";
					  for (MonopolyClient mclient : mids) {
						  if (mclient.getKey().equals(n.getKey())) {
							  name = mclient.getUserName();
							  location = mclient.getLocation();
						  }
					  }
					  JSONObject user = new JSONObject();
					  user.put("id", n.getKey());
					  user.put("name", name);
					  user.put("location",location);
					  userarray.put(user);
    		}
    		jsonMessage.put("userlist", userarray);
    		jsonMessage.put("method", "updateUsers");
		} catch (JSONException e) {
			log.severe("Cannot update user list!");
			e.printStackTrace();
		}
	    for (ChannelClient m : ids) {
	    	channelService.sendMessage(new ChannelMessage(m.getKey(), jsonMessage.toString()));
	    	log.info("MESSAGE SENT: " + jsonMessage.toString());
	    }
    } else if (method.equals("sendMsg")) {
    	String userid = req.getParameter("userid");
    	String message = req.getParameter("chatMessage");

    	//Create JSON message
		JSONObject jsonMessage = new JSONObject();
		try {
			jsonMessage.put("method","chatMessage");
			jsonMessage.put("userid",userid);
			jsonMessage.put("message",message);
		} catch (JSONException e) {
			log.severe("Cannot send message!");
			e.printStackTrace();			
		}
    	for (ChannelClient m : ids) {
	    	channelService.sendMessage(new ChannelMessage(m.getKey(), jsonMessage.toString()));
	    	log.info("MESSAGE SENT: " + jsonMessage.toString());
    	}
    } else if (method.equals("leave")) {
    	String userid = req.getParameter("userid");
    	//Delete user from channel
    	for (ChannelClient c : ids) {
    		if (c.getKey().equals(userid)) {
    			log.info("deleting stale client: " + c.getKey());
    			pm.deletePersistent(c);
    		}
    	}
    	//Create JSON message
		JSONObject jsonMessage = new JSONObject();
		try {
			jsonMessage.put("method","deleteUser");
			jsonMessage.put("userid",userid);
		} catch (JSONException e) {
			log.severe("Cannot delete user!");
			e.printStackTrace();			
		}
		//Send JSON message to all clients
		for (ChannelClient n : ids) {
	    	channelService.sendMessage(new ChannelMessage(n.getKey(), jsonMessage.toString()));
	    	log.info("MESSAGE SENT: " + jsonMessage.toString());
		}    	
    } else {
    	//If no method to handle. Do nothing.
    }
	
	//Close persistence manager
    pm.close();
  }  
}
