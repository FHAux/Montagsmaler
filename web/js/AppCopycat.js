/**
 * @module    $cc$
 * @author    Nicole Weiß
 * @author    Katrin Riedelbauch
 * @copyright 2014, Nicole Weiß, Katrin Riedelbauch
 */

(function($cc$, window, document)
{
  /**
   * Erstellt die Connection und sämtliche onEvent-Funktionen und führt die Event-Subscribes aus.
   * @class
   * @name $cc$.game.appcopycat
   * @param {object} p_init - Konstanten aus JSON-File
   * @param {boolean} p_eingeloggt - ist der Spieler bereits eingeloggt
   * @classdesc Verwaltet sämtliche Event publishes&subscribes und die onEvent-Funktionen.
   */
  function AppCopycat(p_init, p_eingeloggt)
  {  
    var canvas = document.getElementById("zeichenflaeche");
    this.init = p_init;
    this.eingeloggt = p_eingeloggt;
    that = this;
    
    AUTOBAHN_DEBUG = true;
    DEBUG = false;

    /** Erstellt eine neue Verbindung */
    this.connection = new autobahn.Connection(
    {
      url : 'ws://127.0.0.1:8080/ws',
      realm : 'realm1'
    });

    /**
     * Instanziiert im Falle von p_eingeloggt=True die Zeichen und Chat Klassen.
     * @function
     * @param {object} p_session - aktuelle Session
     * @see $cc$.game.zeichnen
     * @see $cc$.game.chat
     */
    this.connection.onopen = function(p_session)
    {
      console.log("session established!");
    
        // Klassen initialisieren
        if(p_eingeloggt)
        {
          this.session.call("de.copycat.check_nutzername").then(
              function(name)
              {
                that.nickname = name;
          });
          
          var zeichnen = new $cc$.game.zeichnen(that, p_init),
              chat     = new $cc$.game.chat(that, that.nickname);
        }


      /**
       * Veranlasst, dass die Zeichenklasse anfängt zu Zeichnen.
       * @event
       * @name $cc$.game.appcopycat~onMausGedrueckt
       * @param {object} p_mausPos - aktuelle Mausposition
       * @see $cc$.game.zeichnen#starteZeichnen
       */
      function onMausGedrueckt(p_mausPos)
      {
        if (DEBUG)
        {
          console.log(p_mausPos);
        };
        zeichnen.starteZeichnen(p_mausPos[0]);
      };

      /**
       * Veranlasst, dass die Zeichenklasse weiterzeichnet.
       * @event
       * @name $cc$.game.appcopycat~onMausBewegen
       * @param {object} p_mausPos - aktuelle Mausposition
       * @see $cc$.game.zeichnen#zeichneWeiter
       */
      function onMausBewegen(p_mausPos)
      {
        if (DEBUG)
        {
          console.log(p_mausPos);
        };
        zeichnen.zeichneWeiter(p_mausPos[0]);
      };

      /**
       * Veranlasst, dass die Nachricht und der Verfasser im Chat angezeigt werden.
       * @event
       * @name $cc$.game.appcopycat~onSenden
       * @param {object} p_eingabe - enthält Verfasser und zugehörige Nachricht
       * @see $cc$.game.chat#anzeigen
       */
      function onSenden(p_eingabe)
      {
        chat.anzeigen(p_eingabe[1] + ": ", "#7CCD7C");
        chat.anzeigen(p_eingabe[0], "black");
      };
      
      /**
       * Veranlasst, dass die Zeichenfarbe geändert wird.
       * @event
       * @name $cc$.game.appcopycat~onFarbAuswahl
       * @param {object} p_farbe - neue Zeichenfarbe
       * @see $cc$.game.zeichnen#farbAuswahl
       */
      function onFarbAuswahl(p_farbe)
      {
        zeichnen.farbAuswahl(p_farbe[0]);
      };
      
      /**
       * Veranlasst, dass die Zeichenfläche gelöscht wird.
       * @event
       * @name $cc$.game.appcopycat~onLoeschen
       * @see $cc$.game.zeichnen#loeschen
       */
      function onLoeschen()
      {
        zeichnen.loeschen(canvas);
      };
      
      /**
       * Veranlasst, dass mit einer neuen Linienstärke gezeichnet wird.
       * @event
       * @name $cc$.game.appcopycat~onStaerkeAuswahl
       * @param {object} p_staerke - neue Linienstärke
       * @see $cc$.game.zeichnen#staerkeAuswahl
       */
      function onStaerkeAuswahl(p_staerke)
      {
        zeichnen.staerkeAuswahl(p_staerke[0]);
      };
      
      /**
       * Veranlasst, dass ein Verwarnen-Popup erscheint.
       * @event
       * @name $cc$.game.appcopycat~onVerwarnen
       * @param {boolean} p_verwarnt - wurde der Zeichner bereits verwarnt
       * @see $cc$.game.chat#verwarnen
       */
      function onVerwarnen(p_verwarnt)
      {
        chat.verwarnen(p_verwarnt);
      };
      
      /**
       * Veranlasst, dass ein Aufgeben-Popup erscheint.
       * @event
       * @name $cc$.game.appcopycat~onAufgeben
       * @see $cc$.game.zeichnen#aufgeben
       */
      function onAufgeben()
      {
        zeichnen.aufgeben();
      };
      
      /**
       * Veranlasst, dass die Mitspielerliste aktualisiert wird, wenn sich ein Spieler ein-/ausloggt.
       * @event
       * @name $cc$.game.appcopycat~onLoginLogout
       * @see $cc$.game.chat#holeSpielerliste
       */
      function onLoginLogout()
      {
        chat.holeSpielerliste();
      };
      
      /**
       * @see $cc$.game.appcopycat~onMausGedrueckt
       */     
      p_session.subscribe('de.copycat.maus_gedrueckt', onMausGedrueckt).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      /**
       * @see $cc$.game.appcopycat~onMausBewegen
       */
      p_session.subscribe('de.copycat.maus_bewegen', onMausBewegen).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });

      /**
       * @see $cc$.game.appcopycat~onSenden
       */
      p_session.subscribe('de.copycat.senden', onSenden).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onFarbAuswahl
       */
      p_session.subscribe('de.copycat.farb_auswahl', onFarbAuswahl).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onLoeschen
       */
      p_session.subscribe('de.copycat.loeschen', onLoeschen).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onStaerkeAuswahl
       */
      p_session.subscribe('de.copycat.staerke_auswahl', onStaerkeAuswahl).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onVerwarnen
       */
      p_session.subscribe('de.copycat.verwarnen', onVerwarnen).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onAufgeben
       */
      p_session.subscribe('de.copycat.aufgeben', onAufgeben).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
      /**
       * @see $cc$.game.appcopycat~onLoginLogout
       */
      p_session.subscribe('de.copycat.login_logout', onLoginLogout).then(
          function(subscription)
          {
            //console.log("ok, subscribed with ID " + subscription.id);
          }, function(error)
          {
            console.log(error);
      });
      
    };

    /**
     * Gibt bei Verbindungsverlust den Grund aus.
     * @function
     * @param {object} p_grund - Grund für Verbindungsverlust
     * @param {object} p_details - Details
     */
    this.connection.onclose = function(p_grund, p_details)
    {
      console.log("connection lost", p_grund);
    };

    /** Öffnet die neue Verbindung */
    this.connection.open();

  }

  AppCopycat.prototype =
  { 
      /**
       * Wird ausgeführt, wenn die Maustaste gedrückt wird.
       * @function
       * @name $cc$.game.appcopycat#publishMausGedrueckt
       * @param {object} p_mausPos - aktuelle Mausposition
       * @fires $cc$.game.appcopycat~onMausGedrueckt
       * 
       */
      publishMausGedrueckt : function(p_mausPos)
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.maus_gedrueckt",
          [ p_mausPos ]);
        } else
        {
          console.log("cannot publish: no session");
        }
      },
  
      /**
       * Wird ausgeführt, wenn die Maustaste gedrückt ist und die Maus sich bewegt.
       * @function
       * @name $cc$.game.appcopycat#publishMausBewegen
       * @param {object} p_mausPos - aktuelle Mausposition
       * @fires $cc$.game.appcopycat~onMausBewegen
       */
      publishMausBewegen : function(p_mausPos)
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.maus_bewegen",
          [ p_mausPos ]);
        } else
        {
          console.log("cannot publish: no session");
        }
      },
  
      /**
       * Wird ausgeführt, wenn im Chat etwas abgeschickt wird.
       * @function
       * @name $cc$.game.appcopycat#publishSenden
       * @param {string} p_eingabe - Chateingabe
       * @param {string} p_nickname - Verfasser der Eingabe
       * @fires $cc$.game.appcopycat~onSenden
       */
      publishSenden : function(p_eingabe, p_nickname)
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
       * Wird ausgeführt, wenn eine andere Zeichenfarbe gewählt wird.
       * @function
       * @name $cc$.game.appcopycat#publishFarbAuswahl
       * @param {string} p_farbe - gewählte Farbe
       * @fires $cc$.game.appcopycat~onFarbAuswahl
       */
      publishFarbAuswahl : function(p_farbe)
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.farb_auswahl",
          [ p_farbe ]);
        } else
        {
          console.log("cannot publish: no session");
        }
      },
      
      /**
       * Wird ausgeführt, wenn die Zeichenfläche gelöscht wird.
       * @function
       * @name $cc$.game.appcopycat#publishLoeschen
       * @fires $cc$.game.appcopycat~onLoeschen
       */
      publishLoeschen : function()
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.loeschen");
        } else
        {
          console.log("cannot publish: no session");
        }
      },
      
      /**
       * Wird ausgeführt, wenn eine andere Zeichenlinienstärke ausgewählt wird.
       * @function
       * @name $cc$.game.appcopycat#publishStaerkeAuswahl
       * @param {string} p_linienstaerke - gewählte Linienstärke
       * @fires $cc$.game.appcopycat~onStaerkeAuswahl
       */
      publishStaerkeAuswahl : function(p_linienstaerke)
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.staerke_auswahl",
          [ p_linienstaerke ]);
        } else
        {
          console.log("cannot publish: no session");
        }
      },
      
      /**
       * Wird ausgeführt, wenn der Zeichner verwarnt wird.
       * @function
       * @name $cc$.game.appcopycat#publishVerwarnen
       * @param {boolean} p_verwarnt - wurde der Zeichner bereits verwarnt
       * @fires $cc$.game.appcopycat~onVerwarnen
       */
      publishVerwarnen : function(p_verwarnt)
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
       * Wird ausgeführt, wenn der Zeichner aufgibt.
       * @function
       * @name $cc$.game.appcopycat#publishAufgeben
       * @fires $cc$.game.appcopycat~onAufgeben
       */
      publishAufgeben : function()
      {
        if (this.connection.session)
        {
          this.connection.session.publish("de.copycat.aufgeben");
        } else
        {
          console.log("cannot publish: no session");
        }
      },
      
      /**
       * Setzt den Wert eingeloggt in der Datenbank auf FALSE.
       * @function
       * @name $cc$.game.appcopycat#ausloggen
       */
      ausloggen: function()
      {
        console.log("stop");
        this.connection.session.call("de.copycat.ausloggen", [that.nickname]);
      }

  };

  /** Platziert die Klasse im Package */
  $cc$.game.appcopycat = AppCopycat;

}(this.$cc$, this.window, this.document));