define(["ocean"],function(ocean){
	var MyBaseCollector = ocean.collector("baseCollector",function(Model){
		this.setActivityId = function(activity_id){
			if(!this.model){
				this.model = new this.Model();
			}
			this.model.resetActivityId(activity_id);
		}

		this.test = 1;

		this.doLoadMore = function(){};
		this.abstactMembers = [{
            memberName : "doLoadMore",
            memberType : "function"
        }];
	});

	return MyBaseCollector;
});