/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

(function($cc$, document)
{
  "use strict";

  /**
   * @class
   * @name  $cc$.game.chat
   * 
   * @param {Object} main
   *        Die Main-Klasse wird mitgegeben
   */
  function chat(main)
  {
    this.ansicht = document.getElementById("ansicht");
    this.main = main;
    this.eingabefeld = document.getElementById("eingabe");
    var button = document.getElementById("sendenButton");

    button.addEventListener("click", (function()
    {
      this.senden();
    }).bind(this));

    document.addEventListener("keyup", (function(event)
    {
      if (event.keyCode == 13)
      {
        this.senden();
      }
    }).bind(this));
  };

  chat.prototype =
  {
    /**
     * @method
     * @name  $cc$.game.chat#anzeigen
     * 
     * @param {Object} nachricht
     *        Enthält die Eingabe
     * 
     * Fügt den getippten Begriff dem Anzeigefenster hinzu.
     */
    anzeigen : function(nachricht)
    {
      this.ansicht.value += nachricht; // Zeilenumbruch?
    },

    /**
     * @method
     * @name  $cc$.game.chat#senden
     * 
     * Ruft $cc$.game.chat#anzeigen auf, klärt das Eingabefeld und sendet die
     * Eingabe an den Server.
     */
    senden : function()
    {
      var nachricht = this.eingabefeld.value;
      this.anzeigen(nachricht);
      this.main.publishsenden(nachricht);
      this.eingabefeld.value = "";
    }
  };

  $cc$.game.chat = chat;

}(this.$cc$, this.document));
