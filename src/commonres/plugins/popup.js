define(['jquery', 'ocean', 'writeCss'], function($, ocean, css) {
	function Popup() {
		var me = this; 

		me.isOpen = false; // 彈窗是否已經打開
		me.isOpenStaticMask = false; // 静态遮罩是否已經打開
		me.openPopupName = null; // 保存打開的彈窗ele

		/**
		 * [init 初始化]
		 * @param  {[string]} target 	[所有弹窗选择器]
		 * @return {[void]}            	[description]
		 */
		me.init = function(target) {
			// 如果传入的弹窗选择器正确，则初始化组件
			if (me._checkTarget(target)) {
				me._initTarget(target); // 初始化所有弹窗基础样式
				me._initMask(); // 初始化遮罩层
				me._initCloseEvent(); // 初始化关闭弹窗事件
			}
		};
		/**
		 * [executeLottery 開啟彈窗]
		 * @param  {[string]} ele 		[需要打开的弹窗的选择器]
		 * @param  {[function]} callback[打开弹窗后回调]
		 * @param  {[boolean]} isStatic [是否打开静态弹窗]
		 * @return {[void]}            	[description]
		 */
		me.open = function(ele, callback, isStatic) {
			// 如果已有弹窗打开，则更改打开的弹窗，否则，打开弹窗和遮罩
			!!me.isOpen ? me._exchangePopup(ele, isStatic) : me._openPopup(ele, isStatic);
			callback && callback instanceof Function ? callback() : '';
		};
		/**
		 * [executeLottery 返回上一個彈窗]
		 * @param  {[function]} callback[打开弹窗后回调]
		 * @return {[void]}            	[description]
		 */
		me.openPre = function(callback) {
			// 如果已有弹窗打开，则更改打开的弹窗
			!!me.openPopupName && me.isOpen ? me._exchangePopup(me.openPopupName) : '';
			callback && callback instanceof Function ? callback() : '';
		};
		/**
		 * [close 關閉彈窗]
		 * @return {[void]}            	[description]
		 */
		me.close = function() {
			$('.j-mask,.j-static-mask,' + me.target).css('display', 'none');
			me.isOpen = false;
			me.closeCallback && me.closeCallback instanceof Function ? me.closeCallback(me.openPopupName) : '';
		};
		/**
		 * [closeCallback 定义关闭弹窗后回调]
		 * @param  {[function]} fn 		[关闭弹窗后回调]
		 * @return {[void]}            	[description]
		 */
		me.closeCallback = function(fn) {
			me.closeCallback = fn;
		}
		/**
		 * [_openPopup 執行打開的彈窗]
		 * @param  {[string]} ele 		[需要打开的弹窗的选择器]
		 * @param  {[boolean]} isStatic [是否打开静态弹窗]
		 * @return {[void]}            	[description]
		 */
		me._openPopup = function(ele, isStatic) {
			// 判断打开哪种弹窗,并打开
			var maskType = !!isStatic ? '.j-static-mask' : '.j-mask';
			$(maskType + ',' + ele).css('display', 'block');
			me.isOpen = true; // 记录弹窗是否打开
			me.isOpenStaticMask = !!isStatic; // 记录静态遮罩是否打开
			me.openPopupName = ele; // 记录打开的是哪个弹窗
		};
		/**
		 * [_exchangePopup 交換打開的彈窗]
		 * @param  {[string]} ele 		[需要打开的弹窗的选择器]
		 * @param  {[boolean]} isStatic [是否打开静态弹窗]
		 * @return {[void]}            	[description]
		 */
		me._exchangePopup = function(ele, isStatic) {
			// 关闭原来的弹窗，打开新弹窗
			$(me.target).css('display', 'none');
			$(ele).css('display', 'block');
			// 判断前后的弹窗是否不同，若不同则更换
			!!isStatic === !me.isOpenStaticMask ? me._exchangeMask(isStatic) : '';
		};
		/**
		 * [_exchangeMask 更换遮罩]
		 * @param  {[boolean]} isStatic [是否打开静态弹窗]
		 * @return {[void]}            	[description]
		 */
		me._exchangeMask = function(isStatic) {
			var hideEle = isStatic ? '.j-mask' : '.j-static-mask';
			var showEle = isStatic ? '.j-static-mask' : '.j-mask';
			$(hideEle).css('display', 'none');
			$(showEle).css('display', 'block');
			me.isOpenStaticMask = !!isStatic; // 记录静态遮罩是否打开
		};
		/**
		 * [_initMask 插入遮罩dom]
		 * @return {[void]}            	[description]
		 */
		me._initMask = function() {
			var mask = '<div class="j-mask mask"></div>';
			var staticMask = '<div class="j-static-mask mask"></div>';
			// 插入到dom
			$('body').append(mask, staticMask);
		};
		/**
		 * [_initCloseEvent 初始化關閉事件]
		 * @return {[void]}            	[description]
		 */
		me._initCloseEvent = function() {
			$('.j-mask').on('click', function() {
				me.close();
			});
		};
		/**
		 * [_initTarget 初始化彈窗元素]
		 * @return {[void]}            	[description]
		 */
		me._initTarget = function(target) {
			me.target = target;
			me._initStyle();
			$(me.target).addClass('popup');
		};
		/**
		 * [_initStyle 初始化彈窗、遮罩樣式]
		 * @return {[void]}            	[description]
		 */
		me._initStyle = function() {
			var popupStyle = {
				position: 'fixed',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0,
				margin: 'auto',
				display: 'none',
				'z-index': 1001,
			}
			var maskStyle = {
				position: 'fixed',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0,
				display: 'none',
				'background-color': 'black',
				opacity: 0.6,
				progid: 'DXImageTransform.Microsoft.Alpha(Opacity=60)',
				'z-index': 1000,
			}
			css.addCss('.popup', popupStyle);
			css.addCss('.mask', maskStyle);
		};
		/**
		 * [_checkTarget 檢查目標元素選擇器是否正確]
		 * @param  {[string]} popup 	[所有弹窗的选择器]
		 * @return {[type]}            	[description]
		 */
		me._checkTarget = function(popup) {
			try {
				var reg = /(\.|\#)/g;
				if (!!popup && reg.test(popup)) {
					return true;
				} else {
					throw '請輸入正確的選擇器,如：.j-popup';
					return false;
				}
			} catch (err) {
				console.log(err);
			}
		};

	}
	return new Popup();
});