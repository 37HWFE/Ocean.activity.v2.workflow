define(["ocean","BaseModel"],function(ocean,BaseModel){
	return ocean.model("fb",function(){
		var me = this;
		this.fields = {
			name : {
				mapping : "name"
			},
			card : {
				mapping : "card"
			},
			actiivtiyId : {
				ampping : "activity_id"
			},
			snName : {
				mapping : "sn_name"
			},
			gameID : {
				mapping : "game_id"
			},
			gameSeverId :{
				mapping : "game_server_id"
			},
			serialId : {
				mapping : "serial_id"
			},
			time : {
				mapping : "time"
			},
			appId: {
                type: "string"
            },
            picture: {
                type: "string"
            },
            link: {
                type: "string"
            },
            title: {
                type: "string"
            },
            caption: {
                type: "string"
            },
            description: {
                type: "string"
            },
            action: {
                type: "string"
            }
		};

		this.getAppConfig = function(callback){
			var url = this.matchUrl("get_app_config");
			ocean.ajax.jsonp(url,{},function(errmsg,appConfig_res){
				if(errmsg){
					callback(errmsg,"")
				}else{
					me.setMappingRecord(appConfig_res);
					callback("",appConfig_res);
				}
			});
		};

		this.hasLike = function(callback){

		};

		 this.like = function(callback) {
		 	var activityId = this.getActivityId();
            var url = "//fbapps.ujoy.com/like/default?app_id=" + activityId + "&action=like";
            ajax.jsonp(url, "", function(errmsg, response) {
                callback(errmsg, response);
            });
        };

        this.dislike = function(callback) {
		 	var activityId = this.getActivityId();
            var url = "//fbapps.ujoy.com/like/default?app_id=" + activityId + "&action=dislike";
            ajax.jsonp(url, "", function(errmsg, response) {
                callback(errmsg, response);
            });
        };


		this.share = function(id,name,callback){
			var url = this.matchUrl("returnMessageNew");
			ocean.ajax.jsonp(url,{
				"fb_id" : id,
				"fb_name" : name
			},function(errmsg,share_res,allResponse){
				if(errmsg){
					callback(errmsg,"",allResponse);
				}else{
					me.setMappingRecord(share_res);
					callback("",me,allResponse);
				}
			});
		};

	},"baseModel");
});