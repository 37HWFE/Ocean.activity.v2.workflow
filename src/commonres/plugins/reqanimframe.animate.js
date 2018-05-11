define(function(require, exports, module) {
	function Animation(doms, dur){
		this.doms = doms;
		this.dur = dur;
		this.easing = function(p){return p};
	}

	Animation.prototype.onFinished = function(){
		console.log('animation finished');
	}

	Animation.prototype.onProgress = function(p){
		// console.log('animation playing: ' + p);
	}

	// 兼容处理
	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = (function(){
		return  window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
	}

	// window.requestAnimationFrame = (function(){
	// return function( callback ){
	// 			window.setTimeout(callback, 1000 / 60);
	// 		};
	// })();

	Animation.prototype.start = function(){
		this.p = 0;
		this.startTime = Date.now();

		var self = this;
		requestAnimationFrame(function f(){
			if(self.p >= 1){
				self.onProgress(self.easing(1.0));
				self.onFinished();
			}else{
				self.p = (Date.now() - self.startTime) / self.dur;
				self.onProgress(self.easing(self.p));
				requestAnimationFrame(f);
			}
		});  
	}

	module.exports = Animation; 
});