define(["ocean","./Options"],function(ocean,Options){
	var factory =  function(container,action){
		var $ = ocean.query;
		var me = this;
		var placeholderTemplate = "<p class='selector-placeholder selector-result'><%= placeHolder %></p>";
		var selectorTemplate = "<ul class='selector hide'></ul>";
		var iconsTemplate = "<i class='selector-state sleep'></i>";
		var itemTemplate = '<li class="selector-item" data-value="<%= value %>"><%= name %></li>';
		var placeholderText = "";
		var childeSelectors = [];

		var $container = $(container);
		var $placeholder = {};
		var $selector = {};
		var $icon = {};
		var options = new Options(action);
		var $items = [];
		var loadParam = "";

		this.defaultSelect = false;

		var createElements = function(){
			var placeHolderHTML = placeholderTemplate.replace("<%= placeHolder %>",placeholderText);

			$placeholder = $(placeHolderHTML);
			$selector = $(selectorTemplate);
			$icon = $(iconsTemplate);
		}

		var renderElements = function(){
			$container.append($icon);
			$container.append($placeholder);
			$container.append($selector);
		}

		//当页面发生点击的时候，判断是否要隐藏选项列表
		var toggleOptionsOnDocClick = function(){
			$(document).on("click",function(evt){
				 var $target = $(evt.target);    
				 if(!$target.parent(container).length){
				 	// $selector.addClass("hide");
				 	me.toggleSelector("hide");
				 	toggleIconStatus("sleep");
				 }
			})
		};

		var activeIcon = function(){
			$icon.removeClass("sleep");
			$icon.addClass("active");
		}

		var sleepIcon = function(){
			$icon.removeClass("active");
			$icon.addClass("sleep");
		}

		var initOptionsConfig = function(){
			var nameFields = $container.attr("nameFiled");
			var valueField = $container.attr("valueField");
			var defaultShow = $container.attr("defaultShow");
			var action = $container.attr("action");
			var loadParamField = $container.attr("loadParamField");
		    var resetChildResult = $container.attr("resetChild");
		    this.emptyToggleAble = $container.attr("emptyToggleAble") === "true";
			if(nameFields){
				options.setNameField(nameFields);
			}
			if(valueField){
				options.setValueField(valueField);
			}
			if(defaultShow){
				me.defaultSelect = ("string" == typeof defaultShow) ? (defaultShow=="true") : true;
			}

			if(resetChildResult){
				me.resetChildResult = ("string" == typeof resetChildResult) ? (resetChildResult=="true") : true;
			}

			if(action){
				options.setAction(action);

			}
			if(loadParamField){
				loadParam = loadParamField;
			}
		};

		var toggleIconStatus = function(state){
			if(state && "active" == state){
				activeIcon();
				return ;
			}
			if(state && "sleep" == state){
				sleepIcon();
				return ;
			}
			if($icon.hasClass("sleep")){
				activeIcon();
			}else{
				sleepIcon();
			}
		}

		var initOptions = function(){
			if(me.matchOptions){
				options.matchOptions = me.matchOptions;
			}
		}

		var doLinkChildSelectors = function(currentSelectValue){
			for(var i=0,len = childeSelectors.length;i<len;i++ ){
				childeSelectors[i].load(currentSelectValue);
			}
		}

		this.hasOptions = function(){
			return options.length > 0 ;
		}

		this.init = function(){
			initOptionsConfig();
			initOptions();
			createElements();
			renderElements();
			toggleOptionsOnDocClick();
			this.listenShowSelect();
			return this;
		};

		this.ready = function(placeHolder,params){
			this.setPlaceHolder(placeHolder).init().load(params);
		}

		this.setItemTemplate = function(itemTemplate){
			itemTemplate = itemTemplate;
			return this;
		};



		this.setIconTemplate = function(template){
			iconsTemplate = template;
			return this;
		};

		this.setSelectorTemplate = function(template){
			selectorTemplate = template;
			return this;
		};


		this.addChildSelector = function(){
			for(var i = 0,len = arguments.length;i<len;i++){
				childeSelectors.push(arguments[i]);
			}
			return this;
		};


		this.setPlaceHolder = function(placeholder){
			placeholderText = placeholder;
			return this;
		}

		this.onError = function(errmsg){
			me.loadError();
		}

		this.setMatchOptions = function(matchfnc){
			options.matchOptions = matchfnc;
		};

		this.appendExtraParam = function(param){
			this.extraParam = param;
		}

		var mixObj = function(origin,target){
			for(var prop in target){
				origin[prop] = target[prop];
			}
			return origin;
		}

		this.load = function(params){
			this.onLoad();

			var param = {};
			if(loadParam){
				param[loadParam] = params;
			}else{
				param = params;
			}
			if(this.extraParam){
				param = mixObj(param,this.extraParam);
			}

			options.reload(param,function(errmsg){
				if(errmsg){
					me.onError(errmsg);
				}
				me.render();
				selectFirsItem();
				me.onLoadFinish(errmsg,options);
			});
			
		}

		var resetChildResult = function(){
			for(var i=0,len = childeSelectors.length;i<len;i++ ){
				childeSelectors[i].resetPlaceholder();
			}
		}

		this.render = function(){
			$selector.empty();
			$items = [];
			for(var i=0,len = options.length;i<len;i++){
				var option = options.get(i);
				var $item = createItemElement(option);
				$items.push($item);
				bindSelect($item);
				$selector.append($item);
			}
		}

		var selectFirsItem = function(){
			if($items.length>0 && me.defaultSelect){
				$items[0].trigger("click");
			}
		}

		var bindSelect = function($item){
			$item.on("click",function(){
				me.doSelect($(this));
			})
		}

		var createItemElement = function(option){
			var itemHTML = ocean.template(itemTemplate)(option);
			return $(itemHTML);
		}

		this.addOptions = function(option){
			options.push(option);
		};

		this.resetPlaceholder = function(){
			$placeholder.text(placeholderText);
		}

		this.clearOptions = function(){
			options.clear();
			$selector.empty();
		}

		// this.renderSelector = function(){
		// 	this.$container.append($selector);
		// 	return this;
		// }

		this.listenShowSelect = function(){
			$placeholder.on("click",function(){
				me.toggleSelector();
				toggleIconStatus();
				me.onShowSelect(options);
			});
			return this;
		};

		var showOptions = function(){
			$selector.removeClass("hide");
			me.onShowOptions();
		}

		var hideOptions = function(){
			$selector.addClass("hide");
			me.onHideOptions();
		}

		this.toggleAble = function(){
			return options.length>0 || this.emptyToggleAble;
		}

		this.toggleSelector = function(className){
			if(className && className == "active" && this.toggleAble()){
				showOptions();
				return ;
			}
			if(className && className == "hide"){
				hideOptions();
				return ;
			}
			if($selector.hasClass("hide") && this.toggleAble()){
				showOptions();
			}else{
				hideOptions();
			}
		}

		this.doSelect = function($item){
			var name = $item.text();
			var value = options.matchValue(name);
			toggleIconStatus("sleep");
			$placeholder.text(name);
			this.onSelect(value);
			if(me.resetChildResult){
				resetChildResult();
			}
			doLinkChildSelectors(value);
		};

		this.getValue = function(){
			var text = $placeholder.text();
			return options.matchValue(text);
		};

		this.getText = function(){
			var text = $placeholder.text();
			return text;
		};

		//如果需要，可以被重写的成员方法
		this.onLoad = function(){};
		this.onLoadFinish = function(){};
		this.onRenderItem = function(){};
		this.onRenderItemFinish = function(){};
		this.onShowOptions = function(){};
		this.onSelect = function(){};
		this.onHideOptions = function(){};
		this.onShowSelect = function(){};
		this.loadError = function(){}
	};

	return ocean.component("selector",factory);
})


