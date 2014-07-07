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
        clear = document.getElementById("clearBtn"),
        duenn = document.getElementById("duennBtn"),
        normal = document.getElementById("normalBtn"),
        breit = document.getElementById("breitBtn"),
        fett = document.getElementById("fettBtn"),
        aufgeben = document.getElementById("aufgebenBtn");
    
    this.canvas = document.getElementById("zeichenflaeche");
    this.context = this.canvas.getContext("2d");
    this.isDown = false; // ist die Maustaste noch gedrückt
    this.init = p_init;
    this.aktFarbe = p_init.farben.schwarz;
    this.aktStaerke = p_init.linienstaerken.normal;
   
    // Buttonlistener
    rot.addEventListener("click", (function()
    {
      this.farbAuswahl("rot");
      p_app.publishfarbauswahl("rot");
    }).bind(this));
    
    gruen.addEventListener("click", (function()
    {
      this.farbAuswahl("gruen");
      p_app.publishfarbauswahl("gruen");
    }).bind(this));
    
    blau.addEventListener("click", (function()
    {
      this.farbAuswahl("blau");
      p_app.publishfarbauswahl("blau");
    }).bind(this));
    
    gelb.addEventListener("click", (function()
    {
      this.farbAuswahl("gelb");
      p_app.publishfarbauswahl("gelb");
    }).bind(this));
    
    lila.addEventListener("click", (function()
    {
      this.farbAuswahl("lila");
      p_app.publishfarbauswahl("lila");
    }).bind(this));
    
    grau.addEventListener("click", (function()
    {
      this.farbAuswahl("grau");
      p_app.publishfarbauswahl("grau");
    }).bind(this));
    
    schwarz.addEventListener("click", (function()
    {
      this.farbAuswahl("schwarz");
      p_app.publishfarbauswahl("schwarz");
    }).bind(this));
    
    weiss.addEventListener("click", (function()
        {
          this.farbAuswahl("weiss");
          p_app.publishfarbauswahl("weiss");
        }).bind(this));
    
    clear.addEventListener("click", (function()
    {
      this.clear(this.canvas);
      p_app.publishclear();
    }).bind(this));
    
    duenn.addEventListener("click", (function()
    {
      this.staerkeAuswahl("duenn");
      p_app.publishstaerkeauswahl("duenn");
    }).bind(this));
    
    normal.addEventListener("click", (function()
    {
      this.staerkeAuswahl("normal");
      p_app.publishstaerkeauswahl("normal");
    }).bind(this));
    
    breit.addEventListener("click", (function()
    {
      this.staerkeAuswahl("breit");
      p_app.publishstaerkeauswahl("breit");
    }).bind(this));
    
    fett.addEventListener("click", (function()
    {
      this.staerkeAuswahl("fett");
      p_app.publishstaerkeauswahl("fett");
    }).bind(this));
    
    aufgeben.addEventListener("click", (function(){
      this.aufgeben();
      p_app.publishaufgeben();
    }).bind(this));
    
    // Mauslistener
    document.addEventListener("mousedown", (function(event)
    {
      var mousePos = this.getMousePos(event, this.canvas);
      this.begin(mousePos);
      this.isDown = true;
      p_app.publishmousedown(mousePos);
    }).bind(this));

    document.addEventListener("mousemove", (function(event)
    {
      if (this.isDown)
      {
        var mousePos = this.getMousePos(event, this.canvas);
        this.moveOn(mousePos);
        p_app.publishmousemove(mousePos);
      }
    }).bind(this));

    document.addEventListener("mouseup", (function(event)
    {
      this.isDown = false;
    }).bind(this));
  };

  Zeichnen.prototype =
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
    getMousePos : function(p_event, p_canvas)
    {
      var rect = p_canvas.getBoundingClientRect();
      return {
        x : p_event.clientX - rect.left,
        y : p_event.clientY - rect.top
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
    begin : function(p_mousePos)
    {
      this.context.beginPath();
      this.context.moveTo(p_mousePos.x, p_mousePos.y);
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
    moveOn : function(p_mousePos)
    {
      this.context.lineTo(p_mousePos.x, p_mousePos.y);
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
     * @method
     * @name  $cc$.game.zeichnen#clear
     * 
     * Setzt die Zeichenfläche zurück.
     */
    clear : function(p_canvas)
    {
      this.context.clearRect(0, 0, p_canvas.width, p_canvas.height);
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
  $cc$.game.zeichnen = Zeichnen;

}(this.$cc$, this.document));