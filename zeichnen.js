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
   */
  function zeichnen(main)
  {
    this.canvas = document.getElementById("zeichenflaeche");
    this.context = this.canvas.getContext("2d");
    this.isDown = false; // ist die Maustaste noch gedrückt

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
      this.context.stroke();
    }
  };

  // Im Package platzieren
  $cc$.game.zeichnen = zeichnen;

}(this.$cc$, this.document));
