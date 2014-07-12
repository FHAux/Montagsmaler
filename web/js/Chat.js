/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

(function($cc$, document, window)
{
  "use strict";

  /**
   * Setzt Button/Key Listener und zeigt an, welche Spieler gerade online sind.
   * @class
   * @name  $cc$.game.chat
   * @param {object} p_app - Instanz der Klasse AppCopycat
   * @param {string} p_nickname - Name des eingeloggten Spielers
   * @classdesc Chat verwaltet den kompletten Chat, inkl. Begriffserkennung, Verwarnung und Spielerliste. 
   */
  function Chat(p_app, p_nickname)
  {
    this.main = p_app;
    this.ausgabe = document.getElementById("ausgabe");
    this.eingabe = document.getElementById("eingabe");
    this.alertText = document.getElementById("alert-text");
    this.alertWrap = document.getElementById("alert-wrap");
    this.mitspieler_fenster = document.getElementById("mitspieler");
    this.verwarnt = false;
    this.begriff = "schuhkarton";
    this.nickname = p_nickname;
    this.connection = p_app.connection;
    that = this;

    var senden = document.getElementById("sendenBtn"),
        verwarnen = document.getElementById("verwarnenBtn"),
        alertX = document.getElementById("alert-close"),
        okBtn = document.getElementById("okBtn");

    senden.addEventListener("click", (function()
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

    verwarnen.addEventListener("click", (function()
    {
      this.main.publishVerwarnen(this.verwarnt);
      this.verwarnen(this.verwarnt);
    }).bind(this));
    
    alertX.addEventListener("click", (function()
        {
          this.verbergeSpielregeln();
        }).bind(this));
    
    okBtn.addEventListener("click", (function()
        {
          this.verbergeSpielregeln();
        }).bind(this));
    

    this.holeSpielerliste();
    this.zeigeSpielregeln("ACHTUNG: Bei Regelbruch kann bis zu 2x verwarnt werden. Danach droht Spielrundenabbruch!");

  };

  Chat.prototype =
  {
      /**
       * Holt eine Liste der eingeloggten Spieler.
       * @function
       * @name $cc$.game.chat#holeSpielerliste
       * @see $cc$.game.chat#mitspieler_anzeigen
       */
      holeSpielerliste: function()
      {
        this.connection.session.call("de.copycat.nutzer_anzeigen").then(
            function(spieler)
            {
              that.mitspieler_anzeigen(spieler);
        });
      },

      /**
       * Gibt im Spielerfenster aus, welche Spieler gerade online sind.
       * @function
       * @name $cc$.game.chat#mitspieler_anzeigen
       * @param {object} p_mitspieler - alle Spieler die eingeloggt sind
       */
      mitspieler_anzeigen : function(p_mitspieler)
      { 
        this.mitspieler_fenster.innerHTML="";
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
       * Sendet die Eingabe an alle Clients und gibt sie im Chat aus.
       * @function
       * @name $cc$.game.chat#senden
       * @see $cc$.game.chat#anzeigen
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
          this.main.publishSenden(nachricht, this.nickname);
        };

        this.eingabe.value = "";
      },

      /**
       * Gibt die Nachricht und den Verfasser im Chat aus.
       * @function
       * @name $cc$.game.chat#anzeigen
       * @param {string} p_nachricht - Chateingabe
       * @param {string} p_farbe - Verfasser der Eingabe
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
       * Lässt ein Verwarnen-Popup erscheinen und setzt die Variable verwarnt=True.
       * @function
       * @name $cc$.game.chat#verwarnen
       * @param {boolean} p_verwarnt - wurde der Zeichner bereits verwarnt
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
       * Prüft ob die Eingabe dem gesuchten Begriff entspricht, oder Teil des Begriffes ist und gibt entsprechende Hinweise aus.
       * @function
       * @name $cc$.game.chat#istBegriff
       * @param {string} p_eingabe - Chateingabe
       * @returns {Boolean}
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
      },
      
      /**
       * Zeigt ein Pop-Up mit den Spielregeln.
       * @function
       * @name $cc$.game.chat#zeigeSpielregeln
       * @param {string} p_text - Warnung, die mit dem Bild angezeigt wird
       */
      zeigeSpielregeln: function(p_text)
      {
        var ausgabe = '<img src="img/regeln.png" />' + p_text + '<br /><br />';
       
        this.alertText.innerHTML = ausgabe;
        this.alertWrap.style.display = 'block';
      },
      
      /**
       * Verbirgt das Spielregel-Pop-Up wieder.
       * @function
       * @name $cc$.game.chat#verbergeSpielregeln
       */
      verbergeSpielregeln: function()
      {
        this.alertWrap.style.display = 'none';
      }

  };
  
  /**
   * @function
   */
  window.onbeforeunload = function(){that.main.ausloggen(); return null;};

  /** Platziert die Klasse im Package */
  $cc$.game.chat = Chat;

}(this.$cc$, this.document, this.window));