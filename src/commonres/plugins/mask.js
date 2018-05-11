/*遮罩
name：
date:2015-4-23
*/
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], function($) {
      return factory($);
    });
  } else {
   
    window.Mask = factory($);
  }
}(function($) {
	/**
	 * [mask 遮罩类]
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	var time=1000000;
	function Mask(el,closeCallback) {
		this.pop=el;
		this.closeCallback=function(){
			
		}
		
	}
	Mask.prototype = {
		open: function(callback) {
			var that=this;
			var date=new Date();
			time++;
			this.time=time;
			this.popWrap=document.createElement('div');
			this.popWrap.className='popWrap';
			this.popWrap.style.zIndex=this.time;
			this.mask=document.createElement('div');
			this.mask.className='mask';
			var popWidth=$(this.pop).outerWidth();
			var popHeight=$(this.pop).outerHeight();

			$(this.popWrap).css({'position':'fixed','top':0,'left':0,'right':0,'bottom':0,'overflow':'auto'});
			$(this.mask).css({'position':'fixed','top':0,'left':0,'right':0,'bottom':0,'background':'#000','opacity':0.5,'display':'none'});
			$(this.pop).css({
				'display':'none',
				'position':'absolute',
				'top':'50%',
				'left':'50%',
				'margin-top':-popHeight/2,
				'margin-left':-popWidth/2
			});
			
			$(this.pop).wrap(this.popWrap);
			$(this.pop).before(this.mask);
			$(this.pop).fadeIn(function(){
				if(typeof callback=='function'){
					callback();
				}
			});
			$(this.mask).fadeIn();
			$(this.popWrap).fadeIn();
			$(this.mask).bind('click',function(event) {
				that.close(that.closeCallback);
				
			});
			$(this.pop).find('.close').bind('click',function(){
				that.close(that.closeCallback);
			});
		},
		close: function(callback) {
				var that=this;
				$(this.mask).fadeOut(function(){
					$(this).remove();
					$(that.pop).unwrap();


				});
				$(this.pop).fadeOut(function(){
					if(typeof callback=='function'){
						callback();
					}
				});

		}
	}
	return Mask;
}));


