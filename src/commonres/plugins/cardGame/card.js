define(['ocean', 'reqanimframeAnimate', './cardCss'], function(ocean, Timer, cardCss) {

	/**
	 * [有翻转效果的牌组件]
	 * @param  {[object]} params 		[初始化参数]
	 * {
	 * 	  id: 牌的id,
	 *	  value: 牌的值,
	 *	  target: 牌对应的元素,
	 *	  img: 牌正面图片地址,
	 *	  bg: 牌背面图片地址,
	 *	  animationTime: 翻牌动画的时间
	 * }
	 */
	function Card(params) {
		var me = this;

		me.id = params.id; // 牌的id
		me.value = params.value; // 牌的值
		me.target = params.target; // 牌对应的元素
		me.img = params.img; // 牌正面图片地址
		me.bg = params.bg; // 牌背面图片地址
		me.animationTime = params.animationTime || 2; // 翻牌动画的时间
		/**
		 * [init 初始化组件]
		 * @param  {[boolean]} isOnlyOpen 		[是否只打开牌]
		 * @param  {[boolean]} unEvent 			[是否不初始化事件]
		 * @return {[void]}            			[description]
		 */
		me.init = function(isOnlyOpen, unEvent) {
			// 数据校验
			me._checkInitParams();
			// 设置牌的静态样式
			cardCss.setStateClass(me.value, me.img, me.animationTime);
			// 如果浏览器支持动画，则设置牌的动画样式
			if (me._supportCssAnimation()) {
				cardCss.setAnimationClass(me.value, me.img, me.bg);
			}
			// 如果不需要绑定事件（unEvent为true），则不执行事件绑定
			!!unEvent ? false : me._initEvents(isOnlyOpen)
		};
		/**
		 * [_initEvents 初始化默认事件]
		 * @param  {[boolean]} isOnlyOpen 		[是否不自动关闭牌]
		 * @return {[void]}            			[description]
		 */
		me._initEvents = function(isOnlyOpen) {
			me.target.on('click', function() {
				me.open(isOnlyOpen);
			});
			if (!isOnlyOpen) {
				me.target.on('webkitAnimationEnd', function() {
					me.resetCardClass();
				});
				me.target.on('animationEnd', function() {
					me.resetCardClass();
				});
			}
		};
		/**
		 * [init 初始化组件]
		 * @param  {[boolean]} isOnlyOpen 		[是否不自动关闭牌]
		 * @param  {[function]} callback 		[打开牌后执行]
		 * @return {[void]}            			[description]
		 */
		me.open = function(isOnlyOpen, callback) {
			// 如果浏览器支持动画，则添加动画样式类名，否则添加静态样式类名
			if (me._supportCssAnimation()) {
				// 如果不需要自动关闭（unclose为true），则添加只有打开动画的样式类名
				var className = !!isOnlyOpen ? 'autoOpen' : 'autoClass';
				me.target.addClass(className + me.value);
			} else {
				me.target.addClass('cardImg-' + me.value);
				// 如果不需要自动关闭（isOnlyOpen为true），则不执行自动清除
				!!isOnlyOpen ? false : me._setTimeHidden()
			}
			typeof callback === 'function' ? callback() : false
		};
		/**
		 * [_setTimeHidden 设置自动清除牌样式定时器]
		 * @return {[void]}            			[description]
		 */
		me._setTimeHidden = function() {
			// 设置定时器，针对不支持动画的浏览，实现自动重置牌的状态
			var time = new Timer(null, me.animationTime * 500);
			time.onFinished = function() {
				me.resetCardClass();
			};
			time.start();
		};
		/**
		 * [resetCardClass 移除所有相应翻牌的样式名]
		 * @return {[void]}            			[description]
		 */
		me.resetCardClass = function() {
			me.target.removeClass('autoClass' + me.value + ' cardImg-' + me.value);
		};
		/**
		 * [hiddenCard 将牌隐藏]
		 * @return {[void]}            			[description]
		 */
		me.hiddenCard = function() {
			me.resetCardClass();
			// 根据不同的浏览器添加不同的样式类名
			if (me._supportCssAnimation()) {
				me.target.addClass('disapperClass' + me.value);
			} else {
				me.target.addClass('hidden' + me.value);
			}
		};
		/**
		 * [_supportCssAnimation 判断是否支持css动画]
		 * @return {[boolean]}            		[description]
		 */
		me._supportCssAnimation = function() {
			var style = document.documentElement.style;
			for (var i in style) {
				if (i === 'animation') {
					return !(ocean.deviceChecker.isIE() || ocean.deviceChecker.isIOS());
				}
			}
			return false;
		};
		/**
		 * [reset 重置牌的所有样式]
		 * @return {[void]}            			[description]
		 */
		me.reset = function() {
			me.target.removeClass('autoClass' + me.value + ' cardImg-' + me.value + ' disapperClass' + me.value + ' hidden' + me.value);
		};
		/**
		 * [_checkInitParams 数据校验提示]
		 * @return {[void]}            			[description]
		 */
		me._checkInitParams = function() {
			try {
				if (!(me.id + 1) || typeof me.id !== 'number') {
					throw '请输入类型为int的id值';
				}
				if (!(me.value + 1) || (typeof me.id !== 'number' && typeof me.value !== 'string')) {
					throw '请输入类型为int或string的id值';
				}
				if (!me.target || typeof me.target !== 'object') {
					throw '请输入类型为object的target值';
				}
				if (!me.img || typeof me.img !== 'string') {
					throw '请输入类型为string的img值';
				}
				if (!me.bg || typeof me.bg !== 'string') {
					throw '请输入类型为string的bg值';
				}
			} catch (err) {
				console.log("Error: " + err + ".");
			}
		};
	}

	return Card;
});