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
   * Setzt Button/Maus Listener.
   * @class
   * @name  $cc$.game.zeichnen
   * @param {Object} p_app - Instanz der Klasse AppCopycat
   * @param {Object} p_init - Konstanten auf dem JSON-File
   * @classdesc Zeichnen verwaltet die Zeichenfläche, Zeichenfunktion, Zeichenkomponenten und die Verwarn-Funktion.
   */
  function Zeichnen(p_app, p_init)
  {
    var rot = document.getElementById("rotBtn"),
    gruen = document.getElementById("gruenBtn"),
    blau = document.getElementById("blauBtn"),
    gelb = document.getElementById("gelbBtn"),
    lila = document.getElementById("lilaBtn"),
    grau = document.getElementById("grauBtn"),
    schwarz = document.getElementById("schwarzBtn"),
    weiss = document.getElementById("weissBtn"),
    loeschen = document.getElementById("clearBtn"),
    duenn = document.getElementById("duennBtn"),
    normal = document.getElementById("normalBtn"),
    breit = document.getElementById("breitBtn"),
    fett = document.getElementById("fettBtn"),
    aufgeben = document.getElementById("aufgebenBtn");

    this.canvas = document.getElementById("zeichenflaeche");
    this.context = this.canvas.getContext("2d");
    this.istGedrueckt = false; // ist die Maustaste noch gedrückt
    this.init = p_init;
    this.aktFarbe = p_init.farben.schwarz;
    this.aktStaerke = p_init.linienstaerken.normal;

    rot.addEventListener("click", (function()
    {
      this.farbAuswahl("rot");
      p_app.publishFarbAuswahl("rot");
    }).bind(this));

    gruen.addEventListener("click", (function()
    {
      this.farbAuswahl("gruen");
      p_app.publishFarbAuswahl("gruen");
    }).bind(this));

    blau.addEventListener("click", (function()
    {
      this.farbAuswahl("blau");
      p_app.publishFarbAuswahl("blau");
    }).bind(this));

    gelb.addEventListener("click", (function()
    {
      this.farbAuswahl("gelb");
      p_app.publishFarbAuswahl("gelb");
    }).bind(this));

    lila.addEventListener("click", (function()
    {
      this.farbAuswahl("lila");
      p_app.publishFarbAuswahl("lila");
    }).bind(this));

    grau.addEventListener("click", (function()
    {
      this.farbAuswahl("grau");
      p_app.publishFarbAuswahl("grau");
    }).bind(this));

    schwarz.addEventListener("click", (function()
    {
      this.farbAuswahl("schwarz");
      p_app.publishFarbAuswahl("schwarz");
    }).bind(this));

    weiss.addEventListener("click", (function()
    {
      this.farbAuswahl("weiss");
      p_app.publishFarbAuswahl("weiss");
    }).bind(this));

    loeschen.addEventListener("click", (function()
    {
      this.loeschen(this.canvas);
      p_app.publishLoeschen();
    }).bind(this));

    duenn.addEventListener("click", (function()
    {
      this.staerkeAuswahl("duenn");
      p_app.publishStaerkeAuswahl("duenn");
    }).bind(this));

    normal.addEventListener("click", (function()
    {
      this.staerkeAuswahl("normal");
      p_app.publishStaerkeAuswahl("normal");
    }).bind(this));

    breit.addEventListener("click", (function()
    {
      this.staerkeAuswahl("breit");
      p_app.publishStaerkeAuswahl("breit");
    }).bind(this));

    fett.addEventListener("click", (function()
    {
      this.staerkeAuswahl("fett");
      p_app.publishStaerkeAuswahl("fett");
    }).bind(this));

    aufgeben.addEventListener("click", (function()
    {
      this.aufgeben();
      p_app.publishAufgeben();
    }).bind(this));

    // Mauslistener
    document.addEventListener("mousedown", (function(event)
    {
      var mausPos = this.getMausPos(event, this.canvas);
      this.starteZeichnen(mausPos);
      this.istGedrueckt = true;
      p_app.publishMausGedrueckt(mausPos);
    }).bind(this));

    document.addEventListener("mousemove", (function(event)
    {
      if (this.istGedrueckt)
      {
        var mausPos = this.getMausPos(event, this.canvas);
        this.zeichneWeiter(mausPos);
        p_app.publishMausBewegen(mausPos);
      }
    }).bind(this));

    document.addEventListener("mouseup", (function(event)
    {
      this.istGedrueckt = false;
    }).bind(this));
  };

  Zeichnen.prototype =
  {
      /**
       * Ermittelt die aktuelle Mausposition bezüglich der Zeichenfläche.
       * @function
       * @name  $cc$.game.zeichnen#getMausPos
       * @param {Object} event - Mausevent, zu dem die Position bestimmt wurde
       * @paran {Object} canvas - Zeichenfläche
       */
      getMausPos : function(p_event, p_canvas)
      {
        var can = p_canvas.getBoundingClientRect();
        return {
          x : p_event.clientX - can.left,
          y : p_event.clientY - can.top
        };
      },

      /**
       * Beginnt an der Mausposition eine Linie zu zeichnen.
       * @function
       * @name $cc$.game.zeichnen#starteZeichnen
       * @param {object} p_mausPos - aktuelle Mausposition
       */
      starteZeichnen : function(p_mausPos)
      {
        this.context.beginPath();
        this.context.moveTo(p_mausPos.x, p_mausPos.y);
      },

      /**
       * Zeichnet die Linie weiter entlang der Mausbewegung.
       * @function
       * @name $cc$.game.zeichnen#zeichneWeiter
       * @param {object} p_mausPos - aktuelle Mausposition
       */
      zeichneWeiter : function(p_mausPos)
      {
        this.context.lineTo(p_mausPos.x, p_mausPos.y);
        this.context.strokeStyle = this.aktFarbe;
        this.context.lineWidth = this.aktStaerke;
        this.context.stroke();
      },

      /**
       * Setzt die aktuelle Zeichenfarbe neu.
       * @function
       * @name $cc$.game.zeichnen#farbAuswahl
       * @param {string} p_farbe - gewählte Farbe
       */
      farbAuswahl: function(p_farbe)
      {
        switch(p_farbe)
        {
          case "rot":
            this.aktFarbe = this.init.farben.rot;
            break;
          case "gruen":
            this.aktFarbe = this.init.farben.gruen;
            break;
          case "blau":
            this.aktFarbe = this.init.farben.blau;
            break;
          case "gelb":
            this.aktFarbe = this.init.farben.gelb;
            break;
          case "lila":
            this.aktFarbe = this.init.farben.lila;
            break;
          case "grau":
            this.aktFarbe = this.init.farben.grau;
            break;
          case "schwarz":
            this.aktFarbe = this.init.farben.schwarz;
            break;
          case "weiss":
            this.aktFarbe = this.init.farben.weiss;
            break;
          default:
            console.log("Falsche Farbe:" + p_farbe);
        }
      },

      /**
       * Löscht die Zeichenfläche.
       * @function
       * @name $cc$.game.zeichnen#loeschen
       * @param {object} p_canvas - Zeichenfläche
       */
      loeschen : function(p_canvas)
      {
        this.context.clearRect(0, 0, p_canvas.width, p_canvas.height);
      },

      /**
       * Setzt die aktuelle Linienstärke neu.
       * @function
       * @name $cc$.game.zeichnen#staerkeAuswahl
       * @param {string} p_linienstaerke - gewählte Linienstärke
       */
      staerkeAuswahl: function(p_linienstaerke)
      {
        switch(p_linienstaerke)
        {
          case "duenn":
            this.aktStaerke = this.init.linienstaerken.duenn;
            break;
          case "normal":
            this.aktStaerke = this.init.linienstaerken.normal;
            break;
          case "breit":
            this.aktStaerke = this.init.linienstaerken.breit;
            break;
          case "fett":
            this.aktStaerke = this.init.linienstaerken.fett;
            break;
          default:
            console.log("Falsche Stärke:" + p_linienstaerke);
        }
      },

      /**
       * Lässt ein Aufgeben-Popup erscheinen.
       * @function
       * @name $cc$.game.zeichnen#aufgeben
       */
      aufgeben : function()
      {
        alert('Der Zeichner gibt auf! Zeichenrunde wird beendet!');
      }
  };

  /** Platziert die Klasse im Package */
  $cc$.game.zeichnen = Zeichnen;

}(this.$cc$, this.document));