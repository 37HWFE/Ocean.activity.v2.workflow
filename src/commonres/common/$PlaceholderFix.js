/**
 * 
 * @authors fyz
 * @date    2016-09-12 18:06:09
 * @version $Id$
 */

define(function(require, exports, module){

	var $ = require("jquery");
	function initInput(){
		$("input[type='text']").addClass("J_inputplaceholder");
		$("input[type='password']").addClass("J_inputplaceholder").attr("data-type","password");
	}

	function isPlaceholderSupport() {  
	    return 'placeholder' in document.createElement('input');  
	} 

	function placeholders(){
		var isPl = isPlaceholderSupport();
	    
	    var $inputs = $(".J_inputplaceholder");
	    var length = $inputs.length;

	    if(!isPl){

	    	for(var i = 0;i < length;i++){
	    		var me = $inputs.eq(i);
	    		
	    		me.addClass("Jtextcolor");

	    		// if(me.attr("data-type") == "password"){
	    		// 	me[0].setAttribute("type","text");
	    		// }

	    		//需要给每个input做个dom配置
	    		configDOMOfInput(me);
	    	}

		    	//On Focus
		    $(".J_inputplaceholder").focus(function(){
		    	var me = $(this);

		    	var $label = me.parent().find(".J_input_label");
		    	var val = me.val();

		        if("" == val){
		            me.removeClass("Jtextcolor");

		            //点中的时候就隐藏placeholder
		            $label.html("");
		        }

		    });

		    //On Blur
		    $(".J_inputplaceholder").blur(function(){
		    	var me = $(this);

		    	var $label = me.parent().find(".J_input_label");
		    	var placeholderVal = me.attr("placeholder");

		        if( me.val() == ""){
		            me.addClass("Jtextcolor");

		            //离开的时候就显示placeholder
		            $label.html(placeholderVal);
		        }
		    });

	    }
	}

	//返回包装的对象
	function getWrapDom($input){
		var inputSty = $input.css("display");

		return '<div style="position:relative;display:'+inputSty+';"></div>';
	}
	//转换px成数字
	function exchangePxToNumber(_px){
		var num = _px.replace(/[a-zA-Z]*/g,"");

		num = "" == num?0:num;

		return parseInt(num)
	}
	//创建label
	function getLabel($input){
		var id = $input.attr("id");
		var placeholder = $input.attr("placeholder");
		var color = $input.css("color");
		var height = $input.height();

		var marginLeft = exchangePxToNumber($input.css("margin-left"));
		var paddingLeft = exchangePxToNumber($input.css("padding-left"));
		var pLeft = exchangePxToNumber($input.css("left"));

		var left = marginLeft + paddingLeft + pLeft;

		var $label = $('<label>');

		var _style = {
			"position":"absolute",
		  	"color":color,
		  	"height":height+"px",
		  	"line-height":height+"px",
		  	"left":left+"px",
		  	"top":0
		  };

		$label.attr({
			"for":id,
			"data-placeholder":placeholder
		}).html(placeholder)
		  .css(_style)
		  .addClass("J_input_label");

		return $label;
	}
	//配置Input包装
	function configDOMOfInput($input){
		var $parant = $input.parent();

		var wrapDom = getWrapDom($input);

		var $label = getLabel($input);

		$input.wrap(wrapDom);

		$input.before($label).css("background-color","transparent");
	}

	function Placeholder(){
		initInput();
		placeholders();
	}

	return new Placeholder();
});