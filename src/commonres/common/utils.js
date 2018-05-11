define(function() {
  function Utils() {
    // 控制控制台开关，通过参数?log=1进行启动，默认为0
    this.turnOnLogger = parseInt(this.getParam('log'), 10) === 1 ? true : false;
  }

  /**
   * 获取当前页面链接的参数
   * @param {string} name - the param need to find.
   * @return {string} The result of the find.
   */
  Utils.prototype.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (r != null) return unescape(r[2]);
    return null;
  };

  /**
   * 解析制定链接的参数，以object的形式返回解析结果
   * @param {string} url - the param need to parse.
   * @return {object} The result of the parse params.
   */
  Utils.prototype.urlParams = function(url) {
    var args = {};
    var url = url || window.location.href;
    // 取查询字符串，以 & 符分开成数组
    var pairs = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var pairsLen = pairs.length;

    for (var i = 0; i < pairsLen; i++) {
      // 查找 "name=value" 对，若不成对，则跳出循环继续下一对
      var pos = pairs[i].indexOf('=');
      if (pos == -1) continue;

      // 取参数名，參數值
      var argname = pairs[i].substring(0, pos);
      var value = pairs[i].substring(pos + 1);

      // 存成对象的一个属性
      args[argname] = decodeURIComponent(value);
    }
    return args;
  };

  /**
   * 设置cookie
   * @param {string} name - key name.
   * @param {string} value - value name.
   * @param {string} days - expires time,default days.
   * @return {null} The result of the setCookie.
   */
  Utils.prototype.setCookie = function(name, value, days) {
    var days = days || 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    // exp.setTime(exp.getTime() + 10*1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  };

  /**
   * 通过键名获取Cookie
   * @param {string} name - key name.
   * @return {string} The result of the getCookie.
   */
  Utils.prototype.getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  };

  /**
   * 通过键名删除Cookie
   * @param {string} name - key name.
   * @return {string} The result of the delCookie.
   */
  Utils.prototype.delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
  };

  /**
   * 动态添加js脚本
   * @param {string} src - script source.
   * @return {null} The result of the appendScript.
   */
  Utils.prototype.appendScript = function(src) {
    var randNum = Math.random();
    var docmentHead = document.getElementsByTagName('head')[0];
    var infoScript = document.createElement("script");
    infoScript.type = "text/javascript";
    infoScript.src = src + "?r=" + randNum;
    docmentHead.appendChild(infoScript);
  };


  /**
   * 获取对象属性个数
   * @param {object} object - which object neet to count.
   * @return {number} The result of the getPropertyCount.
   */
  Utils.prototype.getPropertyCount = function(object) {
    var i, count = 0;
    if (typeof object !== "object") {
      return false;
    } else {
      for (i in object) {
        if (object.hasOwnProperty(i)) {
          count++;
        }
      }
    }
    return count;
  };

  /**
   * 遍历元素是否在数组中
   * @param {object} key - which value neet to test.
   * @param {object} arr - which array neet to test.
   * @return {boolean} The result of the inArray.
   */
  Utils.prototype.inArray = function(key, arr) {
    if (!arr instanceof Array) {
      return false;
    } else {
      for (var i = 0, k = arr.length; i < k; i++) {
        if (key === arr[i]) {
          return true;
        }
      }
      // 如果不在数组中就会返回false
      return false;
    }
  };

  /**
   * 过滤字符串中的html标签和空白
   * @param {string} str - which string neet to test.
   * @return {string} The result of the new string.
   */
  Utils.prototype.removeHtmlTag = function(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
    return str;
  };

  /**
   * 检测当前浏览器是否支持fixed
   * @return {boolean} The result of the isSupportFixed.
   */
  Utils.prototype.isSupportFixed = function() {
    var userAgent = window.navigator.userAgent,
      ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
      ios5below = ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) < 5),
      operaMini = /Opera Mini/i.test(userAgent),
      body = document.body,
      div, isFixed;

    div = document.createElement('div');
    div.style.cssText = 'display:none;position:fixed;z-index:100;';
    body.appendChild(div);
    isFixed = window.getComputedStyle(div).position != 'fixed';
    body.removeChild(div);
    div = null;

    return !!(isFixed || ios5below || operaMini);
  };


  /**
   * 控制台输出
   * @param {string} a - which string neet to log.
   * @param {string} b - which string neet to log.
   * @param {string} c - which string neet to log.
   * @param {string} d - which string neet to log.
   * @param {string} e - which string neet to log.
   * @return {null} The result of the log.
   */
  Utils.prototype.log = function(a, b, c, d, e) {
    if (this.turnOnLogger) {
      if (typeof console !== 'undefined' && console.log) {
        try {
          console.log.apply(console, Array.prototype.slice.call(arguments));
        } catch (e) {
          switch (arguments.length) {
            case 0:
              console.log();
              break;
            case 1:
              console.log(a);
              break;
            case 2:
              console.log(a, b);
              break;
            case 3:
              console.log(a, b, c);
              break;
            case 4:
              console.log(a, b, c, d);
              break;
            case 5:
              console.log(a, b, c, d, e);
              break;
          }
        }
      }
    }
  };

  /**
   * 获取当前时间，返回格式为 00:00:00
   * @return {string} The result of the getTime.
   */
  Utils.prototype.getTime = function() {
    var date = new Date(),
      hours, minutes, seconds;
    date.getHours() < 10 ? hours = "0" + date.getHours() : hours = date.getHours();
    date.getMinutes() < 10 ? minutes = "0" + date.getMinutes() : minutes = date.getMinutes();
    date.getSeconds() < 10 ? seconds = "0" + date.getSeconds() : seconds = date.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
  };

  /**
   * 字符串十进制转十六进制
   * @param {string} str - which string neet to transform.
   * @return {string} The result of the decToHex.
   */
  Utils.prototype.decToHex = function(str) {
    var res = [];
    for (var i = 0; i < str.length; i++)
      res[i] = ("000" + str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u" + res.join("\\u");
  };

  /**
   * 字符串十六进制转十进制
   * @param {string} str - which string neet to transform.
   * @return {string} The result of the hexToDec.
   */
  Utils.prototype.hexToDec = function(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
  };

  /**
   * 生成唯一id值
   * @return {string} The result of the genUid.
   */
  Utils.prototype.genUid = function() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
  };

  // 对外暴露utils实例
  // module.exports = new Utils();
  return Utils;
});
