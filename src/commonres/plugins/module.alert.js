/**
 * 弹窗组件
 * @todo  
 * 以后集成弹窗提示
 */
define(['jquery'] ,function($){
    var name = 'alert';
    $.fn[name] = function(command){
        if(typeof command == 'string'){
            return this.each(function(i ,v){
                var a=$(v).data(name);
                if(a) a[command]();
            });
        }else{
            return this.eq(0).data(name);
        }
    }
    return function(message ,args){
        if(!args) args ={};
        switch(args.type){
            // 自定义弹窗组件
            case 'custom':
                require(['jquery'] ,function($){
                    var $popup = $(message);
                    var $mask = $('#mask');
                    if(!$mask.length) $mask = $('<div id="mask" style="display:none"></div>').appendTo('body');
                    var operaData = $popup.data(name);
                    args.data && $.each(args.data ,function(k ,v){
                        var $this = $(k ,$popup);
                        if(typeof v == 'string'){
                            $this[$this.is(':input')? 'val' : 'text'](v);
                        }else if($.isFunction(v)) v($this);
                    });
                    if(!operaData){
                        $popup.data(name ,operaData = {});
                        $('.popup-cancle,.popup-close' ,$popup).on('click' ,function(){
                            operaData.close();
                        });
                        operaData.open = function(){
                            $mask.fadeTo('normal' ,.5);
                            $popup.hide().fadeIn(function(){
                                if(args.callback) args.callback();
                            });
                            $popup.trigger(name+'open');
                        }
                        operaData.close = function(){
                            $mask.fadeOut();
                            $popup.fadeOut();
                            $popup.trigger(name+'close');
                        }
                    }
                    if(false !== args.open) operaData.open();
                });
            break;
            default:
                alert(message);
                if(args.callback) args.callback();
        }
    }
});