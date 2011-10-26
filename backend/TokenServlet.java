package com.fbmonopoly.main;

import java.io.IOException;

import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;


import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

import com.fbmonopoly.main.ChannelClient;
import com.fbmonopoly.main.PMF;

@SuppressWarnings("serial")
public class TokenServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/plain");

    //Get the alias from the URL
    String userid = req.getParameter("userid");
    String username = req.getParameter("username");
     
    //Create channel with token set as "(client ID)-alias"
    ChannelService channelService = ChannelServiceFactory.getChannelService();
    String token = channelService.createChannel(userid);
    
    //Store the token in the database
    persistId(userid, username, userid);
    
    //Send the token to the client
    resp.getWriter().println(token);
  }

  private void persistId(String userId, String username, String token) {
	//Create a new ChannelClient and set the ID, token and Timestamp
    ChannelClient client = new ChannelClient();
    client.setKey(userId);
    client.setToken(token);
    client.setTimestamp(new Date());
    
    //Create a new MonopolyClient and set their initial values
    MonopolyClient mclient = new MonopolyClient();
    
    //Start the persistence manager
    PersistenceManager pm = PMF.get().getPersistenceManager();
    
    //Check to see if ID exists in monopoly client table
    String query = "select from " + MonopolyClient.class.getName();
    List<MonopolyClient> ids = (List<MonopolyClient>) pm.newQuery(query).execute();
    Boolean clientExists = false;

    for (MonopolyClient m : ids) {
    	if (m.getKey().equals(userId)) {
    		//Set mclient default fields
    		clientExists = true;
    		break;
    	}
    }
   
  	//Store this client in the database
    try {
    	//Store channel client
    	pm.makePersistent(client);
    	//If client doesn't exist. Create a new client in MonopolyClient.
    	if (!clientExists) {
    	    mclient.setKey(userId);
    	    mclient.setUserName(username);
    	    mclient.setLocation("1.1");
    	    mclient.setMoney("10000");
    	    mclient.setLand("0");
    	    mclient.setTimestamp(new Date());
    		pm.makePersistent(mclient);
    	}
    } finally {
    	pm.close();
    }
  }
}
