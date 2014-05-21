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

(function($cc$, window, document)
{
  function main(init)
  {
    /**
     * @class
     * @name $cc$.game.main
     */

    // Zeichenklasse initialisieren
    var zeichnen = new $cc$.game.zeichnen(this, init),
        chat = new $cc$.game.chat(this),
        canvas = document.getElementById("zeichenflaeche");

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
        chat.anzeigen(eingabe);
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

      // Für die verschiedenen Themen registrieren
      //
      session.subscribe('de.copycat.mousedown', onmousedown).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      session.subscribe('de.copycat.mousemove', onmousemove).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      session.subscribe('de.copycat.senden', onsenden).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.farbauswahl', onfarbauswahl).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.clear', onclear).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      session.subscribe('de.copycat.staerkeauswahl', onstaerkeauswahl).then(
          function(subscription)
          {
            console.log("ok, subscribed with ID " + subscription.id);
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

  main.prototype =
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
    publishmousedown : function(mousePos)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.mousedown",
        [ mousePos ]);
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
    publishmousemove : function(mousePos)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.mousemove",
        [ mousePos ]);
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
    publishsenden : function(eingabe)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.senden",
        [ eingabe ]);
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
    publishfarbauswahl : function(farbe)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.farbauswahl",
        [ farbe ]);
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
    publishstaerkeauswahl : function(staerke)
    {
      if (this.connection.session)
      {
        this.connection.session.publish("de.copycat.staerkeauswahl",
        [ staerke ]);
      } else
      {
        console.log("cannot publish: no session");
      }
    },

  };

  window.onload = function()
  {
    var json = "json/init.json";
    //new main();

    var xhr = new XMLHttpRequest();
  
    xhr.onload  = function() {
      new main(JSON.parse(this.response));
      }; 
    xhr.onerror = function() {
      throw new Error(INIT_FILE + " not found");
      }; 
    xhr.overrideMimeType("application/json");  
    xhr.open("GET", json, true);
    xhr.send();
  };

}(this.$cc$, this.window, this.document));
