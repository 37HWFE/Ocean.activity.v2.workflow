define(["ocean","RewardListModel","./BaseCollector"],function(ocean,RewardListModel,BaseCollector){
		return ocean.collector("rewardLists",function(){
			/**
	        @param parameter  请求的参数，
	        @param  callback 请求的回调。
	              @param error  请求失败的错误信息
	              @param datas 请求返回的数组
	              @param hasNext 是否有下一页
	              @param count 某个条件下，数据库的总条数
	              @param totalPageLength 总页数
	        */
	      this.doLoadMore = function(parameter,callback) {
	          this.model.getRewardList(function(errmsg,loadReward_res){
	              if(errmsg){
	                callback(errmsg);
	              }else{
	                var rewrds = loadReward_res;
	                var hasNext = false;
	                var totalPageLength = 1;
	                var count = rewrds.length;
	                callback("",rewrds,hasNext,totalPageLength);
	              }
	          })  
	      }
	  },"baseCollector",RewardListModel);   
})