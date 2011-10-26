package com.fbmonopoly.main;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.jdo.PersistenceManager;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class DisconnectServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(ClientServlet.class.getName());
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		ChannelPresence presence = channelService.parsePresence(req);
		
		//Debug Info
		log.info(presence.clientId() + " is disconnected from the channel.");
		
		//Start the persistence manager
	    PersistenceManager pm = PMF.get().getPersistenceManager();
	    
	    //Get all channel client ids available
	    String query = "select from " + ChannelClient.class.getName();
	    List<ChannelClient> ids = (List<ChannelClient>) pm.newQuery(query).execute();
	    
	    //Delete client from channel entity
    	for (ChannelClient c : ids) {
    		if (c.getKey().equals(presence.clientId())) {
    			log.info("deleting stale client: " + c.getKey());
    			pm.deletePersistent(c);
    		}
    	}
    	//Create JSON message
		JSONObject jsonMessage = new JSONObject();
		try {
			jsonMessage.put("method","deleteUser");
			jsonMessage.put("userid",presence.clientId());
		} catch (JSONException e) {
			log.severe("Cannot delete user!");
			e.printStackTrace();			
		}
		//Send JSON message to all clients
		for (ChannelClient n : ids) {
	    	channelService.sendMessage(new ChannelMessage(n.getKey(), jsonMessage.toString()));
	    	log.info("MESSAGE SENT: " + jsonMessage.toString());
		}    

	}
}