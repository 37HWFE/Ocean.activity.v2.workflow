define(function(require, exports, module) {
	var $ = require('ocean').query;
	var Timer = require('reqanimframeAnimate');

	var Switchs = function(opts){
		this.config = {
			pageNum: opts.pageNum,
			during: opts.during,
			lock: opts.lock || 0
		} 

		this.el = {
			$pages: opts.$pages,
			$page: opts.$page
		}

		this.state = {
			isCss3: false,
			isSwitching: false,
			pageDirect: 0,  // -1:向下翻页, 1:向上翻页, 0:不翻页
			prevPage: 0,
			currPage: 1,
			pageHeight: this._getPageHeight(),
			device: this._getDevice(),
			scrollTimer: null,
			prevScrollTop: null
		}

		if(opts.css3){
			this.state.isCss3 = true;
			this.config.css3 = opts.css3;
		}
	}

	Switchs.prototype._getDevice = function(){
		if(/Android\s+([\d.]+)/.test(window.navigator.userAgent)){
			return 'android'
		}else if(/(?:iPad|iPhone).*OS\s([\d_]+)/.test(window.navigator.userAgent)){
			return 'iOS';
		}else{
			return 'PC';
		}
	}

	Switchs.prototype._getScreenHeight = function(){
		return $(window).height();;
	}

	Switchs.prototype._getPageHeight = function(){
		return this.el.$page.height();
	}

	Switchs.prototype._getMaxScrollLen = function(){
		return this._getPageHeight() - this._getScreenHeight() - 10;
	}

	Switchs.prototype._onSwitch = function(){
		var me = this;
		var during = this.config.during;
		var pageHeight = this.state.pageHeight;
		var isSwitching = this.state.isSwitching;
		
		var direct = this.state.pageDirect;
		if(direct == 0) return;

		if(isSwitching) return;  // 正在翻页
		this.state.isSwitching = true;

		var curr = this.state.currPage;
		var num = this.config.pageNum;
		var len = 0;

		if(direct == -1 && curr < num){ // 下一页
			len = pageHeight * curr * direct;
			this.state.currPage ++;
		}else if(direct == 1 && curr > 1){ // 上一页
			len = (2 - curr) * pageHeight;
			this.state.currPage --;
		}

		if((curr == 1 && len == 0) || (curr == num && len == 0))  { // 端点页面
			this.state.isSwitching = false;
			return;
		};

		this.state.prevPage = curr;

		var timer = new Timer(null,during);
		timer.onFinished = function(){
			$('body').scrollTop(0);
			me.onFinished({
				currPage: me.state.currPage,
				prevPage: me.state.prevPage
			});
		};
		timer.start();

		// 翻页动画
		if(this.state.isCss3){
			this.el.$pages.addClass(this.config.css3).css({'transform':'translateY(' + len + 'px)'}); 
		}else{ // reqanimframe
		}

		this.onProcess({
			currPage: this.state.currPage,
			prevPage: this.state.prevPage
		});

		// 动画持续时间设置为1s，允许切换的开关周期设置为4s，可以避免mac下，每次滚动至当前页的头部或者底部时就被翻页
		setTimeout(function(){
			me.state.isSwitching = false;
		},during+this.config.lock);
	}

	Switchs.prototype.onFinished = function(){
		console.log('switching page done.');
	}

	Switchs.prototype.onProcess = function(args){
		console.log('onProcess jsut execute once.')
	}

	Switchs.prototype.switchNextPage = function(){
		this.state.pageDirect = -1;
		this._onSwitch();
	}

	Switchs.prototype.switchPrevPage = function(){
		this.state.pageDirect = 1;
		this._onSwitch();
	}

	Switchs.prototype.switchToPage = function(index){
		if(!index) return;
		var me = this;
		var during = this.config.during;
		var pageHeight = this.state.pageHeight;
		var isSwitching = this.state.isSwitching;

		if(isSwitching) return;  // 正在翻页
		this.state.isSwitching = true;

		var len = -(pageHeight * (index-1));

		this.state.prevPage = this.state.currPage;

		this.state.currPage = parseInt(index);

		var timer = new Timer(null,during);
		timer.onFinished = function(){
			$('body').scrollTop(0);
			me.state.isSwitching = false;
			me.onFinished({
				currPage: me.state.currPage,
				prevPage: me.state.prevPage
			});
		};
		timer.start();

		// 翻页动画
		if(this.state.isCss3){
			this.el.$pages.addClass(this.config.css3).css({'transform':'translateY(' + len + 'px)'}); 
		}else{ // reqanimframe
		}

		this.onProcess({
			currPage: this.state.currPage,
			prevPage: this.state.prevPage
		});
	}

	Switchs.prototype.switchPage = function(delta){
        this.state.pageDirect = 0;
		if(!this._isScrollDone(delta)) return;
		this._onSwitch();
	}

	Switchs.prototype._isScrollDone = function(delta){
		var maxScrollLen = this._getMaxScrollLen();
        var currScrollTop = $('body').scrollTop();

        if(delta <= 0 && currScrollTop >= maxScrollLen){
			this.state.pageDirect = -1;
			return true;
		}else if(delta >= 1 && currScrollTop == 0){
			this.state.pageDirect = 1;
			return true;
		}

		if(this.state.prevScrollTop == currScrollTop && currScrollTop != 0){
			this.state.pageDirect = -1;
			return true;
		}else if(this.state.prevScrollTop == currScrollTop && currScrollTop == 0){
			this.state.pageDirect = 1;
			return true;
		}

        if(this.state.device == 'android' && !this.state.scrollTimer){ // 针对android的兼容
        	var me = this;
        	this.state.scrollTimer = new Timer(null,20);
			this.state.scrollTimer.onFinished = function(){
				me.state.scrollTimer = null;
				me.state.prevScrollTop = currScrollTop;
			};
			this.state.scrollTimer.start();
        }
        return false;
	}

	module.exports = Switchs; 
});