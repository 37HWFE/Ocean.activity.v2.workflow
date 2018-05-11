define(["jquery","ocean"],function($,ocean){
	return function(){
		var commonPath = "//" +  window.location.host + "/static/html/mheaders/";
		var me = this;
		//override
		this.templateUrl = "";
		this.loadTemplate = function(callback){
			$.get(commonPath + this.templateUrl,function(headerTemplate){
				callback(headerTemplate);
			})
		};

		//需要給callback 传用来解析模版的数据，如果没有，就传一个空对象。
		//override
		this.getInitRenderParams = function(callback){

		};

		
		/*
		@param selector 渲染的选择器
		*/
		this.render = function(selector,template,callback,platformConfig){
			me.getInitRenderParams(function(data){
				var html = ocean.template(template)(data);
				$(selector).html(html);
				callback(true)
			},platformConfig);
		}

		//用来监听事件、初始化的公有方法
		//override
		this.ready = function(){

		}
	}
})