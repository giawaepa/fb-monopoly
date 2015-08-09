# Facebook Monopoly Game #
This is a personal project.

## Description: ##
  * Social Game on Facebook
  * Starting with city of Toronto
    * Simulate major streets and buildings
  * Users can roll dice every 15 seconds
  * Users can purchase land, build houses, upgrade houses, invest in buildings
  * Users can re-purchase land:
    * Land on the same land 3 times and offer a price higher than original price
  * Users will pay rent when landed on other's property
  * There will be cards/items:
    * Road block, bomb, fairy
    * Chance cards, steal cards, etc.
  * Leadership board - ranking among friends, city

## Technologies used: ##
  * Facebook Javascript SDK
  * Google App Engine (Java)
  * JQuery
  * JQuery Isometric plugin
  * MelonJS/jgenJS/CraftyJS - Not used anymore
  * NodeJS/Nodester/Express/Mongoose - Future

## Signin/Registration Flow: ##
  1. Log into Facebook
  1. Get Facebook username/ID
  1. Request for Token
    * Add client to Monopoly Clients (if doesn't exist)
  1. Gets Token
  1. Connect to Channel
    * Retrieves for location of client and other clients
  1. Update location