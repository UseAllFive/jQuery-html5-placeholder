// HTML5 placeholder plugin version 1.01
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php
//
// Enables cross-browser HTML5 placeholder for inputs, by first testing
// for a native implementation before building one.
//
//
// USAGE:
//$('input[placeholder]').placeholder();

// <input type="text" placeholder="username">
(function($){
  
  "use strict";
  
  //feature detection
  //first test for native placeholder support before continuing
  //feature detection inspired by ye olde jquery 1.4 hawtness, with paul irish
  var hasPlaceholder = 'placeholder' in document.createElement('input');
  
  //sniffy sniff sniff -- just to give extra left padding for the older
  //graphics for type=email and type=url
  var isOldOpera = $.browser.opera && $.browser.version < 10.5;

  $.fn.placeholder = function(options) {
    
    //merge in passed in options, if any
    options = $.extend(true, {}, $.fn.placeholder.defaults, options);
    //cache the original 'left' value, for use by Opera later
    var o_left = options.placeholderCSS.left,
    //decide if our custom behavior should be applied
        custom_el = !this.is('input');
        
    return (hasPlaceholder && !custom_el) ? this : this.each(function() {
      if ($(this).data('hasPlaceholder')) {
        return;
      }
      //local vars
      var $this = $(this),
          inputElement = (custom_el) ? options.customInputElement : $this,
          inputVal, inputWidth, inputHeight,
          //grab the inputs id for the <label @for>, or make a new one from Date
          inputId = (this.id) ? this.id :
            'placeholder' + (Math.floor(Math.random() * 1123456789)),
          placeholderText, placeholder,
          customLineHeight = $this.css('line-height');
      
      inputVal = $.trim(inputElement.val());
      if (custom_el) {
        //custom input setup
        placeholderText = $this.data('placeholder');
        placeholder = $('<span>')
          .attr('data-for', inputId)
          .addClass(options.placeholderClass+' '+$this.attr('class'));
        if (options.customVisibleCSS['line-height'] === '_preset') {
          options.customVisibleCSS['line-height'] = customLineHeight;
        }
      } else {
        placeholderText = $this.attr('placeholder');
        placeholder = $('<label>').attr('for', inputId);
        //stuff in some calculated values into the placeholderCSS object
        inputWidth = $this.width();
        inputHeight = $this.height();
        options.placeholderCSS['width'] = inputWidth;
        options.placeholderCSS['height'] = inputHeight;
        options.placeholderCSS['color'] = options.color;
        //adjust position of placeholder
        options.placeholderCSS.left = (!custom_el && isOldOpera &&
          (this.type == 'email' || this.type == 'url')) ?
          '11%' : o_left;
        placeholder.css(options.placeholderCSS);
      }
      placeholder.text(placeholderText);
    
      //place the placeholder
      $this
        .wrap(options.inputWrapper)
        .attr('id', inputId)
        .after(placeholder)
        .data('hasPlaceholder', true);
      
      //more custom input setup
      if (custom_el) {
        if (options.customContentEditable.invisibleCSS['height'] === '_stretch') {
          options.customContentEditable.invisibleCSS['height'] = placeholder.outerHeight();
        }
        $this
          .addClass(options.customInputClass)
          .css(options.customContentEditable.invisibleCSS);
        
      }
      
      //if the input isn't empty
      if (inputVal){
        placeholder.hide();
      }
      
      function contenteditableVal(val){
        return $('<div>').html(val).text();
      }
      
      //hide placeholder on focus
      $this.on('focus', function(){
        var val = custom_el ? contenteditableVal(inputElement.val()) :
                  inputElement.val();
        if (!$.trim(val).length) {
          if (custom_el) {
            placeholder.css(options.customInvisibleCSS);
            $this.css(options.customContentEditable.visibleCSS);
          } else {
            placeholder.hide();
          }
        }
      });
    
      //show placeholder if the input is empty
      $this.on('blur', function(){
        var val = custom_el ? contenteditableVal(inputElement.val()) :
                  inputElement.val();
        if (!$.trim(val).length) {
          if (custom_el) {
            placeholder.css(options.customVisibleCSS);
            $this.css(options.customContentEditable.invisibleCSS);
          } else {
            placeholder.show();
          }
        }
      });
    });
  };
  
  //expose defaults
  $.fn.placeholder.defaults = {
    //you can pass in a custom wrapper
    inputWrapper: '<span style="position:relative; display:block;"></span>',
    
    //more or less just emulating what webkit does here
    //tweak to your hearts content
    placeholderCSS: {
      'font':'0.75em sans-serif',
      'color':'#bababa',
      'position': 'absolute',
      'left':'5px',
      'top':'3px',
      'overflow-x': 'hidden',
			'display': 'block'
    },
    placeholderClass: 'placeholder',
    customInputElement: null,
    customInputClass: 'has-placeholder',
    customContentEditable: {
      visibleCSS: {
        'display': 'inline-block',
        'position': 'static',
        'width': 'auto',
        'height': 'auto'
      },
      invisibleCSS: {
        'display': 'block',
        'position': 'absolute',
        'height': '_stretch',
        'width': '100%',
        'z-index': 10
      }
    },
    customVisibleCSS: {
      'opacity': 1,
      'height': 'auto',
      'line-height': '_preset',
      'margin-left': 0,
      'position': 'static',
      'width': 'auto'
    },
    customInvisibleCSS: {
      'opacity': 0,
      'height': 0,
      'line-height': 0,
      'position': 'absolute',
      'width': 0
    }
  };
})(jQuery);