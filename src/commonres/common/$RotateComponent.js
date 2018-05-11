define(function(require, exports, module) {


  var $ = require("jquery");

  require(['rotate']);


  /**
   * 请求接口
   * @param  {[type]} _args   请求参数 Object
   * @param  {[type]} _callback 回掉函数
   * @return {[type]}           没有返回值
   */
  function _luckRequest(_args, _callback) {
    $.ajax({
      url: _args.luckUrl,
      type: 'get',
      data: {
        name: _args.activityName,  //活动名称
        action: _args.activityAction  //活动接口名称
      },
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(infos) {
        _callback && _callback instanceof Function ? _callback(infos) : "";
      }
    });
  }

  /**
   * 把礼包id转换成对象匹配方式
   * @param  {[type]} _arr 礼包id的数组
   * @return {[type]}      返回id对应页面转动的位置
   */
  function _getLuckListsMap(_arr) {
    var length = _arr && _arr.length || [].length;

    if (length <= 0) return false;

    var oj = {};

    for (var i = 0; i < length; i++) {
      var val = _arr[i];

      oj[val] = i + 1;
    }

    return oj;
  }

  var Luck = function(_args) {

    var me = this;

    me.lucking = false;



    me.beginAngle = 0;

    me.duration = _args && _args.duration || 5500; //这里是转动时间。。。就写过默认值吧，
    me.rotateDefaultTime = _args && _args.rotateDefaultTime || 4; //默认转动多少圈
    me.rotateDefault = me.rotateDefaultTime * 360; //默认转动角度


    me.lottyTime = _args && _args.lottyTime || 0; //剩余的抽奖次数，

    //**注意如果填写了这个值，那么抽奖的次数计算方式是不一样的
    //**也就是会通过这个值来判断今天最多能抽多少次奖，那么lottyTime这个值就会被忽略啦
    me.maxLottyTime = _args && _args.maxLottyTime || 0; //抽奖的最多次数，
    me.myLottyTime = _args && _args.myLottyTime || 0; //如果上面的值maxLottyTime填写了，那么这个值也必须填写


    me.luckCallback = _args && _args.luckCallback || ""; //抽奖的回掉,如论失败与否都会调用
    me.luckAnimationCallback = _args && _args.luckAnimationCallback || ""; //抽奖成功并且转动转盘完毕之后的回调

    me.luckUrl = _args && _args.luckUrl || ""; //抽奖对接地址
    me.activityName = _args && _args.activityName || ""; //活动名称
    me.activityAction = _args && _args.activityAction || ""; //活动抽奖动作

    me.btnId = _args && _args.btnId || "J_luck_btn"; //活动抽奖动作

    me.$luckbtn = $('#' + me.btnId);

    var packageIdLists = _args && _args.packageIdLists || []; //把礼包id按照页面上顺时针礼包排放的顺序以数组的方式传入

    me.packageNum = packageIdLists.length;

    me.luckLists = { //根据奖品id设置的转动次数
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5
    };

    var mapLists = _getLuckListsMap(packageIdLists);

    me.luckLists = mapLists && mapLists || me.luckLists;
  };

  /**
   * 更新剩余的抽奖次数
   * @param  {[type]} _num 剩余的抽奖次数
   * @return {[type]}      没有返回值
   */
  Luck.prototype.updateLottyTime = function(_num) {
    var me = this;

    me.lottyTime = _num || me.lottyTime;
  }

  /**
   * 判断是否还有抽奖机会
   * 如果有设置最大抽奖次数，那么就会根据今天的已经抽奖次数来判断，
   * 否则根据剩余抽奖的次数来计算
   * @return {[type]} 没有返回值
   */
  Luck.prototype.checkLottyTime = function() {
    var me = this;

    if (me.maxLottyTime !== 0) {
      return me.myLottyTime >= me.maxLottyTime;
    }

    return me.lottyTime <= 0;
  }

  /**
   * 抽獎
   * @return {[type]} 没有返回值
   */
  Luck.prototype.lucks = function() {
    var me = this;

    if (me.lucking) return;

    //判断今天是否还有抽奖机会
    if (me.checkLottyTime()) {
      me.luckCallback({
        result: 0,
        code: -90001
      });
      return;
    }

    me.lucking = true;


    var callback = function(_infos) {
      var lists = [];
      if (_infos.result == 1) {
        var giftId = _infos.data && _infos.data.BALL || 0;

        me.lottyTime += 1;
        me.myLottyTime += 1;

        me.luckAnimation(giftId);

      } else {

        me.lucking = false;
      }

      var luckCallback = me.luckCallback;

      luckCallback && luckCallback instanceof Function ? luckCallback(_infos) : "";

    };

    _luckRequest({
      luckUrl: me.luckUrl,
      activityName: me.activityName,
      activityAction: me.activityAction
    }, callback);
  }

  /**
   * 抽奖动画
   * @param  {[type]} _id   礼包的id
   * @return {[type]}       没有返回值
   */
  Luck.prototype.luckAnimation = function(_id) {
    var me = this;
    var angle = 0;

    var time = me.luckLists[_id] || 0;

    var beginAngle = me.beginAngle;
    var duration = me.duration;
    var rotateDefault = me.rotateDefault;

    angle = time * (360 / me.packageNum);

    me.$luckbtn.stopRotate();

    me.$luckbtn.rotate({
      angle: beginAngle,
      duration: duration,
      animateTo: angle + rotateDefault,
      callback: function() {
        me.lucking = false;

        me.beginAngle = angle;

        var luckAnimationCallback = me.luckAnimationCallback;

        luckAnimationCallback && luckAnimationCallback instanceof Function ? luckAnimationCallback(_id) : "";
      }
    });
  }


  return Luck;
});
