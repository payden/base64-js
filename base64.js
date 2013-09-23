Base64 = function() {
  //nothing to see here.
}

Base64.prototype = {
  base64chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

  encode: function(data) {
    var bytes = data.match(/[\x00-\xff]/g);
    var len = bytes.length;
    var i = 0;
    var output = "";
    while (parseInt(len / 3, 10) > 0) {
      len -= 3;
      output += this.encodeTriplet(bytes.slice(i, i+3));
      i += 3;
    }
    if (len == 2) {
      var num = 0;
      num = ((bytes[i].charCodeAt(0) << 8 | bytes[i+1].charCodeAt(0)) << 2); //two bits of padding.
      output += this.base64chars[num >> 12];
      output += this.base64chars[(num >> 6) & 0x3f];
      output += this.base64chars[num & 0x3f];
      output += "=";
    } else if (len == 1) {
      var num = 0;
      num = bytes[i].charCodeAt(0) << 4; //four bits padding
      output += this.base64chars[num >> 6];
      output += this.base64chars[num & 0x3f];
      output += "==";
    }
    return output;
  },

  encodeTriplet: function(bytes) {
    var num = 0;
    var output = new Array(4);
    if (bytes.length != 3) {
      console.log("Bytes passed doesn't equal 3");
      return false;
    }
    num = (bytes[0].charCodeAt(0) << 16) | (bytes[1].charCodeAt(0) << 8) | bytes[2].charCodeAt(0);
    for(var i = 0; i < 4; i++) {
      output[3-i] = this.base64chars[num & 0x3f];
      num >>= 6;
    }
    return output.join("");
    
  },

  decode: function() {
  }
}
