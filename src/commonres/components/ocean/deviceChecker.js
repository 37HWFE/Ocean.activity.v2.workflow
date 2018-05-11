define(function() {
  var userAgent = window.navigator.userAgent;
  var ua = userAgent.toLowerCase();
  return {
    isAndroid: function() {
      return ua.indexOf("android") > -1;
    },
    isIOS: function() {
      // return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      return ua.indexOf("iphone") > -1;
    },
    isWinPhone: function() {
      return !!navigator.userAgent.match(/Windows Phone/i);
    },
    isIpad: function() {
      return ua.indexOf("iPad") > -1;
    },
    isPhone: function() {
      return this.isAndroid() || this.isIOS() || this.isWinPhone() || this.isIpad();
    },
    getIOSVersion: function() {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
    },
    getDeviceResolution: function() {
      return {
        width: window.screen.availHeight,
        height: window.screen.availWidth
      };
    },
    supportCss: function(prop) {
      var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;
      if (prop in div.style) return true;

      prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
      });

      while (len--) {
        if (vendors[len] + prop in div.style) {
          // browser supports box-shadow. Do what you need.  
          // Or use a bang (!) to test if the browser doesn't.  
          return true;
        }
      }
      return false;
    },
    isRetina: function() {
      return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    },
    isIOS7: function() {
      return 7 === this.getIOSVersion();
    },
    isIOS8: function() {
      return 8 === this.getIOSVersion();
    },
    isIOS9: function() {
      return 9 === this.getIOSVersion();
    },
    getAndroidVersion: function() {
      ua = (ua || navigator.userAgent).toLowerCase();
      var match = ua.match(/android\s([0-9\.]*)/);
      return match ? match[1] : false;
    },
    isLessThanIE9: function() {
      return !!!document["querySelector"];
    },

    isLessThan10: function() {

    },

    isIE11: function() {
      return (/Trident\/7\./).test(navigator.userAgent);
    },

    isIE: function() {
      //IE11使用了和之前版本不一样的User-agent,需要单独判断
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      var msie = ua.indexOf("MSIE ") && this.isIE11();
      return msie > 0;
    },

    isSupportVideo: function() {
      var testEl = document.createElement("video");
      return !!testEl.canPlayType && testEl.canPlayType('video/mp4').replace(/no/, '');
    },

    getIEversion: function() {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
      } else {
        return 0;
      }
    },

    isWechat: function() {

    },
    getBrowserType: function() {

    },
    getBrowserVersion: function() {

    },
    getOsType: function() {

    },
    getOsVersion: function() {

    }
  };
});
