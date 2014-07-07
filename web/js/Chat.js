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
  function Chat(p_app)
  {
    this.main = p_app;
    this.ausgabe = document.getElementById("ausgabe");
    this.eingabe = document.getElementById("eingabe");
    this.mitspieler_fenster = document.getElementById("mitspieler");
    this.verwarnt = false;
    this.begriff = "schuhkarton";
    this.nickname;
    this.connection = p_app.connection;
    that = this;
    
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
    
    this.connection.session.call("de.copycat.check_nutzername").then(
        function(name)
        {
          that.nickname = name;
        });
    
    this.connection.session.call("de.copycat.nutzer_anzeigen").then(
        function(spieler)
        {
          that.mitspieler_anzeigen(spieler);
        });
    
    
  };

  Chat.prototype =
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
    anzeigen : function(p_nachricht, p_farbe)
    {
      var absatz = document.createElement("p"),
          text = document.createTextNode(p_nachricht);
      
      this.ausgabe.appendChild(absatz).style.color = p_farbe;
      absatz.appendChild(text);
      
      this.ausgabe.scrollTop = this.ausgabe.scrollHeight;

    },
    
    /**
     * @method
     * @name  $cc$.game.chat#mitspieler_anzeigen
     * 
     * @param {Object} spieler
     *        Enthält die Eingabe
     * 
     * Fügt den getippten Begriff dem Anzeigefenster hinzu.
     */
    mitspieler_anzeigen : function(p_mitspieler)
    {
      for(var attr in p_mitspieler)
      {
        var absatz = document.createElement("p"),
            text = p_mitspieler[attr][0] + ": " + p_mitspieler[attr][1],
            zeile = document.createTextNode(text);
        
        this.mitspieler_fenster.appendChild(absatz).style.color = "black";
        absatz.appendChild(zeile);
      }
     
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
        this.anzeigen(this.nickname + ": ", "#00688B");
        this.anzeigen(nachricht, "black");
        this.main.publishsenden(nachricht, this.nickname);
      };
      
      this.eingabe.value = "";
      
    },
    
    /**
     * @method
     * @name  $cc$.game.chat#verwarnen
     * 
     * Verwarnt den Zeichner mit Hilfe eines Pop-Ups.
     */
    verwarnen : function(p_verwarnt)
    { //verändern! count darf nicht durch publish hochzählen!
      if(p_verwarnt)
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
    istBegriff : function(p_eingabe)
    {
      if(this.begriff == p_eingabe.toLowerCase())
      {
        alert("Begriff erraten");
        this.anzeigen("\"" + p_eingabe +"\" ist der gesuchte Begriff - Glückwunsch!", "#CD0000");
        return true;
      } else if (p_eingabe.length > 3)
      {
        if (this.begriff.search(new RegExp(p_eingabe, "i")) != -1)
        {
          this.anzeigen("\"" + p_eingabe +"\" ist Teil des gesuchten Begriffs", "#FF7F24");
          return true;
        } else
        {
          return false;
        }
      }
    }
  };

  $cc$.game.chat = Chat;

}(this.$cc$, this.document));