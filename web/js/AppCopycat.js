/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

(function($cc$, window, document)
{
  function AppCopycat(p_init, p_eingeloggt)
  {
    /**
     * @class
     * @name $cc$.game.AppCopycat
     */    
    var canvas = document.getElementById("zeichenflaeche");
    this.init = p_init;
    this.eingeloggt = p_eingeloggt;
    that = this;
    
    AUTOBAHN_DEBUG = true;
    DEBUG = false;

    this.connection = new autobahn.Connection(
    {
      url : 'ws://127.0.0.1:8080/ws',
      realm : 'realm1'
    });

    // Wird ausgeführt wenn die Verbindung hergestellt ist
    this.connection.onopen = function(session)
    {
      console.log("session established!");
    
        // Klassen initialisieren
        if(p_eingeloggt)
        {
          var zeichnen = new $cc$.game.zeichnen(that, p_init),
              chat     = new $cc$.game.chat(that);
        }


      /**
       * @method
       * @name  $cc$.game.main#onmousedown
       * 
       * @param {Object} mousePos
       *        Enthält die Mausposition relativ zur Zeichenfläche.
       * 
       * Wird ausgeführt, wenn auf einem anderen Client die Maustaste innerhalb
       * der Zeichenfläche gedrückt wird und setzt im aktuellen Client an dieser
       * Position ebenfalls einen neuen Pfad an.
       */
      function onmousedown(mousePos)
      {
        if (DEBUG)
        {
          console.log(mousePos);
        };
        zeichnen.begin(mousePos[0]);
      };

      /**
       * @method
       * @name  $cc$.game.main#onmousemove
       * 
       * @param {Object} mousePos
       *        Enthält die Mausposition relativ zur Zeichenfläche.
       * 
       * Wird ausgeführt, wenn auf einem anderen Client die Maustaste innerhalb
       * der Zeichenfläche gedrückt ist und die Maus bewegt wird und zeichnet
       * den dort gezeichneten Pfad im aktuellen Client nach.
       */
      function onmousemove(mousePos)
      {
        if (DEBUG)
        {
          console.log(mousePos);
        };
        zeichnen.moveOn(mousePos[0]);
      };

      /**
       * @method
       * @name  $cc$.game.main#onsenden
       * 
       * @param {Object} eingabe
       *        Enthält die Chateingabe
       * 
       * Wird ausgeführt wenn auf einem anderen Client eine Chateingabe gesendet
       * wird und zeigt diese auch im aktuellen Client an.
       */
      function onsenden(eingabe)
      {
        chat.anzeigen(eingabe[1] + ": ", "#7CCD7C");
        chat.anzeigen(eingabe[0], "black");
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onfarbauswahl
       * 
       * @param {Object} farbe
       *        Enthält die ausgewählte Farbe
       * 
       * Wird ausgeführt wenn auf einem anderen Client die Farbe gewechselt
       * und ändert sie auf dem aktuellen Client ebenfalls.
       */
      function onfarbauswahl(farbe)
      {
        zeichnen.farbAuswahl(farbe[0]);
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onclear
       * 
       * Wird ausgeführt wenn auf einem anderen Client das Canvas gecleart wird
       * und cleart es auf dem aktuellen Client ebenfalls.
       */
      function onclear()
      {
        zeichnen.clear(canvas);
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onstaerkeauswahl
       * 
       * @param {Object} staerke
       *        Enthält die ausgewählte Stärke
       * 
       * Wird ausgeführt wenn auf einem anderen Client die Stärke gewechselt
       * und ändert sie auf dem aktuellen Client ebenfalls.
       */
      function onstaerkeauswahl(staerke)
      {
        zeichnen.staerkeAuswahl(staerke[0]);
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onverwarnen
       * 
       * @param {Object} verwarnt
       *        Enthält einen Boolean, der anzeigt, ob der Zeichner bereits
       *        verwarnt wurde
       * 
       * Wird ausgeführt wenn auf einem anderen Client der Zeichner verwarnt
       * wurde und zeigt das Pop-Up auf dem aktuellen Client ebenfalls an.
       */
      function onverwarnen(verwarnt)
      {
        chat.verwarnen(verwarnt);
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onaufgeben
       * 
       * Wird ausgeführt wenn der Zeichner aufgibt und beendet die Zeichenrunde.
       */
      function onaufgeben()
      {
        zeichnen.aufgeben();
      };
      
      /**
       * @method
       * @name  $cc$.game.main#onaufgeben
       * 
       * Wird ausgeführt wenn der Zeichner aufgibt und beendet die Zeichenrunde.
       */
      function onnutzerAnzeigen(results)
      {
        console.log(results);
        chat.mitspieler_anzeigen();
      };
      
      // Für die verschiedenen Themen registrieren
      //
      session.subscribe('de.copycat.mousedown', onmousedown).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      session.subscribe('de.copycat.mousemove', onmousemove).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      session.subscribe('de.copycat.senden', onsenden).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.farbauswahl', onfarbauswahl).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.clear', onclear).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.staerkeauswahl', onstaerkeauswahl).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.verwarnen', onverwarnen).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.aufgeben', onaufgeben).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.nutzer_anzeigen', onnutzerAnzeigen).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
    };

    // Wird ausgeführt wenn die Verbindung abbricht
    this.connection.onclose = function(reason, details)
    {
      console.log("connection lost", reason);
    };

    // Öffnet die Verbindung
    this.connection.open();

  }

  AppCopycat.prototype =
  { 
    /**
     * @method
     * @name  $cc$.game.main#publishmousedown
     * 
     * @param {Object} mousePos
     *        Enthält die Mausposition relativ zur Zeichenfläche.
     * 
     * Wird ausgeführt wenn die Maustaste innerhalb der Zeichenfläche gedrückt
     * wird und überträgt die Mausposition zum Server.
     */
    publishmousedown : function(p_mousePos)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.mousedown",
        [ p_mousePos ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },

    /**
     * @method
     * @name  $cc$.game.main#publishmousemove
     * 
     * @param {Object} mousePos
     *        Enthält die Mausposition relativ zur Zeichenfläche.
     * 
     * Wird ausgeführt wenn die Maustaste innerhalb der Zeichenfläche gedrückt
     * ist und die Maus bewegt wird und überträgt die Mausposition zum Server.
     */
    publishmousemove : function(p_mousePos)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.mousemove",
        [ p_mousePos ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },

    /**
     * @method
     * @name  $cc$.game.main#publishsenden
     * 
     * @param {Object} eingabe
     *        Enthält die Chateingabe
     * 
     * Wird ausgeführt wenn die Chateingabe gesendet wird und überträgt die
     * Eingabe an den Server.
     */
    publishsenden : function(p_eingabe, p_nickname)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.senden",
        [ p_eingabe, p_nickname ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.main#publishfarbauswahl
     * 
     * @param {Object} farbe
     *        Enthält die ausgewählte Farbe
     * 
     * Wird ausgeführt wenn die Farbe gewechselt wird und überträgt die
     * ausgewählte Farbe.
     */
    publishfarbauswahl : function(p_farbe)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.farbauswahl",
        [ p_farbe ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.main#publishclear
     * 
     * Wird ausgeführt wenn das Canvas gecleart wird.
     */
    publishclear : function()
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.clear");
      } else
      {
        console.log("cannot publish: no session");
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.main#publishstaerkeauswahl
     * 
     * @param {Object} staerke
     *        Enthält die ausgewählte Stärke
     * 
     * Wird ausgeführt wenn die Stärke gewechselt wird und überträgt die
     * ausgewählte Stärke.
     */
    publishstaerkeauswahl : function(p_linienstaerke)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.staerkeauswahl",
        [ p_linienstaerke ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.main#publishverwarnen
     * 
     * @param {Object} verwarnt
     *        Enthält einen Boolean, der anzeigt, ob der Zeichner bereits
     *        verwarnt wurde
     * 
     * Wird ausgeführt wenn auf einem anderen Client der Zeichner verwarnt
     * wurde und überträgt den Boolean verwarnt.
     */
    publishverwarnen : function(p_verwarnt)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.verwarnen");
      } else
      {
        console.log("cannot publish: no session");
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.main#publishaufgeben
     * 
     * Wird ausgeführt wenn der Zeichner aufgibt und beendet die Zeichenrunde.
     */
    publishaufgeben : function()
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.aufgeben",
        [ ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    }

  };

  // Im Package platzieren
  $cc$.game.AppCopycat = AppCopycat;

}(this.$cc$, this.window, this.document));