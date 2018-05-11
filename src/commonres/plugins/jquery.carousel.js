;(function($){
    var Caroursel = function (caroursel,setting){
        setting = !!setting?setting:{};
        var self = this;
        this.caroursel = caroursel;
        this.posterList = caroursel.find(".rotator-list");
        this.posterItems = caroursel.find(".rotator-item");
        this.firstPosterItem = this.posterItems.first();
        this.lastPosterItem = this.posterItems.last();
        this.prevBtn = this.caroursel.find(".rotator-prev-btn");
        this.nextBtn = this.caroursel.find(".rotator-next-btn");
        this.curIndex = 0;
        this.positionArr = [];
        this.setting = {
            "width":"1000",
            "height":"270",
            "posterWidth":"640",
            "posterHeight":"270",
            "scale":"0.6",
            "speed":"2000",
            "isAutoplay":false,
            "dealy":"2000",
            "hasPointControl":false
        }
        $.extend(this.setting,setting);

        this.prevBtn = setting.prevBtn?setting.prevBtn:this.prevBtn;
        this.nextBtn = setting.nextBtn?setting.nextBtn:this.nextBtn;

        this.setFirstPosition();
        this.setSlicePosition();
        this.rotateFlag = true;

        if(this.setting.hasPointControl){
            this.pointBox = $(".rotator-controls");

            this.pointBox.bind("click",function(){
                var index = $(this).index();

                if(self.rotateFlag){
                    self.rotateFlag = false;
                    self.rotateAnimate("left",index);
                    
                    self.autoPlay();
                    self.caroursel.hover(function(){clearInterval(self.timer)},function(){self.autoPlay()})
                }
            });
        }

        this.prevBtn.bind("click",function(){
            self.carouselIng("prevBtn");
            self.autoPlay();
        });
        this.nextBtn.bind("click",function(){
            self.carouselIng("nextBtn");
            self.autoPlay();
        });
        if(this.setting.isAutoplay){
            this.autoPlay();
            this.caroursel.hover(function(){clearInterval(self.timer)},function(){self.autoPlay()})
        }
    };
    Caroursel.prototype = {
        autoPlay:function(){
          var that = this;
          if(that.timer){
            window.clearInterval(that.timer);
          }
          that.timer =  window.setInterval(function(){
              // that.prevBtn.click();              
              that.carouselIng("prevBtn");
          },that.setting.dealy)
        },
        //isPreNext标识左右切换
        rotateAnimate:function(type,_idx){
            var that = this;
            var zIndexArr = [0,0,0,0,0];

            _index = !!_idx?_idx:0;



            // var renderMove = function(){
                var length = that.positionArr && that.positionArr.length;
                var _pre = that.posterItems.eq(0).parent().find(".cur");

                _index = _index < 0?length - 1:_index;
                _index = _index >= length?0:_index;

                that.curIndex = _index;

                for(var index = 0;index < length;index++){

                    var self = that.posterItems.eq(_index);

                    var prev = that.positionArr[index];

                    var width = prev.width,
                        height = prev.height,
                        zIndex = prev.zIndex,
                        opacity = prev.opacity,
                        left = prev.left,
                        top = prev.top;

                        zIndexArr[_index] = zIndex;

                        self.animate({
                            "width":width,
                            "height":height,
                            "left":left,
                            "opacity":opacity,
                            "top":top,
                        },that.setting.speed,function(){
                            that.rotateFlag = true;
                        });

                    if(type == "left"){
                        _index = _index += 1;
                        _index = _index < 0?length - 1:_index;
                        _index = _index >= length?0:_index;
                    }else{
                        _index = _index -= 1;
                        _index = _index < 0?length - 1:_index;
                        _index = _index >= length?0:_index;
                    }
                }

                that.posterItems.each(function(i){
                        $(this).css("zIndex",zIndexArr[i]);
                    });
                if(that.setting.hasPointControl){
                    that.setPointCurr();
                }
        },
        setPointCurr:function(){
            var me = this;

            var index = me.curIndex;

                me.pointBox.removeClass("cur").eq(index).addClass("cur");
        },
        setFirstPosition:function(){
            this.caroursel.css({"width":this.setting.width,"height":this.setting.height});
            this.posterList.css({"width":this.setting.width,"height":this.setting.height});
            var width = (this.setting.width - this.setting.posterWidth) / 2;
            /*this.prevBtn.css({"width":width , "height":this.setting.height,"zIndex":Math.ceil(this.posterItems.size()/2)});
            this.nextBtn.css({"width":width , "height":this.setting.height,"zIndex":Math.ceil(this.posterItems.size()/2)});*/
            this.prevBtn.css({"zIndex":Math.ceil(this.posterItems.size()/2)});
            this.nextBtn.css({"zIndex":Math.ceil(this.posterItems.size()/2)});
            this.firstPosterItem.css({
                "width":this.setting.posterWidth,
                "height":this.setting.posterHeight,
                "left":width,
                "zIndex":Math.ceil(this.posterItems.size()/2),
                "top":this.setVertialType(this.setting.posterHeight)
            }).addClass("cur");
        },
        setSlicePosition:function(){
            var _self = this;
            var sliceItems = this.posterItems.slice(1),
                level = Math.floor(this.posterItems.length/2),
                leftItems = sliceItems.slice(0,level),
                rightItems = sliceItems.slice(level),
                posterWidth = this.setting.posterWidth,
                posterHeight = this.setting.posterHeight,
                Btnwidth = (this.setting.width - this.setting.posterWidth) / 2,
                gap = Btnwidth/level,
                containerWidth = this.setting.width;
            var i = 1;
            var leftWidth = posterWidth;
            var leftHeight = posterHeight;
            var zLoop1 = level;
            leftItems.each(function(index,item){
                leftWidth = posterWidth * _self.setting.scale;
                leftHeight = posterHeight*_self.setting.scale;
                $(this).css({
                    "width":leftWidth,
                    "height":leftHeight,
                    "left": Btnwidth - i*gap,
                    "zIndex":zLoop1--,
                    "opacity":1/(i+1),
                    "top":_self.setVertialType(leftHeight)
                });
                i++;
            });
            var j = level;
            var zLoop2 = 1;
            var rightWidth = posterWidth;
            var rightHeight = posterHeight;
            rightItems.each(function(index,item){
                var rightWidth = posterWidth * _self.setting.scale;
                var rightHeight = posterHeight*_self.setting.scale;
                $(this).css({
                    "width":rightWidth,
                    "height":rightHeight,
                    "left": containerWidth -( Btnwidth - j*gap + rightWidth),
                    "zIndex":zLoop2++,
                    "opacity":1/(j+1),
                    "top":_self.setVertialType(rightHeight)
                });
                j--;
            });

            //生成一个位置快照
            _self.initPositionArr();
        },
        getSetting:function(){
            var settting = this.caroursel.attr("data-setting");
            if(settting.length > 0){
                return $.parseJSON(settting);
            }else{
                return {};
            }
        },
        setVertialType:function(height){
            var algin = this.setting.algin;
            if(algin == "top") {
                return 0
            }else if(algin == "middle"){
                return (this.setting.posterHeight - height) / 2
            }else if(algin == "bottom"){
                return this.setting.posterHeight - height
            }else {
                return (this.setting.posterHeight - height) / 2
            }
        },
        initPositionArr:function(){
            var me = this;

            me.posterItems.each(function(){
                var item = $(this),
                    oj = {
                        width:item.css("width"),
                        height:item.css("height"),
                        zIndex:item.css("zIndex"),
                        opacity:item.css("opacity"),
                        left:item.css("left"),
                        top:item.css("top")
                    };

                    me.positionArr.push(oj);
            });
        },
        carouselIng:function(_type){
            var me = this;

            var index = me.curIndex;
            var direction = "left";

            if(me.rotateFlag){
                me.rotateFlag = false;
                if("nextBtn" == _type){
                    index += 1;
                }else{
                    index -= 1;
                }
                    me.rotateAnimate(direction,index);
            }
        }
    }
    Caroursel.init = function (caroursels,setting){
        caroursels.each(function(index,item){
            new Caroursel($(this),setting);
        })  ;
    };
    window["Caroursel"] = Caroursel;
})(jQuery)