define(["ocean","MessageModel","./BaseCollector"],function(ocean,MessageModel,BaseCollector){
	return ocean.collector("messages",function(){
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
          this.model.load(parameter,function(errmsg,loadMessageData){
              if(errmsg){
                callback(errmsg);
              }else{
                var messages = loadMessageData["lists"];
                var pageMessage = loadMessageData["pages"];
                var hasNext = pageMessage.page < pageMessage.nums;
                var totalPageLength = pageMessage.nums;
                var count = messages.length;
                callback("",messages,hasNext,totalPageLength);
              }
          })  
      }
  },"baseCollector",MessageModel);   
})