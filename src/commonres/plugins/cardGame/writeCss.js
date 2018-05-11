define(function() {
	/**
	 * [将css通过js写入页面样式表]
	 */
	function Css() {
		var me = this;
		/**
    		* [addCss 添加样式类]
    		* @param  {[string]} name 			[样式名]
    		* @param  {[object]} style 			[样式对象]
    		* @return {[void]}            		[description]
    	*/
		me.addCss = function(name, style) {
			var css = me._toCssString(name, style);
			me._addInSheet(css);
		};
		/**
    		* [addAnimation 添加动画样式类]
    		* @param  {[string]} name 			[样式名]
    		* @param  {[object]} style 			[样式对象]
    		* @return {[void]}            		[description]
    	*/
		me.addAnimation = function(name, style) {
			var css = me._toAnimationString(name, style);
			me._addInSheet(css);
		};
		/**
    		* [_toCssString 将样式对象转换成字符串]
    		* @param  {[string]} name 			[样式名]
    		* @param  {[object]} style 			[样式对象]
    		* @return {[string]}            	[样式字符串]
    	*/
		me._toCssString = function(name, style) {
			var css = [];
			for (var i in style) {
				css.push(i + ':' + style[i] + ';');
			}
			return name + '{' + css.join('') + '}';
		};
		/**
    		* [_toAnimationString 将动画样式对象转换成字符串]
    		* @param  {[string]} name 			[动画名]
    		* @param  {[object]} styles 		[样式对象]
    		* @return {[string]}            	[动画样式字符串]
    	*/
		me._toAnimationString = function(name, styles) {
			var css = [];
			for (var i in styles) {
				var style = [];
				for (var j in styles[i]) {
					style.push(j + ':' + styles[i][j] + ';');
				}
				css.push(i + '%{' + style.join('') + '}');
			}
			return '@keyframes ' + name + '{' + css.join('') + '}';
		};
		/**
    		* [_addInSheet 写入样式表]
    		* @param  {[string]} style 			[样式字符串]
    		* @return {[void]}            		[description]
    	*/
		me._addInSheet = function(style) {
			document.styleSheets.item(0).insertRule(style, 0);
		};
	}
	return new Css();
});