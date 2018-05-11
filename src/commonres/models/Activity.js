define(["ocean","./BaseModel","activityConfig"],function(ocean,BaseModel,activityConfig){
	return ocean.model("activty",function(){
		var me = this;
		var loaded = false;
		 this.fields = {
            descritpion: {
                mapping: "DESCRIPTION",
                type: "string"
            },
            endTime: {
                mapping: "END_TIME",
                type: "string"
            },
            startTime: {
                mapping: "START_TIME"
            },
            gameId: {
                mapping: "GAME_ID"
            },
            activityId: {
                mapping: "ID"
            },
            keyword: {
                mapping: "KEYWORDS"
            },
            title: {
                mapping: "TITLE"
            },
            userInfo: {
                mapping: "USER_INFO"
            }
        };

       
        /**
         * 获取活动基础配置数据
         * @param  {Function} callback 回调方法
         * @return {[type]}            没有返回值
         */
        this.load = function(callback) {
            var domain = activityConfig.getApiDomain();
            var activity_id = activityConfig.getActivityId();
        	if(loaded){
        		callback(me.getRecode());
        	}else{
        		 ocean.ajax.jsonp("//" + domain + "/static_activity/activity_info?name=" + activity_id, "", function(errmsg, responseData) {
	                if (errmsg) {
	                    isLogin = false;
	                    callback(errmsg);
	                } else {
	                    me.setMappingRecord(responseData.activitys);
	                    callback("",me.getRecode());
	                }
	            });
        	}
        };

        /**
         * 返回用户的相关信息
         * @param  {Function} callback 回调方法
         * @return {[type]}            没有返回值
         */
        this.getUserInfo = function(callback){
        	if(this.userInfo){
        		callback(this.userInfo);
        	}else{
        		this.load(function(){
        			callback(me.userInfo);
        		});
        	}
        }
	},"baseModel");
});