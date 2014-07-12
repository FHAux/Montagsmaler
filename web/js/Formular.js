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
   * Erstellt die Formular Listener.
   * @class
   * @name  $cc$.game.formular
   * @param {object} p_init - Konstanten aus dem JSON-File
   * @param {object} p_app - Instanz der Klasse AppCopycat
   * @classdesc Verwaltet Login- und Registrierungsformular.
   */
  function Formular(p_init, p_app)
  {
    var loginForm      = document.getElementById("Login"),
    regForm        = document.getElementById("Registrierung"),
    loginFunktion  = this.login,
    regFunktion    = this.registrierung,
    weiterFunktion = this.weiterleiten,
    connection = p_app.connection;

    this.init = p_init;

    loginForm.onsubmit = function(){return loginFunktion(weiterFunktion, connection);};
    regForm.onsubmit   = function(){return regFunktion(weiterFunktion, connection);};


  };

  Formular.prototype =
  {
      /**
       * Prüft ob Passwort und Nickname eingegeben wurden und gültig sind und leitet dann weiter.
       * @function
       * @name $cc$.game.formular#login
       * @param {function} p_weiterFunktion - {@link $cc$.game.formular#weiterleiten}
       * @param {object} p_connection - aktuelle Verbindung
       * @see $cc$.game.formular#weiterleiten
       */
      login: function(p_weiterFunktion, p_connection)
      {
        var meldung_log = document.Login;

        // Benutzer-Abfrage
        if (meldung_log.benutzer_log.value == "")
        {
          alert("Bitte geben Sie Ihren Benutzernamen ein!");
          meldung_log.benutzer_log.focus();
          return false;
        } else if (meldung_log.passwort_log.value == "") // Passwort-Abfrage
        {
          alert("Bitte geben Sie Ihr Passwort ein!");
          meldung_log.passwort_log.focus();
          return false;
        } else
        { 
          if (p_connection.session) {
            p_connection.session.call("de.copycat.check_login",[meldung_log.benutzer_log.value, meldung_log.passwort_log.value]).then(
                function (success)
                {
                  if (success)
                  {
                    p_weiterFunktion();
                  } else {
                    alert("Benutzername oder Passwort sind falsch!");
                    //überprüfen wo fehler ist!
                  }
                },
                p_connection.session.log
            );
          }
          return false;
        };

      },

      /**
       * Prüft, ob alle Eingaben vorhanden sind, die Passworter übereinstimmen, Nickname und Email noch frei sind und leitet dann weiter.
       * @function
       * @name $cc$.game.formular#registrierung
       * @param {function} p_weiterFunktion - {@link $cc$.game.formular#weiterleiten}
       * @param {object} p_connection - aktuelle Verbindung
       * @see $cc$.game.formular#weiterleiten
       */
      registrierung: function(p_weiterFunktion, p_connection)
      {
        var meldung_reg = document.Registrierung;

        // Benutzer-Abfrage
        if (meldung_reg.benutzer_reg.value == "")
        {
          alert("Bitte geben Sie Ihren Benutzernamen ein!");
          meldung_reg.benutzer.focus();
          return false;
        } else if (meldung_reg.email.value == "") // E-Mail-Abfrage
        {
          alert("Bitte geben Sie Ihre E-Mail-Adresse ein!");
          meldung_reg.email.focus();
          return false;
        } else if(meldung_reg.email.value.length < 7)
        {  
          alert("Ihre E-MailAdresse ist zu kurz!");
          meldung_reg.email.focus();
          return false;
        } else if (meldung_reg.email.value.indexOf(".", meldung_reg.email.value.indexOf("@")) == -1)
        {
          alert("Ihre E-MailAdresse ist nicht korrekt!");
          meldung_reg.email.focus();
          return false;
        } else if (meldung_reg.passwort_reg.value == "") // Passwort-Abfrage
        {
          alert("Bitte geben Sie Ihr Passwort ein!");
          meldung_reg.passwort_reg.focus();
          return false;
        } else if (meldung_reg.passwort_reg_w.value == "") //Passwort-Bestätigung
        {
          alert("Bitte bestätigen Sie Ihr Passwort!");
          meldung_reg.passwort_reg_w.focus();
          return false;
        } else if (meldung_reg.passwort_reg.value != meldung_reg.passwort_reg_w.value)
        {
          alert("Ihre Passwörter stimmen nicht überein!");
          meldung_reg.passwort_reg.focus();
          return false;
        } else
        {
          if(p_connection.session)
          {
            p_connection.session.call("de.copycat.check_registrierung",
                [meldung_reg.benutzer_reg.value, meldung_reg.email.value, meldung_reg.passwort_reg.value]).then(
                    function(fehler)
                    {
                      if(fehler)
                      {
                        alert(fehler + " nicht verfügbar!");
                      } else
                      {
                        alert("Erfolgreich registriert");
                        p_weiterFunktion();
                      }
                    }
                );
          }
          return false;
        };
      },

      /**
       * Leitet weiter zum Spiel
       * @function
       * @name $cc$.game.formular#weiterleiten
       */
      weiterleiten: function()
      {
        window.location.href = "http://localhost:8080/copycat.html";
      }
  };


  /** Platziert die Klasse im Package */
  $cc$.game.formular = Formular;

}(this.$cc$, this.document));