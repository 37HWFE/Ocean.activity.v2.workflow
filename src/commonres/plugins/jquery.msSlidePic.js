/*!
 * jquery.scrollLoading.js
*/
define(function(require,exports,moudles){
     return function(jquery){

         (function($) {
		    var index = 0;

		    $.fn.msSlidePic = function(headerPics, options){
		        var picTotal = headerPics.length;

		        if (picTotal < 1) {
		            headerPics = [{ img:'/images/block.gif', url:'', title:'', target:'' }];
		        }

		        $.fn.msSlidePic.defaults = {
		            width : 500,        //图片的宽
		            height : 300,       //图片的高
		            //cover : 0,          //从第几张图片开始轮播
		            speed : 3000,       //自动切换速度，毫秒
		            showNumber : true,   //是否显示数字
		            showType : 'number'    //當showNumber为false时判断是否显示点击图形 graph
		        };

		        //变量
		        var opts = $.extend({}, $.fn.msSlidePic.defaults, options);

		        var $slide;
		        var $this = $(this);

		        //计算轮播数字
		        var numbers = '';
		        if(picTotal>1 && opts.showNumber===true) {
		            if (opts.showType == 'number') {
		                for(var i=1; i<=picTotal; i++) {
		                    numbers += '<li>' + i + '</li>';
		                }
		            } else {
		                //為了不出現數字但又出現圖案而加  2013/06/04
		                if( opts.showType == 'graph'){
		                    for(var i=1; i<=picTotal; i++) {
		                        numbers += '<li></li>';
		                    }
		                }
		            }
		        }


		        //创建slide盒子
		        var box = '<div class="ms-slide-pic">' +
		            '<a href="" title="" class="ms-slide-pic-img"></a>' +
		            '<ul class="ms-slide-pic-num">' + numbers + '</ul>' +
		            '</div>';
		        $(this).empty().append( box );

		        var $slideImg = $this.find('.ms-slide-pic-img');
		        var $slideNumber = $this.find('.ms-slide-pic-num');

		        //初始化显示图片
		        doChange();

		        //图片鼠标事件
		//        $slideImg.mouseover(function(){
		//            clearInterval($slide);
		//        }).mouseout(function(){
		//            doChange();
		//        });

		        //数字鼠标事件
		        $slideNumber.children('li').mouseover(function(){
		            clearInterval($slide);

		// 2013/06/04            index = parseInt($(this).text()) - 1;
		            index = parseInt($(this).index());
		            doChange();
		        });

		        //执行更改
		        function doChange() {
		            changePic();

		            if(picTotal>1) {
		                $slide = setInterval(changePic, opts.speed);
		            }
		        }

		        //改变图片
		        function changePic() {
		            index = (index >= picTotal) ? 0 : index;
		            var headerPic = headerPics[index];

		            //设置图片链接相关参数
		            headerPic.url ? $slideImg.attr('href', headerPic.url) : $slideImg.removeAttr('href');
		            headerPic.target ? $slideImg.attr('target', headerPic.target) : $slideImg.removeAttr('target');
		            headerPic.title ? $slideImg.attr('title', headerPic.title) : $slideImg.removeAttr('title');

		            var html = '<img src="' + headerPic.img + '" alt="' + headerPic.title +
		                '" width="'+ opts.width + '" height="'+ opts.height +'" border="0"/>';

		            //改变图片
		            $slideImg.empty().html( html );
		            //改变数字
		            $slideNumber.children('li').removeClass('curr').eq(index).toggleClass('curr');

		            index++;
		        }

		    };

		})(jQuery);

     }
})
