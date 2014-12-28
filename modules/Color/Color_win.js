module.exports = (function() {
  var $ = process.bridge.dotnet;
  var utilities = require('Utilities');
  var $color = $.System.Windows.Media.Color;

  function Color(type) {
    if(type instanceof Color) { 
      this.native = type.native;
    } else if(type.pointer) 
      this.native = type;
    } else {
      var rgba = utilities.parseColor(type);
      this.native = $color.FromArgb($.System.Convert.ToByte(Math.round(rgba.a*255)),$.System.Convert.ToByte(Math.round(rgba.r)),$.System.Convert.ToByte(Math.round(rgba.g)),$.System.Convert.ToByte(Math.round(rgba.b)));
    }
  }
  Object.defineProperty(Color.prototype, 'red', { get:function() { return parseInt(this.native.R.ToString())/255; }});
  Object.defineProperty(Color.prototype, 'blue', { get:function() { return parseInt(this.native.B.ToString())/255; }});
  Object.defineProperty(Color.prototype, 'green', { get:function() { return parseInt(this.native.G.ToString())/255; }});
  Object.defineProperty(Color.prototype, 'alpha', { get:function() { return parseInt(this.native.A.ToString())/255; }});

  return Color;
})();
