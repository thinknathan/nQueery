var nQueery;

(function (window, document) {
  //var nQueery;
  //nQueery = $ = function (selector) {
  nQueery = function (selector) {
    return new NQueery(selector);
  };

  var NQueery = function (selector) {
    var nodes;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if (!selector) {
      return this;

      // HANDLE: $(DOMElement), $(window), $(document)
    } else if (selector.nodeType || selector === window || selector === document) {
      this[0] = selector;

      // HANDLE: Strings
    } else {
      var listOfComplexCharacters = /\[|\ |\:\>|\~|\+/;
      //var bothClassAndID = /(\#+.*[\.])|(\.+.*[\#])/;
      var isComplex = listOfComplexCharacters.test(selector) // || bothClassAndID.test(selector);
      var maybeID = selector[0] === '#';
      var maybeClass = selector[0] === '.';

      // HANDLE: Complex selectors
      if (isComplex) {
        //console.log('Using querySelectorAll');
        nodes = document.querySelectorAll(selector);
        // HANDLE: #ids
      } else if (maybeID) {
        // Kill the # character at start of string
        //console.log('Using getElementById');
        selector = selector.substr(1);
        nodes = document.getElementById(selector);
        // HANDLE: .classes
      } else if (maybeClass) {
        // Kill the . character at start of string
        //console.log('Using getElementsByClassName');
        selector = selector.substr(1);
        nodes = document.getElementsByClassName(selector);
        // HANDLE: tags
      } else {
        //console.log('Using getElementsByTagName');
        nodes = document.getElementsByTagName(selector);
      }

      if (!nodes) {
        return this;
      }

      if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          this[i] = nodes[i];
        }
      } else {
        this[0] = nodes;
      }
    }

    this.length = nodes && nodes.length || 1;
    return this;

  };

  // Expose the prototype object via nQueery.fn so methods can be added later
  nQueery.fn = NQueery.prototype;

  nQueery.fn.each = function (func) {
    for (var i = 0; i < this.length; i++) {
      var functionThatIsCalled = func.call(this, i, this[i]);
      if (functionThatIsCalled === true) return true;
      else if (functionThatIsCalled === false) return false;
    }
    return this;
  }


})(window, document);