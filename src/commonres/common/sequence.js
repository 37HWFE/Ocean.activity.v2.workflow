define(function() {
  var Sequence = function(_opts) {
    var __self = this;
    this.timer = null;
    this.tmpImg = new Image();

    // 获取id和该dom元素
    this.id = _opts.id; // 必须值，值为目标id
    this.target = document.getElementById(this.id); // 获取该对象

    // 获取标签设置属性值
    this.src = this.target.getAttribute('data-src'); // 必须值，值为目标的背景图地址
    this.frames = parseInt(this.target.getAttribute('data-frames'), 10); // 必须值，值为目标的帧数
    this.isLoop = eval(this.target.getAttribute('data-loop')); // 必须值，默认值为true，即无限循环播放
    this.looptime = parseInt(this.target.getAttribute('data-looptime'), 10) || 200; // 非必须，为播放速率，默认值为200

    // 键名检查
    this._checkKeys({
      id: this.id,
      src: this.src,
      frames: this.frames
    });
    // 键值类型检查
    /*this._checkValues({
      id: this.id,
      src: this.src,
      frames: this.frames
    });*/

    // 动态获取图片宽高
    this.tmpImg.src = this.src;
    this.tmpImg.onload = function() {
      __self.width = __self.tmpImg.width / __self.frames;
      __self.height = __self.tmpImg.height;

      // 设置目标形状和背景图
      __self._setSharpAndBg();
    }
  };

  /**
   * 键名检查
   * @param {object} _opts - the object need to check.
   * @return {boolean} The result of the check.
   */
  Sequence.prototype._checkKeys = function(_opts) {
    var isCheck = true;
    var keys = ['id', 'src', 'frames'];
    for (var i = 0; i < keys.length; i++) {
      if (!_opts.hasOwnProperty(keys[i]) && i < keys.length) {
        isCheck = false;
        alert('Sequence初始化参数有误，请重新检查参数。')
        return false;
      }
    }
  };

  /**
   * 键值检查
   * @param {object} _opts - the object need to check.
   * @return {boolean} The result of the check.
   */
  Sequence.prototype._checkValues = function(_opts) {
    var isCheck = true;
    var types = ['string', 'string', 'number'];
    var idx = 0;
    for (var key in _opts) {
      if (typeof _opts[key] !== types[idx] && idx < types.length) {
        isCheck = false;
        alert('Sequence初始化参数值的类型有误，请重新检查参数。')
        return false;
      }
      idx++;
    }
  };

  /**
   * 设置目标形状和背景图
   * @return {boolean} The result of the set.
   */
  Sequence.prototype._setSharpAndBg = function() {
    this.target.style.width = this.width;
    this.target.style.height = this.height;
    this.target.style.background = 'url("' + this.src + '") 0px 0px no-repeat'; // 设置为第一帧
    return true;
  };

  /**
   * 启动序列图动画
   * @return {boolean} The result of the start.
   */
  Sequence.prototype.start = function() {
    var that = this;
    if (that.timer) return;
    this.currframe = 1;
    that.timer = setInterval(function() {
      if (that.currframe < that.frames) {
        that.target.style.backgroundPosition = -(that.currframe * parseInt(that.width, 10)) + 'px center';
        that.currframe++;
      } else {
        that.currframe = 1;

        // 只循环1次
        if (!that.isLoop) {
          that.stop();
        }
      }
    }, that.looptime);
    return true;
  };

  /**
   * 关闭序列图动画
   * @return {boolean} The result of the stop.
   */
  Sequence.prototype.stop = function() {
    clearInterval(this.timer);
    return true;
  };

  return Sequence;
});
