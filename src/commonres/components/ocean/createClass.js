define(function(){
	var doStaticExtend = function(subClass,supClass,instance){
		for(var el in supClass){
			if(!subClass[el]){
				subClass[el] = supClass[el];
				if(el == "getInstance"){
					subClass[el] = function(){
						if(!instance){
							instance = new subClass()
						}
						return instance;
					}
				}

			}
		}
		return subClass;
	};

	var Interface = function(){
		this.abstactMembers = [];
		this.checkAbstract = function(){
			for(var i =0;i<this.abstactMembers.length;i++){
				var abstract = this.abstactMembers[i];
				var memberName = abstract.memberName;
				var memberType = abstract.memberType;
				if(!this[memberName]){
					throw new Error("you are request to var a member '" +memberName + "' whoes type is " + memberType);
				}
				if(memberType && (typeof this[memberName] != memberType)){
					throw new Error("type of member " + memberName + " must be " + memberType);
				}
			}
		};
	}

	var components = function(){
		var options = arguments;
	};

	var merge = function(){
		var args = arguments;
		var origin = args[0];
		for(var i = 1,len = args.length;i<len;i++){
			if("object" == typeof args[i]){
				clone(origin,args[i])
			}
		}
		return origin;
	}
	var clone = function(origin,target){
		for(var prop in target){
			if("object" == target[prop]){
				origin[prope] = {};
				origin[prope] = doMearge(origin[prope],target[prop]);
				//如果target[prop] 是数组，经过上述复制，origin[prop]会变成伪数组。
				if(origin[prop] instanceof Array){
					origin[prop].length = target[prop].length
					origin[prop] = [].slice.call(this[prop]);
				}
			}else{
				origin[prop] = target[prop];
			}
		}
		return origin;
	}

	//way about mutiple extend : createClass(superClassClassA,createClass(SuperClassClassB,factory));
	var createClass = function(){
		var arg = Array.prototype.slice.call(arguments, 0);
		var factory = arg.shift();
		var instance = null;
		var extend = arg[0];
		if("function" != typeof factory){
			throw new Error("factory must be a function");
		}
		if(extend){
			arg.shift();
		}


		

		var NewClass = function(){
			var newARguments = arguments;
			var me = this;
			Interface.call(this);

			this.merge = function(){
				var args = Array.slice.call(arguments);
				var newArguments = args.unshift(me);
				merge(newArguments);
			}

			if(extend){
				this.parentClass = extend;
				this.superClass = extend.prototype;
			}
			if(extend){
				var length = newARguments.length;
				for(var i=0;i<length;i++){
					arg.unshift(newARguments[i]);
				}
				extend.apply(this,arg);
			}
			factory.apply(this,newARguments);
			if(extend&&this.checkAbstract){
				this.checkAbstract();
			}
			if(this.superClass){
				for(var el in this){
					if(el != "superClass" && "function" != typeof this.superClass[el]){
						this.superClass[el] = this[el];
					}
				}
			}else{
				this.superClass = {};
			}
		}
		if(extend){
			NewClass = doStaticExtend(NewClass,extend,instance);
			NewClass.superClass = extend;
		}
		
		return NewClass;
	};

	createClass.merge = merge;
	createClass.clone = clone;

	return createClass;
});