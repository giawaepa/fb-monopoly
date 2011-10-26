package com.fbmonopoly.main;

import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class MonopolyClient {
  @PrimaryKey
  @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
  private String userId;

  private String userName, location, money, land;
    
  private Date timestamp;
  
  public String getUserName() {
	return userName;
  }
  public void setUserName(String userName) {
	this.userName = userName;
  }
  public String getLocation() {
	return location;
  }
  public void setLocation(String location) {
	  this.location = location;
  }
  public String getMoney() {
		return money;
  }
  public void setMoney(String money) {
	  this.money = money;
  }
  public String getLand() {
	return land;
  }
  public void setLand(String land) {
	this.land = land;
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
