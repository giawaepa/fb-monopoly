package com.fbmonopoly.main;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class MapClient {
  @PrimaryKey
  @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
  private String location;

  private String userid,type;
  
  public String getUserid() {
    return userid;
  }
  public void setUserid(String userid) {
    this.userid = userid;
  }
  public String getType() {
	    return type;
	  }
  public void setType(String type) {
    this.type = type;
  }
  public String getKey() {
    return location;
  }
  public void setKey(String location) {
    this.location = location;
  }
}
