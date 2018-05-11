/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-12 18:06:09
 * @version $Id$
 */

define(function(){

	/**
	 * 可配置初始化
	 * @param  {[type]} _ops 相关配置
	 * @return {[type]}      [description]
	 */
	var LazyImg = function(_ops){
		var defaults = {
			attr:"data-url",
			imgOj:".J_lazy_img",
			bgOj:".J_lazy_bg"
		};

		this.params = $.extend({},defaults,_ops||{});

		this.params.cache = [];
		this.params.data = [];
		this.params.container = $(window);

		this.init();
	};

	/**
	 * 初始化相关信息
	 * @return {[type]} [description]
	 */
	LazyImg.prototype.init = function(){
		var that = this;

		that.params.imgBoxs = $(this.params.imgOj);
		that.params.bgBoxs = $(this.params.bgOj);

		//变身
		$.each(that.params.imgBoxs,function(i,v){
			var box = $(v),
				url = box.attr(that.params.attr),
				isLoading = 0;

			that.params.data.push({
				box:box,
				url:url,
				isBg:false,
				isLoading:isLoading
			});
		});
		$.each(that.params.bgBoxs,function(i,v){
			var box = $(v),
				url = box.attr(that.params.attr),
				isLoading = 0;

			that.params.data.push({
				box:box,
				url:url,
				isBg:true,
				isLoading:isLoading
			});
		});

		that.params.container.on("scroll",function(){
			that.load();
		});

		//初始化的时候先来一波
		this.load();
	}

	/**
	 * 加载
	 * @return {[type]} [description]
	 */
	LazyImg.prototype.load = function(){
		var that = this;

		var loadImg = function(_v){
			var img = document.createElement("img");
			var item = that.params.cache[_v], 
				box = item.box,
				url = item.url,
				isBg = item.isBg;

				// item.isLoading = 1;
				if(url == ""){
					that.params.cache.splice(_v,1);
					return;
				}
				//图片加载完成了就删掉
				img.onload = function(){
					if(isBg){//懒加载背景图
						box.css("background-image","url("+url+")");
					}else{//懒加载图片
						box.attr("src",url);
					}
				}

				//如果加载失败需要重新从缓存队列中提出来进去loading队列
				img.onerror = function(){
					// item.isLoading = 0;
					that.params.data.push(item);
				}

				img.src = url;
		};
		for(var v = 0;v < that.params.data.length;v++){
			//延迟加载的对象相关信息
			var item = that.params.data[v],
				box = item.box,
				isLoading = item.isLoading;

				if(!!!box){
					continue;
				}
			//计算的相关信息
			var win = that.params.container,//页面
				contentHeight = win.height(),//页面高度
				contentTop = win.scrollTop(),//页面滚动高度
				boxTop = box.offset().top;//元素距离页面大小

				if(isLoading == 0){
					if((boxTop - contentTop) < contentHeight){//进入页面
						that.params.data.splice(v,1);
						v -= 1;
						//把需要加载的图像对象加进缓存队列
						//在缓存队列中进行操作
						that.params.cache.push(item);
						loadImg(that.params.cache.length - 1);
					}
				}
		}
	}

	return LazyImg;
});