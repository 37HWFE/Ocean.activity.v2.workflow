define(["templateEngine","./BaseViewController","./myLocation","./deviceChecker",
	"./ajax","./createClass","./BaseModel","./BaseCollector","query","./BaseController"
	,"./BaseComponent"]
	,function(templateEngine,BaseViewController,myLocation,deviceChecker,
		Ajax,createClass,BaseModel,BaseCollector,query,BaseController
		,BaseComponent){
		
	var models = {};
	var collectors =  {};
	var controllers = {};
	var viewControllers = {};
	var components = {};

	var event = {
		events : {},
		ids : {
			length : 0
		},
		emit : function(type){
			for(var eventType in this.events){
				if(type == eventType){
					var ids = this.events[eventType];
					this.run(arguments,ids);
					return ;
				}
			}
		},
		run : function(args,callbackIds){
			var arg = Array.prototype.slice.call(args);
			arg.shift();
			for(var i = 0,len = callbackIds.length;i<len;i++){
				var id = callbackIds[i];
				var callback = this.ids[id];
				if("function" == typeof callback){
					callback.apply(callback,arg);
					return ;
				}
				if(callback["obaserve"] && "function" == typeof callback["obaserve"]){
					callback["obaserve"].apply(callback,arg);
				}
			}
		},
		bind : function(type,callback){
			var length = this.ids.length;
			this.ids[length] = callback;
			if(!this.events[type] ){
				this.events[type] = [];
			}
			this.events[type].push(length);
			return length++;
		},
		debind : function(id){
			delete this.ids[id];
			for(var eventType in this.events){
				ids = this.events[eventType];
				for(var i =0;i<ids.length;i++){
					if(id == ids[length]){
						ids.splice(i,1);
						return ;
					}
				}
			}
		}
	};

	var reflectionList = {
		"model":{
			containers : {},
			BaseParent : BaseModel
		},
		"collector" : {
			containers : {},
			BaseParent : BaseCollector
		},
		"viewController":{
			containers : {},
			BaseParent : BaseViewController
		},
		"controller":{
			containers : {},
			BaseParent : BaseController
		},
		"component":{
			containers : {},
			BaseParent : BaseComponent
		},

		/*
		@param type 对应的是以上的reflectionList 的属性
		@param id 类型所对应的组建、控制器、页面控制器、集合、model的名称
		@param factory 组建、控制器、页面控制器、集合、model的工厂方法
		@param argums 需要传给 factory 父类的参数
		@param parent 如果有这个参数不为空，则说明factory 需要继承这个类，否则继承上面配置所制定的类

		@return 创建的工厂同时这个工厂也会存在reflectionList对应的配置的类型的containers 中
		*/
		factory :  function(type,id,factory,argums,parent){
			var args = [].slice.call(argums,3);
			var factory_config = reflectionList[type];
			var containers = factory_config.containers;
			var BaseParent = factory_config.BaseParent;
	     	if(factory && "function" == typeof factory){
	     		if(parent && containers[parent]){
	     			args.unshift(id);
	     			args.unshift(containers[parent]);
	     			args.unshift(factory);
	     			containers[id] = createClass.apply(createClass,args);
	     		}else{
	     			args.unshift(id);
	     			args.unshift(BaseParent);
	     			args.unshift(factory);
	     			containers[id] = createClass.apply(createClass,args);
	     		}
	     	}
	     	return containers[id];
		}
	}


	function doListenEvents(events,type){
        for(var selector in events){
            $(document).on(type||"click",selector,events[selector]);
        }
    };	

	return {
        template : templateEngine.template,
        location : myLocation,
        deviceChecker : deviceChecker,
        query : query,
        ajax : new Ajax(query),
        createClass : createClass,
        BaseViewController : BaseViewController,
        BaseModel : BaseModel,
		merg : createClass.merg,
		clone : createClass.clone,
		debugMode : false,
		event : event,
        log : function(){
        	if(this.debugMode){
        		console.log.apply(console,arguments);
        	}
        },

        /*
        	function: 限制参数hackFucntion 函数的执行的频率 
			@parameter hackFucntion 被限制执行的函数
			@parameter time  每 time ms 执行一次hackFucntion。
        */
		debounce : function(hackFucntion, time) {

	         var canClick = true;
	         time = time || 800;
	         return function() {
	             if (canClick) {
	                 canClick = false;
	                 setTimeout(function() {
	                     canClick = true;
	                 }, time);
	                 return hackFucntion.apply(this, arguments);
	             }
	         };
	     },

	     //提供一个外部接口来设置jquery或者zepto
	    setQuery : function(query){
	     	this.query = query;
	     	this.ajax = new Ajax(query);
	    },

		viewController : function(view_controller_id,factory,parent){
			return  reflectionList.factory("viewController",view_controller_id,factory,arguments,parent);
		},

		controller : function(controller_id,factory,parent){
			return  reflectionList.factory("controller",controller_id,factory,arguments,parent);
		},

	    model : function(model_id,factory,parent){
	     	return  reflectionList.factory("model",model_id,factory,arguments,parent);
	    },

	    collector : function(collector_id,factory,parent){
	     	return reflectionList.factory("collector",collector_id,factory,arguments,parent);
	    },

	    component : function(component_id,factory,parent){
	     	return reflectionList.factory("component",component_id,factory,arguments,parent);
	    },

	    clickEvents : function(events){
	        doListenEvents(events,"click");
		},

		listenEvents : function(eventConfig){
			for(var type in eventConfig){
	            doListenEvents(eventConfig[type],type);
	        }
		}
	}
});