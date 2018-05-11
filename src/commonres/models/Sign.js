define(["ocean","BaseModel"],function(ocean,BaseModel){
	return ocean.model("sign",function(){
		var me = this;
				this.fields = {
			acitiviityId :{
				mapping : "ACTIVITY_ID"
			},
			name : {
				mapping : "NAME"
			},
			snName : {
				mapping : "SN_NAME"
			},
			gameId : {
				mapping : "GAME_ID"
			},
			gameServerId : {
				mapping : "GAME_SERVER_ID"
			},
			serialId : {
				mapping : "SERIAL_ID"
			},
			time : {
				mapping : "TIME"
			},
			total : {
				mapping : "TOTAL"
			},
			lastTime : {
				mapping : "LAST_TIME"
			},
			repairCost : {
				mapping : "REPAIR_COST"
			},
			repairtotal : {
				mapping : "REPAIR_TOTAL"
			},
			day :{
				mapping : "DAY"
			},
			state : {
				mapping : "STATE"
			}
		}

		this.signActivityInfo = function (callback) {
			var url = this.matchUrl("activityInfo");
			ocean.ajax.jsonp(url,{},function(errmg,sign_res){
				var result = sign_res;
				callback(result);
			});
		}

		this.signInfo = function(callback){
			var url = this.matchUrl("info");
			ocean.ajax.jsonp(url,{},function(errmg,sign_res){
				var result = me.setMappingRecord(sign_res);
				callback(result);
			});
		}

		this.sign = function(userName,serverId,callback){
			var url = this.matchUrl("sign");	
			ocean.ajax.jsonp(url,{
				"username" : userName,
				"server_id" : serverId,
			},callback);
		};

		this.getSpecialReward = function(date,serverId,roleId,callback){
			var url = this.matchUrl("get_special_reward");

			ocean.ajax.jsonp(url,{
				"day":date,
				"server_id" : serverId,
				"role_id" : roleId
			},callback);
		};

		this.getTotalReward = function(count,server_id,role_id,callback){
			var url = this.matchUrl("get_reward");
			var params = "";
			if(server_id&&role_id){
				params = {
					count : count,
					server_id : server_id,
					role_id : role_id
				}
			}else{
				params = count;
			}
			ocean.ajax.jsonp(url,params,callback);
		}

		this.signDates = function(callback){
			var url = this.matchUrl("list_signed_days");
			ocean.ajax.jsonp(url,{},callback);
		}

		this.getSignDateMonth = function(){
			return this.day.split("_")[0]
		}

		this.getSignDateDate = function(){
			return this.day.split("_")[1];
		}

		this.getSignDateTime = function(){
			var year = new Date().getFullYear();
			var month = this.getSignDateMonth();
			var date = this.getSignDateDate();
			var date = new Date(year + "-" + month + "-"+ date);
			return date;
		}

	},"baseModel");
});