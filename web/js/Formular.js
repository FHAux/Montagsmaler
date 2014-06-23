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
   * @name  $cc$.game.formular
   */
  
  function formular(init)
  {
    var loginForm      = document.getElementById("Login"),
        regForm        = document.getElementById("Registrierung"),
        loginFunktion  = this.login,
        regFunktion    = this.registrierung,
        weiterFunktion = this.weiterleiten;
    
    this.init = init;
    
    loginForm.onsubmit = function(){return loginFunktion(weiterFunktion);};
    regForm.onsubmit   = function(){return regFunktion(weiterFunktion);};
    
    
  };
  
  formular.prototype =
  {
      login: function(weiterFunktion)
      {
        var meldung_log = document.Login;
        
        // Benutzer-Abfrage
        if (meldung_log.benutzer_log.value == "")
        {
          alert("Bitte geben Sie Ihren Benutzernamen ein!");
          meldung_log.benutzer.focus();
          return false;
        } else if (meldung_log.passwort_log.value == "") // Passwort-Abfrage
        {
          alert("Bitte geben Sie Ihr Passwort ein!");
          meldung_log.passwort_log.focus();
          return false;
        } else
        {
          alert("alles toll");
          weiterFunktion();
          return false;
        };
        
      },
      
      registrierung: function(weiterFunktion)
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
        } else
        {
          alert("alles toll");
          weiterFunktion();
          return false;
        };
      },
      
      weiterleiten: function() {window.location.href = "http://localhost:8080/copycat.html";}
  };

  
    // Im Package platzieren
  $cc$.game.formular = formular;

}(this.$cc$, this.document));