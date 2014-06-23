/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

// Package definieren
this.$cc$ =
{
  game : {}
};

(function($cc$, window, XMLHttpRequest)
{ 
  function main(init)
  {
    /**
     * @class
     * @name $cc$.game.main
     */
    
    if(window.location.href == "http://localhost:8080/copycat.html")
    {
      new $cc$.game.appCopycat(init);
    } else
    {
      new $cc$.game.formular(init);
    }
  };
  
  
  window.onload = function()
  {
    var json = "json/init.json";

    var xhr = new XMLHttpRequest();
  
    xhr.onload  = function()
    {
     new main(JSON.parse(this.response));
    }; 
    xhr.onerror = function()
    {
      throw new Error(INIT_FILE + " not found");
    }; 
    xhr.overrideMimeType("application/json");  
    xhr.open("GET", json, true);
    xhr.send();
  };
  
  $cc$.game.main = main;


}(this.$cc$, this.window, this.XMLHttpRequest));