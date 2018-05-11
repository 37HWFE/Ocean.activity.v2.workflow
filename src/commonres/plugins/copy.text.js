/*Usage: 

generator: 

var cp = new Clipboard({
              handlerID:  点击按钮的id
              textID: 复制目标的id
              isAttr: 是否需要复制目标的属性，默认为false
              type: 需要复制还是剪切，默认为复制
            });

cp.attach(tips) // tips传入希望提示语，默认为英文
            */

define(['clipboardmin'], function(Clipboard) {
  var ClipBoard = function(obj) {
    this.handlerID = obj.handlerID || null;
    this.textID = obj.textID || null;
    this.type = obj.type || 'copy';
    this.isAttr = obj.isAttr || false;
    this.isPlugin = true;
    this.isActive = false;

    var ua = window.navigator.userAgent;
    var is_IE = ua.match(/(rv:|msie )\d+/i);
    var IE_Version = is_IE ? parseInt(is_IE[0].split(/:| /g)[1]) : 9;
    if (IE_Version <= 8) {
      this.isPlugin = false;
    }
    var handlerObj = document.getElementById(obj.handlerID);
    if (typeof this.type === 'string') {
      handlerObj.setAttribute('data-clipboard-action', this.type)
    } else {
      throw error('type类型错误！');
    }
    if (!obj.isAttr && obj.textID) {
      handlerObj.setAttribute('data-clipboard-target', '#' + obj.textID);
    }
  }

  ClipBoard.prototype.attach = function(tips) {
    if (this.isActive) { // 对象已经被实例化
      return;
    }
    var tip = '复制';
    if (this.type === 'cut') {
      tip = '剪切';
    }
    this.isActive = true;

    // generate a default tips if no variable
    var info = tips || {
      "copySucc": "Copied",
      "copyFail": "Failed to copy",
      "tooLow": "please update your browser version"
    };
    if (this.isPlugin) {
      var clip = new Clipboard('#' + this.handlerID);
      clip.on('success', function(e) {
        if (info['copySucc']) {
          alert(info['copySucc']);
        }
      });
      clip.on('error', function(e) {
        if (info['copyFail']) {
          alert(info['copyFail']);
        }
      });
    } else if (window.attachEvent) {
      var self = this;
      var handlerObj = document.getElementById(this.handlerID);
      handlerObj.attachEvent('onclick', function() {
        var text = '';
        if (self.isAttr) { // 复制属性值
          text = handlerObj.getAttribute('data-clipboard-text');
        } else {
          var textObj = document.getElementById(self.textID);
          text = textObj.value || textObj.innerHTML;
        }
        window.clipboardData.setData('Text', text);
        if (info['copySucc']) {
          alert(info['copySucc']);
        }
      });
    } else {
      if (info['tooLow']) {
        alert(info['tooLow']);
      }
    }
  }

  return ClipBoard;
})
