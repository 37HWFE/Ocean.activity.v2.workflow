define(["createClass"],function(createClass){
	var BaseCollectorFactory = function(Model){
		var me = this;
		
		//all items had laoded.Not a single page;
		this.items = [];
		this.pageSize = 15;
		
		this.hasLoadMore = true;
		this.currentPageNumber = 1;
		
		//Is load in page? Or change it in children Class;
		this.isInPage = false;

		if(Model){
			this.model = new Model();
			this.Model = Model;
		}else if(this.Model){
			this.model = new this.Model();
		}
		
		this.setPageSize = function(pageSize){
			this.getPageSize = pageSize;
		}
		
		this.isHasLoadMore = function(){
			return this.hasLoadMore;
		}
		
		this.setHasLoadMore = function(hasLoadMore){
			this.hasLoadMore = hasLoadMore;
		}
		
		this.getItems = function(){
			return this.items;
		}
		
		this.clear = function(){
			this.hasLoadMore = true;
			this.currentPageNumber = 1;
			this.items = [];
		}


		this.setModel = function(Model){
			this.Model = Model;
			this.model = new this.Model();
		}
		
		this.mappingItems = function(items){
			var newItems = new Array();
			for(var i = 0,len = items.length;i<len;i++){
				var item = new this.Model();
				item.setMappingRecord(items[i]);
				newItems.push(item)
			}
			
			return newItems;
		}
		

		/**
		@params parameter 请求加载的参数
		**/

		this.loadMoreItems = function(parameter,callBack){
			if(arguments.length == 1 && "function" == typeof parameter){
				callBack = parameter;
				parameter = {};
			}
			if(me.hasLoadMore){
				this.beforeLoad();
				// 需要被类覆盖的方法
				this.doLoadMore(parameter,function(error,datas,hasNext,count,totalPageLength){
					var newItems = "";
					if(error && callBack){
						callBack(error,null);
						return ;
					}
					if(datas && datas.length>0){
						newItems = me.mappingItems(datas)
						me.addItems(newItems);
					}
					me.hasLoadMore = hasNext;
					me.totalPageLength = totalPageLength;
					me.onLoadFinish(newItems,hasNext,totalPageLength);
					if(callBack && "function" == typeof callBack){
						if(me.inpage)
							callBack(null,me.getLastPage());
						else
							callBack(null,me.getItems());
					}
				})
			}else{
				
			}
		}
		
		this.loadAllItems = function(callBack){
			this.doLoadAllItems(function(err,datas){
				if(error && callBack){
					callBack(error,null);
				}
				if(datas && datas.length>0 && callBack && "function" == typeof callBack){
					var mappingDatas = me.mappingItems(datas);
					callBack(null,mappingDatas);
				}
			})
		}
		
		this.reLoadMoreItems = function(parameter,callBack){
			this.clear();
			this.loadMoreItems(parameter, callBack);
		}
		
		
		this.addItems = function(items){
			this.items = this.items.concat(items);
		}
		
		this.loadIndexPage = function(index,parameter,callBack){
			this.items = [];
			me.currentPageNumber = index;
			this.loadMoreItems(parameter, callBack);
		}
		
		this.loadFirstPage = function(parameter,callBack){
			me.loadIndexPage(1,parameter,callBack);
		}
		
		this.loadNextPage = function(parameter,callBack){
			if(me.hasLoadMore){
				me.loadIndexPage(me.currentPageNumber + 1,parameter,callBack);
			}
		}

		//当加载完成的时候调用，如果子类需要，则重写这个方法。
		this.onLoadFinish = function(){

		};

		//在执行加载操作之前调用，如果子类需要，则重写次方法。
		this.beforeLoad = function(){

		}
		
		this.loadPrevPage  = function(parameter,callBack){
			var currentPageNumber = me.currentPageNumber;
			if(currentPageNumber>1){
				me.loadIndexPage(currentPageNumber-1,parameter,callBack);
			}
		}
		
		this.loadLastPage = function(parameter,callBack){
			me.loadIndexPage(me.totalPageLength,parameter,callBack);
		}



		/**
		doLoadMore
		@param parameter  请求的参数，
		@param  callback 请求的回调。
		      @param  of callback error  请求失败的错误信息
		      @param of callback datas 请求返回的数组
		      @param of callback hasNext 是否有下一页
		      @param of callback count 某个条件下，数据库的总条数
		      @param of callback totalPageLength 总页数
		*/
		this.abstactMembers = [{
            memberName : "doLoadMore",
            memberType : "function"
        }];
	}
	return createClass(BaseCollectorFactory);
})