define(['./writeCss'], function(css) {
	/**
	 * [配置翻牌效果的相关css动画]
	 */
	function CardCss() {
		var me = this;
		/**
		 * [setStateClass 设置普通样式类]
		 * @param  {[string]} value 			[样式类名标识]
		 * @param  {[string]} img 				[牌正面图片地址]
		 * @param  {[int|string]} time 			[翻牌动画时间]
		 * @return {[void]}            			[description]
		 */
		me.setStateClass = function(value, img, time) {
			// 获取预设的样式
			var style = me._getDefaultClassStyle(img, time, value);
			// 写入样式表
			me._writeClassInStyleSheet(style, value);
		};
		/**
		 * [setAnimationClass 设置动画样式类]
		 * @param  {[string]} value 			[样式类名标识]
		 * @param  {[string]} img 				[牌正面图片地址]
		 * @param  {[string]} bg 				[牌背面图片地址]
		 * @return {[void]}            			[description]
		 */
		me.setAnimationClass = function(value, img, bg) {
			// 获取预设的动画样式
			var style = me._getDefaultAnimationStyle(bg, img);
			// 写入样式表
			me._writeAnimationInStyleSheet(style, value);
		};
		/**
		 * [_writeClassInStyleSheet 将普通样式写入样式表]
		 * @param  {[object]} obj 				[样式类对象]
		 * @param  {[int|string]} index 		[样式类名标识]
		 * @return {[void]}            			[description]
		 */
		me._writeClassInStyleSheet = function(obj, index) {
			for (var name in obj) {
				css.addCss('.' + name + index, obj[name]);
			}
		};
		/**
		 * [_writeAnimationInStyleSheet 将动画样式写入样式表]
		 * @param  {[object]} obj 				[样式类对象]
		 * @param  {[int|string]} index 		[样式类名标识]
		 * @return {[void]}            			[description]
		 */
		me._writeAnimationInStyleSheet = function(obj, index) {
			for (var name in obj) {
				css.addAnimation(name + index, obj[name]);
			}
		};
		/**
		 * [_getDefaultClassStyle 获取预设的普通样式]
		 * @param  {[string]} img 				[牌正面图片地址]
		 * @param  {[int|string]} time 			[翻牌动画时间]
		 * @param  {[int|string]} i 			[样式类名标识]
		 * @return {[object]}            		[普通样式对象]
		 */
		me._getDefaultClassStyle = function(img, time, i) {
			// 预设样式
			var defaultClassStyle = {
				'autoClass': {
					animation: 'autoClass' + i + ' ' + time + 's'
				},
				'disapperClass': {
					animation: 'disapperClass' + i + ' ' + time + 's',
					'animation-fill-mode': 'forwards'
				},
				'autoOpen': {
					animation: 'autoOpen' + i + ' ' + time + 's',
					'animation-fill-mode': 'forwards'
				},
				'cardImg': {
					background: "url('" + img + "') no-repeat top center !important"
				},
				'hidden': {
					visibility: 'hidden'
				}
			};
			return defaultClassStyle;
		};
		/**
		 * [_getDefaultAnimationStyle 获取预设的动画样式]
		 * @param  {[string]} bg 				[牌背面图片地址]
		 * @param  {[string]} img 				[牌正面图片地址]
		 * @return {[object]}            		[动画样式对象]
		 */
		me._getDefaultAnimationStyle = function(bg, img) {
			// 预设动画样式
			var defaultAnimationStyle = {
				// 自动开合
				autoClass: {
					0: {
						transform: "rotateY(0deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					20: {
						transform: "rotateY(90deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					21: {
						background: "url('" + img + "') no-repeat top center",
					},
					41: {
						transform: "rotateY(0deg)",
					},
					59: {
						transform: "rotateY(0deg)",
					},
					79: {
						transform: "rotateY(90deg)",
						background: "url('" + img + "') no-repeat top center",
					},
					80: {
						background: "url('" + bg + "') no-repeat top center",
					},
					100: {
						transform: "rotateY(0deg)",
						background: "url('" + bg + "') no-repeat top center",
					}
				},
				// 自动打开，然后隐藏
				disapperClass: {
					0: {
						transform: "rotateY(0deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					20: {
						transform: "rotateY(90deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					21: {
						background: "url('" + img + "') no-repeat top center",
					},
					41: {
						transform: "rotateY(0deg)",
					},
					59: {
						transform: "rotateY(0deg)",
						opacity: "1",
					},
					100: {
						opacity: "0",
						visibility: 'hidden',
						background: "url('" + img + "') no-repeat top center",
					}
				},
				// 自动打开，不关闭
				autoOpen: {
					0: {
						transform: "rotateY(0deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					50: {
						transform: "rotateY(90deg)",
						background: "url('" + bg + "') no-repeat top center",
					},
					51: {
						background: "url('" + img + "') no-repeat top center",
					},
					100: {
						transform: "rotateY(0deg)",
						background: "url('" + img + "') no-repeat top center"
					}
				}
			};
			return defaultAnimationStyle;
		};
	}
	return new CardCss();
});