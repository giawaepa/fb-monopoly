package com.fbmonopoly.main;

import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class ChannelClient {
  @PrimaryKey
  @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
  private String userId;

  private String token;
  
  private Date timestamp;
  
  public String getToken() {
    return token;
  }
  public void setToken(String token) {
    this.token = token;
  }
  public void setTimestamp(Date timestamp) {
    this.timestamp = timestamp;
  }
  public Date getTimestamp() {
    return timestamp;
  }
  public String getKey() {
    return userId;
  }
  public void setKey(String userId) {
    this.userId = userId;
  }
}
