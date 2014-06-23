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
   * @name  $cc$.game.zeichnen
   * 
   * @param {Object} main
   *        Die Main-Klasse wird mitgegeben
   * @param {Object} init
   *        Die JSON-Datei
   */
  function zeichnen(main, init)
  {
    var rot = document.getElementById("rotBtn"),
        gruen = document.getElementById("gruenBtn"),
        blau = document.getElementById("blauBtn"),
        gelb = document.getElementById("gelbBtn"),
        lila = document.getElementById("lilaBtn"),
        grau = document.getElementById("grauBtn"),
        schwarz = document.getElementById("schwarzBtn"),
        weiss = document.getElementById("weissBtn"),
        clear = document.getElementById("clearBtn"),
        duenn = document.getElementById("duennBtn"),
        normal = document.getElementById("normalBtn"),
        breit = document.getElementById("breitBtn"),
        fett = document.getElementById("fettBtn"),
        aufgeben = document.getElementById("aufgebenBtn");
    
    this.canvas = document.getElementById("zeichenflaeche");
    this.context = this.canvas.getContext("2d");
    this.isDown = false; // ist die Maustaste noch gedrückt
    this.init = init;
    this.aktFarbe = init.farben.schwarz;
    this.aktStaerke = init.linienstaerken.normal;
   
    // Buttonlistener
    rot.addEventListener("click", (function()
    {
      this.farbAuswahl("rot");
      main.publishfarbauswahl("rot");
    }).bind(this));
    
    gruen.addEventListener("click", (function()
    {
      this.farbAuswahl("gruen");
      main.publishfarbauswahl("gruen");
    }).bind(this));
    
    blau.addEventListener("click", (function()
    {
      this.farbAuswahl("blau");
      main.publishfarbauswahl("blau");
    }).bind(this));
    
    gelb.addEventListener("click", (function()
    {
      this.farbAuswahl("gelb");
      main.publishfarbauswahl("gelb");
    }).bind(this));
    
    lila.addEventListener("click", (function()
    {
      this.farbAuswahl("lila");
      main.publishfarbauswahl("lila");
    }).bind(this));
    
    grau.addEventListener("click", (function()
    {
      this.farbAuswahl("grau");
      main.publishfarbauswahl("grau");
    }).bind(this));
    
    schwarz.addEventListener("click", (function()
    {
      this.farbAuswahl("schwarz");
      main.publishfarbauswahl("schwarz");
    }).bind(this));
    
    weiss.addEventListener("click", (function()
        {
          this.farbAuswahl("weiss");
          main.publishfarbauswahl("weiss");
        }).bind(this));
    
    clear.addEventListener("click", (function()
    {
      this.clear(this.canvas);
      main.publishclear();
    }).bind(this));
    
    duenn.addEventListener("click", (function()
    {
      this.staerkeAuswahl("duenn");
      main.publishstaerkeauswahl("duenn");
    }).bind(this));
    
    normal.addEventListener("click", (function()
    {
      this.staerkeAuswahl("normal");
      main.publishstaerkeauswahl("normal");
    }).bind(this));
    
    breit.addEventListener("click", (function()
    {
      this.staerkeAuswahl("breit");
      main.publishstaerkeauswahl("breit");
    }).bind(this));
    
    fett.addEventListener("click", (function()
    {
      this.staerkeAuswahl("fett");
      main.publishstaerkeauswahl("fett");
    }).bind(this));
    
    aufgeben.addEventListener("click", (function(){
      this.aufgeben();
      main.publishaufgeben();
    }).bind(this));
    
    // Mauslistener
    document.addEventListener("mousedown", (function(event)
    {
      var mousePos = this.getMousePos(event, this.canvas);
      this.begin(mousePos);
      this.isDown = true;
      main.publishmousedown(mousePos);
    }).bind(this));

    document.addEventListener("mousemove", (function(event)
    {
      if (this.isDown)
      {
        var mousePos = this.getMousePos(event, this.canvas);
        this.moveOn(mousePos);
        main.publishmousemove(mousePos);
      }
    }).bind(this));

    document.addEventListener("mouseup", (function(event)
    {
      this.isDown = false;
    }).bind(this));
  };

  zeichnen.prototype =
  {
    /**
     * @method
     * @name  $cc$.game.zeichnen#getMousePos
     * 
     * @param {Object} event
     *        Enthält das von einem Mausklick erzeugte Event.
     * @paran {Object} canvas
     *        Enthält die Zeichenfläche
     * 
     * Gibt die Mausposition relativ zur Zeichenfläche wieder.
     */
    getMousePos : function(event, canvas)
    {
      var rect = canvas.getBoundingClientRect();
      return {
        x : event.clientX - rect.left,
        y : event.clientY - rect.top
      };
    },

    /**
     * @method
     * @name  $cc$.game.zeichnen#begin
     * 
     * @param {Object} mousePos
     *        Enthält die Mausposition relativ zur Zeichenfläche.
     * 
     * Beginnt einen neuen Pfad.
     */
    begin : function(mousePos)
    {
      this.context.beginPath();
      this.context.moveTo(mousePos.x, mousePos.y);
    },

    /**
     * @method
     * @name  $cc$.game.zeichnen#moveOn
     * 
     * @param {Object} mousePos
     *        Enthält die Mausposition relativ zur Zeichenfläche.
     * 
     * Zeichnet den Pfad.
     */
    moveOn : function(mousePos)
    {
      this.context.lineTo(mousePos.x, mousePos.y);
      this.context.strokeStyle = this.aktFarbe;
      this.context.lineWidth = this.aktStaerke;
      this.context.stroke();
    },
    
    /**
     * @method
     * @name  $cc$.game.zeichnen#farbAuswahl
     * 
     * @param {Object} farbe
     *        Enthält welche Farbe ausgewählt wurde.
     * 
     * Setzt die aktuelle Farbe auf die ausgewählte Farbe.
     */
    farbAuswahl: function(farbe)
    {
      switch(farbe)
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
          console.log("Falsche Farbe:" + farbe);
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.zeichnen#clear
     * 
     * Setzt die Zeichenfläche zurück.
     */
    clear : function(canvas)
    {
      this.context.clearRect(0, 0, canvas.width, canvas.height);
    },
    
    /**
     * @method
     * @name  $cc$.game.zeichnen#staerkeAuswahl
     * 
     * @param {Object} staerke
     *        Enthält welche Stärke ausgewählt wurde.
     * 
     * Setzt die aktuelle Stärke auf die ausgewählte Stärke.
     */
    staerkeAuswahl: function(staerke)
    {
      switch(staerke)
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
          console.log("Falsche Stärke:" + staerke);
      }
    },
    
    /**
     * @method
     * @name  $cc$.game.zeichnen#aufgeben
     * 
     * Der Zeichner gibt auf.
     */
    aufgeben : function()
    {
      alert('Der Zeichner gibt auf! Zeichenrunde wird beendet!');
      //neue Runde!
    }
  };

  // Im Package platzieren
  $cc$.game.zeichnen = zeichnen;

}(this.$cc$, this.document));