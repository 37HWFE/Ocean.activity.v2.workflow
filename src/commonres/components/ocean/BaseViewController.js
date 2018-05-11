define(["templateEngine","./createClass"],function(templateEngine,createClass){
	 var factory = function(){

		this.templateEngine = templateEngine;

		function doListenEvents(events,type){
	        for(var selector in events){
	            $(document).on(type||"click",selector,events[selector]);
	        }
	    };

	    this.clickEvents = function(events){
	        doListenEvents(events,"click");
		};


		this.listenEvents = function(eventConfig){
			for(var type in eventConfig){
	            doListenEvents(eventConfig[type],type);
	        }
		};
	}
	return createClass(factory);
});