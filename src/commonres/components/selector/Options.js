define(["ocean"],function(ocean){
	return function(url){

		var me = this;

		 this.nameField = "name";
		 this.valueField = "value";
		 this.action = url;
		/**
			options 是一个对象数组，对象的格式：
			{
				value:
				name : 
			}
		**/
		var options = [];
		this.length = 0;

		var resetLength = function(){
			me.length = options.length;
		};


		this.get = function(i){
			return options[i];
		};

		this.setNameField = function(fieldName){
			this.nameField = fieldName;
		}

		this.setValueField = function(fieldName){
			this.valueField = fieldName;
		}

		this.setAction = function(newAction){
			this.action = newAction;
		}

		this.setMatchFieldName = function(nameFieldName,valueFieldName){
			this.setNameField(nameFieldName);
			this.setValueField(valueFieldName);
		};

		this.clear = function(){
			options = [];
			resetLength();
		};

		this.reload = function(params,callback){
			this.clear();
			this.load(params,callback);
		};

		this.push = function(option){
			if(option instanceof Array){
				options = options.concat(option);
			}else{
				options.push(option);
			}
			resetLength();
		};

		
		//可以被覆盖的方法；
		this.matchOptions = function(options_res){
			var newOptions = [];
			var nameField = this.nameField;
			var valueField = this.valueField;
			if(options_res){
				for(var i=0,len = options_res.length;i<len;i++){
					var option = {
						 name : "object" == typeof options_res[i] ? options_res[i][nameField] : options_res[i],
						 value : "object" == typeof options_res[i] ?  options_res[i][valueField] : options_res[i]
					}
					newOptions.push(option);
				}
			}
			
			return newOptions;
		}

		this.load = function(params,callback){
			var action = this.action;
			if(action){
				ocean.ajax.jsonp(action,params,function(errmsg,options_res){
					me.push(me.matchOptions(options_res));
					callback(errmsg);
				});
			}
		};
		
		this.matchName = function(value){
			for(var i =0,len = options.length;i<len;i++){
				if(options[i].value === value){
					return options[i].name
				}
			}
		};

		this.matchValue = function(name){
			for(var i =0,len = options.length;i<len;i++){
				if(options[i].name === name){
					return options[i].value
				}
			}
		};
	}
});