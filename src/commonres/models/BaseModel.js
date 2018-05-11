define(["ocean","activityConfig"],function(ocean,activityConfig){
	var MyBaseModel =  ocean.model("baseModel",function(){
		this.apiDomain = activityConfig.getApiDomain();
		this.activity_id = activityConfig.getActivityId();

		this.matchUrl = function(action){
			var url = this.apiDomain + "/activity/execute?name={activity_id}&action={action}".replace("{activity_id}",this.activity_id).replace("{action}",action);
			return url;
		};

		this.resetActivityId = function(activity_id){
			this.activity_id = activity_id;
		};

		this.getActivityId = function(){
			return this.activity_id;
		}

		this.resetApiDomain = function(apiDomain){
			this.apiDomain = apiDomain;
		};

		this.getRewardList = function(callback){
			var url = this.matchUrl("list_card");
			ocean.ajax.jsonp(url,{},function(err,rewards){
				callback(err,rewards);
			});
		};

		this.jsonp = function(url,param,callback){
			ocean.ajax.jsonp(url,param,function(errmsg,res_data,response){
				callback(!!response.result,response.code,res_data);
			});
		}
		
		this.getRecode = function(){
            var reacod = {}
            for(var prop in this.fields){
                reacod[prop] = this[prop];
            }
            return reacod;
        }
	});
	return MyBaseModel;
})