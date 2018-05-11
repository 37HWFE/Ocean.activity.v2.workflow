 define(function(require, exports, module) {

   function Marquee(args) {
     this.currentPosition = 0; //当前转动到哪个位置
     this.totalBoxNum = 0; //总共有多少个位置
     this.rollTimer = 0; //setTimeout的ID，用clearTimeout清除
     this.currentSpeed = args && args.rotateSpeed || 50; //转盘当前速度
     this.currentRollTimes = 1; //当前已经转动次数
     this.winPosition = -1; //中奖位置
     this.boxNum = args && args.boxNum || 8; //默认是8个格子
     this.rotateSpeed = args && args.rotateSpeed || 50; //初始转动速度
     this.cycle = args && args.cycle ? args.cycle == 1 ? args.cycle * this.boxNum : (args.cycle - 1) * this.boxNum : this.boxNum * 3; //转动几次到达抽奖位置
   }

   /**
    * [init 初始化dom结构]
    * @return {[type]} [description]
    */
   Marquee.prototype.init = function() {
     var $lottery = document.getElementById('lottery');
     var $units = document.getElementsByClassName('lottery-item');
     if ($units.length > 0) {
       this.obj = $lottery;
       this.totalBoxNum = $units.length;
       _addClass("lottery-item-" + this.currentPosition, "move");
     }
   }

   /**
    * [getLotteryCallBack 抽奖的回调函数]
    * @return {[type]} [description]
    */
   Marquee.prototype.getLotteryCallBack = function() {
     var me = this;
     console.log("中奖啦!");
   }


   Marquee.prototype.lottery = function(prizeIndex) {
     var me = this;
     this.currentRollTimes += 1;
     _roll.call(this); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
     var finished = this.currentRollTimes > this.cycle + 5 && this.winPosition == this.currentPosition;
     if (finished) {
       _resetSpeed.call(this);
     } else {
       _setChangeSpeed.call(this, prizeIndex);
       this.rollTimer = setTimeout(function() {
         me.lottery(prizeIndex);
       }, this.currentSpeed); //循环调用
     }
     return false;
   }

   var _addClass = function(eleId, className) {
     var el_currentBox = document.getElementById(eleId);
     var classVal = el_currentBox.getAttribute('class').concat(className);
     el_currentBox.setAttribute('class', classVal);
   }

   var _removeClass = function(eleId, className) {
     var el_currentBox = document.getElementById(eleId);
     classVal = el_currentBox.getAttribute('class').replace(className, "");
     el_currentBox.setAttribute("class", classVal);
   }

   var _roll = function() {
     var lottery = this.obj;
     _removeClass("lottery-item-" + this.currentPosition, "move")
     this.currentPosition += 1;
     if (this.currentPosition > this.totalBoxNum - 1) {
       this.currentPosition = 0;
     };
     _addClass("lottery-item-" + this.currentPosition, " move");
     return false;
   };

   /**
    * [resetSpeed 转盘速度重新初始化]
    * @return {[type]} [description]
    */
   var _resetSpeed = function() {
     clearTimeout(this.rollTimer);
     this.winPosition = -1;
     this.currentRollTimes = 0;
     this.currentSpeed = this.rotateSpeed;
     this.click = false;
     this.getLotteryCallBack();
   }


   /**
    * [resetSpeed 转盘速度变慢]
    * @return {[type]} [description]
    */
   var _setChangeSpeed = function(prizeIndex) {
     if (this.currentRollTimes < this.cycle) {
       this.currentSpeed -= 50;
     } else if (this.currentRollTimes == this.cycle) {
       this.winPosition = prizeIndex;
     } else {
       if (this.currentRollTimes > this.cycle + 5 && ((this.winPosition == 0 && this.currentPosition == 7) || this.winPosition == this.currentPosition + 1)) {
         this.currentSpeed += 110;
       } else {
         this.currentSpeed += 20;
       }
     }
     if (this.currentSpeed < this.rotateSpeed) {
       this.currentSpeed = this.rotateSpeed;
     };
   }

   module.exports = Marquee;

 });
