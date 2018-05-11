define(["ocean","activityConfig","./BaseModel"],function(ocean,activityConfig,BaseModel){
    var apiDomain = activityConfig.getApiDomain();
    var parentActivity_id = activityConfig.getActivityId();
    var activity_id = parentActivity_id+"_leaveMessage";
	var Message =  ocean.model("message",function(){
		var me = this;
		this.fields = {
            message: {
                mapping: "MESSAGE",
                type: "string"
            },
            account: {
                mapping: "LOGIN_ACCOUNT",
                type: "string"
            },
            type: {
                mapping: "MESSAGE_TYPE"
            },
            time: {
                mapping: "MESSAGE_TIME"
            },
            picture: {
                mapping: "MESSAGE_PIC"
            },
            nickName : {
                mapping : "NICKNAME"
            }
        };

        this.load = function(params,callback){
            var url = this.matchUrl("get_message");
            ocean.ajax.jsonp(url,params,function(errmsg,loadMessageData,loadMessage_res){
                 callback(errmsg,loadMessageData,loadMessage_res);   
            })
        }

        this.getRecord = function(params,callback){
            var url = this.matchUrl("record_message");
            ocean.ajax.jsonp(url ,params,callback);
        }
	},"baseModel");
    return Message;
});