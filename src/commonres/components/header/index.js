define(function(){
	var Header = function(){
		var buildHeaderDirect = function(builder,selector,platformConfig){
			builder.loadTemplate(function(template){
				builder.render(selector,template,function(renderDone){
					if(renderDone){
						builder.ready();
					}
				},platformConfig);
			});
		}
		
		this.render = function(domain,selector,platformConfig){
			switch(domain){
				case "events.gm99.com" : {
					require(["./gm99HeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				};break;
				case "events.ujoy.com" : {
					require(["./ujoyHeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				};break;
				case "events.37games.com" : {
					require(["./37HeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector,platformConfig);
					});
				};break;
				case "events.gmthai.com" : {
					require(["./gmthaiHeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				};break;
				case "krevents.37.com" : {
					require(["./krHeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				};break;
				case "events.vgm.vn" : {
					require(["./vgmHeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				};break;
				default : {
					require(["./gm99HeaderBuilder"],function(builder){
						buildHeaderDirect(builder,selector);
					});
				}
			}
		};
	}

	return new Header();
});