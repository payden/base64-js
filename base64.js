/* Author: Payden Sutherland <payden@paydensutherland.com>
   Feel free to hotlink the version at http://paydensutherland.com/base64.js


Usage:

var encoded = Base64.encode("test");
var decoded = Base64.decode(encoded);

*/

if (typeof window.Base64 === "undefined") {
  window.Base64 = {
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
        num = bytes[i].charCodeAt(0);
        output += this.base64chars[num >> 2];
        output += this.base64chars[(num & 0x3) << 4];
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

    decode: function(b64str) {
      if (b64str.length & 3) {
        console.log("String is not a multiple of four, invalid Base64 or no padding.");
        return false;
      }
      var count = b64str.length >> 2;
      var str = "";
      for (var i = 0; i < count; i++) {
        var start = i * 4;
        str += this.decodeQuad(b64str.slice(start, start + 4));
      }
      return str;
    },

    decodeQuad: function(quad) {
      if (quad.length != 4) {
        console.log("decodeQuad passed character array length != 4");
        return false;
      }
      var matches = quad.match(/\=/g);
      if (matches && matches.length == 2) {
        return String.fromCharCode(this.base64chars.indexOf(quad[0]) << 2 | this.base64chars.indexOf(quad[1]) >> 4);
      } else if (matches && matches.length == 1) {
        var num = this.base64chars.indexOf(quad[0]) << 10 |
            this.base64chars.indexOf(quad[1]) << 4  |
            this.base64chars.indexOf(quad[2]) >> 2;
        return String.fromCharCode((num >> 8) & 0xff) + String.fromCharCode(num & 0xff);
      }
      var num = this.base64chars.indexOf(quad[0]) << 18 |
          this.base64chars.indexOf(quad[1]) << 12 |
          this.base64chars.indexOf(quad[2]) << 6  |
          this.base64chars.indexOf(quad[3]);
      var str = Array(3);
      for (var i = 2; i >=0; i--) {
        str[i] = String.fromCharCode(num & 0xff);
        num >>= 8;
      }
      return str.join("");
    }
  }
}
