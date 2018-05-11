define(["ocean","BaseCollector","SignModel"],function(ocean,BaseCollector,SignModel){
	return ocean.collector("SigeDates",function(){

		this.doLoadMore = function(parameter,callback){
			this.model.signDates(function(errmsg,days){
				  if(errmsg){
	                callback(errmsg);
	              }else{
	                var hasNext = false;
	                var totalPageLength = 1;
	                var count = days.length;
	                callback("",days,hasNext,totalPageLength);
	              }
			})
		};
	},"baseCollector",SignModel)
})