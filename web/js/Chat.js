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
    this.main = main;
    this.ausgabe = document.getElementById("ausgabe");
    this.eingabe = document.getElementById("eingabe");
    this.verwarnt = false;
    this.begriff = "schuhkarton";
    var button = document.getElementById("sendenBtn"),
        verwarnen = document.getElementById("verwarnenBtn");

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
    
    // Buttonlistener von Zeichner verwarnen
    verwarnen.addEventListener("click", (function()
    {
      this.main.publishverwarnen(this.verwarnt);
      this.verwarnen(this.verwarnt);
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
    anzeigen : function(nachricht, farbe)
    {
      var absatz = document.createElement("p"),
          text = document.createTextNode(nachricht);
      
      this.ausgabe.appendChild(absatz).style.color = farbe;
      absatz.appendChild(text);
      
      this.ausgabe.scrollTop = this.ausgabe.scrollHeight;

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
      var nachricht = this.eingabe.value;
      
      if(this.istBegriff(nachricht))
      {
        
      } else
      {
        this.anzeigen("Name: ", "#7CCD7C");
        this.anzeigen(nachricht, "black");
        this.main.publishsenden(nachricht);
      };
      
      this.eingabe.value = "";
      
    },
    
    /**
     * @method
     * @name  $cc$.game.chat#verwarnen
     * 
     * Verwarnt den Zeichner mit Hilfe eines Pop-Ups.
     */
    verwarnen : function(verwarnt)
    { //verändern! count darf nicht durch publish hochzählen!
      if(verwarnt)
        {
          alert('Die Zeichenrunde wird abgebrochen! Achtung: Der Zeichner hat die Spielregeln missachtet! - 2');
          //Runde beenden
        }
      else
        {
          this.verwarnt = true;
          alert('Der Zeichner hat geschummelt! Achtung: Es sind keine Worte oder Buchstaben erlaubt! - 1');
        }
    },
    
    /**
     * @method
     * @name  $cc$.game.chat#istBegriff
     * 
     * @param {Object} eingabe
     *        Enthält die Eingabe
     * 
     * Testet, ob der eingegebene Begriff Teil des gesuchten Wortes oder das
     * gesuchte Wort ist.
     */
    istBegriff : function(eingabe)
    {
      if(this.begriff == eingabe.toLowerCase())
      {
        alert("Begriff erraten");
        this.anzeigen("\"" + eingabe +"\" ist der gesuchte Begriff - Glückwunsch!", "#CD0000");
        return true;
      } else if (eingabe.length > 3)
      {
        if (this.begriff.search(new RegExp(eingabe, "i")) != -1)
        {
          this.anzeigen("\"" + eingabe +"\" ist Teil des gesuchten Begriffs", "#FF7F24");
          return true;
        } else
        {
          return false;
        }
      }
    }
  };

  $cc$.game.chat = chat;

}(this.$cc$, this.document));