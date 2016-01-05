/**
 * @class    pan
 * @author   Ariel Saldana / http://ahhriel.com
 * @function this executes automatically and defines pan and _ referencing pan.
 */
( function()
{
    'use strict';

    P.Tools.Pan = P.Core.Event_Emitter.extend(
    {
        static  : 'pan',

        options : {

        },

        construct : function( options )
        {
            this._super( options );
            return this;
        },

        on : function (el, eventName, handler)
        {
            if (el.addEventListener) {
              el.addEventListener(eventName, handler);
            }
            else {
              el.attachEvent('on' + eventName, function(){
                handler.call(el);
              });
            }
        },

        off : function(el, eventName, handler)
        {
          if (el.removeEventListener)
            el.removeEventListener(eventName, handler);
          else
            el.detachEvent('on'+ eventName, handler);
        },

        ready : function(fn)
        {
          if (document.readyState != 'loading'){
            fn();
          }
          else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
          }
          else {
            document.attachEvent('onreadystatechange', function(){
              if (document.readyState != 'loading')
                fn();
            })
          }
        },

        fadeIn : function(el)
        {
          var opacity = 0;

          el.style.opacity = 0;
          el.style.filter = '';

          var last = +new Date();
          var tick = function() {
            opacity += (new Date() - last) / 400;
            el.style.opacity = opacity;
            el.style.filter = 'alpha(opacity=' + (100 * opacity)|0 + ')';

            last = +new Date();

            if (opacity < 1) {
              (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
          };
          tick();
        },

        empty : function(el)
        {
          while(el.firstChild)
          el.removeChild(el.firstChild);
        }

    } );

    var pan = new P.Tools.Pan();

    // return pan;
    return (window.pan = window._ = pan)
    // return (P.tools.Pan)


} )(this);
