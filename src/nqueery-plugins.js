(function ($, window, document) {



  // ***************************************************
  //
  // Utilities
  //
  // ***************************************************

  // METHOD: $.exists()
  // Evals whether or not the first element exists in the DOM. Non-iterative.
  $.fn.exists = function () {
    if (this.length) {
      return true;
    } else {
      return false;
    }
  }

  // METHOD: $.css()
  // Returns first element's CSS value. Non-iterative.
  $.fn.css = function (val) {
    return getComputedStyle(this[0])[val];
  }

  // METHOD: $.visible()
  // Checks element is visible. Iterative.
  // CSS display part might not be iterative? Should check.
  $.fn.visible = function () {
    // Returns true if it has the class, false otherwise
    return this.each(function (i) {
      return !!(this[i].width() || this[i].height()) && this.css("display") !== "none";
    });

  }


  // ***************************************************
  //
  // DOM Traversal
  //
  // ***************************************************

  // METHOD: $.find( 'Selector' )
  // Finds the selector inside the current elements. Iterative.
  $.fn.find = function (selector) {

    var newArrayofNodes = [];

    // For each current NQ object
    for (var i = 0; i < this.length; i++) {

      // Look for the selector inside
      var nodes = this[i].querySelectorAll(selector);
      if (nodes) {
        // For each node found
        for (var j = 0; j < nodes.length; j++) {
          // Push the DOM element into a new array
          newArrayofNodes.push(nodes[j]);
        }
      }
    }

    // If it found nothing, return an empty NQueery object
    if (!newArrayofNodes.length) return $();

    // For each DOM element in the new array
    for (var i = 0; i < newArrayofNodes.length; i++) {
      // Replace the current NQ object with the new DOM elements
      this[i] = newArrayofNodes[i];
    }

    // Update the length
    this.length = newArrayofNodes.length;

    return this;
  }




  // ***************************************************
  //
  // Class Manipulation
  //
  // ***************************************************

  // METHOD: $.hasClass( 'String' )
  // Checks if target has a class. Iterative.
  $.fn.hasClass = function (cls) {
    // Returns true if it has the class, false otherwise
    return this.each(function (i) {
      return this[i].classList.contains(cls);
    });
  }

  // METHOD: $.addClass( 'String' )
  // Adds the CSS class to the target. Iterative.
  $.fn.addClass = function (cls) {
    this.each(function (i) {
      this[i].classList.add(cls);
    });
    return this;
  }

  // METHOD: $.removeClass( 'String' )
  // Removes the CSS class from the target elements. Iterative.
  $.fn.removeClass = function (cls) {
    this.each(function (i) {
      this[i].classList.remove(cls);
    });
    return this;
  }

  // METHOD: $.toggleClass( 'String' )
  // Toggles the CSS class. Iterative.
  $.fn.toggleClass = function (cls) {
    console.log('toggleClass');
    this.each(function (i) {
      console.log('toggleClass loop');
      this[i].classList.toggle(cls);
    });
    console.log('toggleClass return');
    return this;
  }



  // ***************************************************
  //
  // Event Attachment
  //
  // ***************************************************

  // METHOD: $.attachEvent( 'Event Type', 'Function' )
  // Attaches an event to the target. Iterative.
  $.fn.attachEvent = function (eventType, handler) {
    // For each element in object
    this.each(function (i) {
      this[i].addEventListener(eventType, handler, false);
    });
    return this;
  }

  // METHOD: $.removeEvent( 'Event Type', 'Function' )
  // Removes an event from the target. Iterative.
  $.fn.removeEvent = function (eventType, handler) {
    // For each element in object
    this.each(function (i) {
      this[i].removeEventListener(eventType, handler, false);
    });
    return this;
  }

  // METHOD: $.one
  // Attaches event that activates once. Iterative.
  $.fn.one = function (eventType, handler) {
    this.each(function (i) {
      var scope = this;
      var oldHandler = handler;
      handler = function () {
        var args = arguments;
        oldHandler.apply(scope, args);
        scope.removeEvent.call(scope, eventType, handler);
      };
    });
    this.attachEvent.call(this, eventType, handler);
    return this;
  }



  // ***************************************************
  //
  // Evaluation Object Properties
  //
  // ***************************************************

  // METHOD: $.style( 'String', ['String'] )
  // Changes or returns the value of the specified style
  $.fn.style = function (sty, assign = null, unit = 'px', ele = this) {

    if (assign === '') {
      for (var i = 0; i < ele.length; i++) {
        ele[i].style.removeProperty(sty);
      }
    } else if (assign) {
      for (var i = 0; i < ele.length; i++) {
        //console.log('assign: ' + assign);
        if (!isNaN(assign)) {
          assign = assign.toString() + unit;
          //console.log('assign: ' + assign);
        }
        //console.log('sty: ' + sty);

        ele[i].style[sty] = assign;
      }
    } else {
      ele = ele[0];
      //console.log('not assign');
      return document.defaultView.getComputedStyle(ele, "").getPropertyValue(sty);
    }
    return this;
  }

  // METHOD: $.attr( 'String', ['String'] )
  // Changes, removes or returns the current attribute value
  $.fn.attr = function (name, value, ele = this[0]) {
    if (value === '') {
      ele.removeAttribute(name);
    } else if (value === null) {
      return ele.getAttribute(name);
    } else {
      ele.setAttribute(name, value)
    }
    return this;
  }

  // METHOD: $.width( 'String' )
  // Returns width including padding, everything
  $.fn.width = function (ele = this[0]) {
    if (ele === window || ele === document) {
      return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    } else {
      return ele.offsetWidth;
    }
  }

  // METHOD: $.height( 'String' )
  // Returns height including padding, everything
  $.fn.height = function (ele = this[0]) {
    if (ele === window || ele === document) {
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      //console.log('Height: ' + ele.offsetHeight);
      return ele.offsetHeight;
    }

  }

  // METHOD: $.scrollTop
  // To fix Chrome bug
  $.fn.documentScrollTop = function () {
    return (document.documentElement.scrollTop + document.body.scrollTop == document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
  }

  // METHOD: $.isMobile()
  // Returns true or false
  $.fn.isMobile = function (threshold = 481) {
    var docWidth = this.width.call(this, window);
    return docWidth < threshold;
  }


  // ***************************************************
  //
  // Manipulate DOM objects
  //
  // ***************************************************

  // METHOD: $.matchHeight( 'String' )
  // Takes objects in scope and makes them same height as targetString
  $.fn.matchHeight = function (targetString) {
    var ele = this;
    var target = $(targetString)[0];
    var targetHeight = this.height.call(this, target);
    //console.log('Match height');
    this.style.call(this, 'height', targetHeight, 'px', ele);

    return this;
  }



  // ***************************************************
  //
  // Number functions
  //
  // ***************************************************

  // METHOD: $.rand( Number, Number )
  // Returns a whole number between the first and last value provided
  $.fn.rand = function (low, high) {
    var i = Math.random();
    return Math.round(low + ((high - low) * i));
  }



  // ***************************************************
  //
  // Hash
  //
  // ***************************************************

  // METHOD: $.hash
  // Sets or retrieves hash from element
  $.fn.hash = function (set, ele = this) {
    var url;
    var href;

    if (!set) {
      if (ele[0] === window || ele[0] === document) {
        href = window.location.hash.substring(1);
        return href;
      } else if (ele[0].nodeType) {
        url = ele[0].getAttribute("href");
        if (url) {
          return url.substring(1);
        } else {
          return false;
        }

      } else if (typeof ele === 'string' || ele instanceof String) {
        return ele.substring(1);
      }

    } else {
      if (ele[0] === window || ele[0] === document) {
        url = window.location;
        if (url.href.indexOf('#') > -1) {
          window.location.hash += set;
        } else {
          window.location.href += '#';
          window.location.href += set;
        }

      } else if (ele[0].setAttribute) {
        for (var i = 0; i < ele.length; i++) {
          href = ele[i].getAttribute("href");
          ele[i].setAttribute("href", href + set);
        }
      }

      return this;
    }
  }


  // ***************************************************
  //
  // Delay, throttle or debounce events
  //
  // ***************************************************

  // METHOD: $.debounce
  // Only fires a function once in a period of time, no matter how many calls are made
  $.fn.debounce = function (func, delay) {
    //var args = arguments;

    clearTimeout(func._tId);

    func._tId = setTimeout(function () {
      //     func.apply(this, args);
      func();
    }, delay);
    return this;
  }

  // METHOD: $.throttle
  // Only fires a function at a certain rate
  $.fn.throttle = function (func, delay, scope) {
    var queeryScope = this;
    delay || (delay = 200);
    var last;
    var deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
        args = arguments;
      if (last && now < last + delay) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          func.apply(context, args);
        }, delay);
      } else {
        last = now;
        func.apply(context, args);
      }
      return queeryScope;
    };

  }

  // METHOD: $.delay
  // Delays execution of a function
  $.fn.delay = function (func, delay) {
    var tO = setTimeout(function () {
      func();
    }, delay);
    return this;
  }

  // METHOD: $.ready
  // Launches function when the document is done loading
  $.fn.ready = function (func) {
    if (document.readyState != 'loading') {
      func();
    } else {
      document.addEventListener('DOMContentLoaded', func);
    }
    return this;
  }



  // ***************************************************
  //
  // Query Strings
  //
  // ***************************************************

  // METHOD: $.getQuery
  // Get query strings from url
  $.fn.getQuery = function (name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }



  // ***************************************************
  //
  // zenscroll wrapper
  //
  // ***************************************************

  // METHOD: $.scrollTo
  // Smoothly scrolls vertically across the page
  $.fn.scrollTo = function (duration = 999, edgeOffset, func, target = this[0]) {

    if (zenscroll) {

      if (zenscroll.moving()) {
        zenscroll.stop();
      }

      if (edgeOffset) {
        zenscroll.setup(null, edgeOffset);
      }

      if (target.nodeType) {
        if (func) {
          zenscroll.to(target, duration, func);
        } else {
          zenscroll.to(target, duration);
        }
      } else if (!isNaN(target)) {
        if (func) {
          zenscroll.toY(target, duration, func);
        } else {
          zenscroll.toY(target, duration);
        }
      }

    }

    return this;
  }



  // ***************************************************
  //
  // Cookies
  //
  // ***************************************************

  // METHOD: $.getCookie
  // Get value of cookie
  $.fn.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // METHOD: $.setCookie
  // Adds value to cookie
  $.fn.setCookie = function (cname, cvalue, exdays, path = '/') {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
    return this;
  }



  /*
        // METHOD: $.each
        // Iterates through each object in the stack
        $.fn.each = function (obj, callback) {
          var length, i = 0;

          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          } else {
            for (i in obj) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          }

          return obj;
        }
  */

  // ***************************************************
  //
  // Ajax wrappers
  //
  // ***************************************************

  // METHOD: $.ajaxGet
  //
  $.fn.ajaxGet = function (ele = this) {
    if (window.ajax()) {
      var request = ajax({
        method: 'options',
        url: '/api/users',
        data: {
          user: 'john'
        }
      })
      return request;
    }
    return this;
  }

  // METHOD: $.ajaxPost
  //
  $.fn.ajaxPost = function (ele = this) {
    if (window.ajax()) {

    }
    return this;
  }

  // METHOD: $.ajaxSwap 
  //
  $.fn.ajaxSwap = function (ele = this) {
    if (window.ajax()) {

    }
    return this;
  }


})(nQueery, window, document);