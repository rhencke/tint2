module.exports = (function() {
  if(global.__TINT.FileInput) {
    return global.__TINT.FileInput;
  }

  var $ = process.bridge.objc;
  var util = require('Utilities');
  var Control = require('Control');
  /**
   * @class FileInput
   * @description Creates a new file input control.
   * @extends Control
   */
  /**
   * @new
   * @memberof FileInput
   * @description Creates a new FileInput control.
   */
  /**
   * @event select
   * @memberof FileInput
   * @description Fires when a user selects the a file or set of files. 
   */
  /**
   * @event cancel
   * @memberof FileInput
   * @description Fires when a user cancels the selection. 
   */
  function FileInput(options) {
    this['_checkInterval'] = null;
    this['_currentUrl'] = null;
    options = options || {};
    options.delegates = options.delegates || [];
    options.delegates = options.delegates.concat([
      ['pathControl:willDisplayOpenPanel:', 'v@:@@', 
        function(sender, cmd, pathControl, openPanel) {
          openPanel('setDelegate', this.nativeView);
          this['_checkInterval'] = setInterval(function() {
            var url = this.nativeView('URL');
            if(this['_currentUrl'] !== url) {
              this.fireEvent('select');
              clearInterval(this['_checkInterval']);
            }
          }.bind(this), 1000);
        }.bind(this)]
    ]);

    this.nativeClass = this.nativeClass || $.NSPathControl;
    this.nativeViewClass = this.nativeViewClass || $.NSPathControl;
    Control.call(this, options);
    this.nativeView('setDelegate',this.nativeView);
    this.native('setPathStyle', 2); // 2 = NSPathStylePopUp
    this.private.allowedFileTypes = null;
  }

  FileInput.prototype = Object.create(Control.prototype);
  FileInput.prototype.constructor = FileInput;

  /**
   * @member allowFileTypes
   * @type {array}
   * @memberof FileInput
   * @description Gets or sets an array containing the file types (by extension) that are allowed.
   */
  util.def(FileInput.prototype, "allowFileTypes",
    function() { return this.private.allowedFileTypes; },
    function(items) { 
      console.assert(Array.isArray(items));

      this.private.allowedFileTypes = items;
      var arr = $.NSMutableArray('arrayWithCapacity',items.length);
      items.forEach(function(item,i) {
        if(item === "folder") {
          item = "public.folder";
        }
        arr('insertObject',$(item),'atIndex',i); 
      });
      this.nativeView('cell')('setAllowedTypes',arr);
    }
  );

  /**
   * @member location
   * @type {string}
   * @memberof FileInput
   * @description Gets or sets the location or file name of the file selected in the control.
   */
  util.def(FileInput.prototype, 'location', 
    function() {
      var url = this.nativeView('URL');
      return url === null ? null : url('absoluteURL')('description')('UTF8String');
    },
    function(value) {
      this.nativeView('setURL', $.NSURL('fileURLWithPath', $(value)));
    }
  );

  global.__TINT.FileInput = FileInput;
  return FileInput;
})();