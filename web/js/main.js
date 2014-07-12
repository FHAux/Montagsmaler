/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

//Package definieren
this.$cc$ = {game : {}};

(function($cc$, window, XMLHttpRequest)
{ 
  /**
   * Prüft welches Html-Dokument geladen wurde und instanziiert abhängig davon die nötigen Klassen.
   * @class
   * @name $cc$.game.main
   * @see $cc$.game.appcopycat
   * @see $cc$.game.formular
   */
  function main(init)
  {
    if(window.location.href == "http://localhost:8080/copycat.html")
    {
      this.app = new $cc$.game.appcopycat(init, true);
    } else
    {
      this.app = new $cc$.game.appcopycat(init, false);
      new $cc$.game.formular(init, this.app);
    }
  };

  /**
   * Lädt das JSON-Dokument und eine neue main-Instanz.
   * @function
   */
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