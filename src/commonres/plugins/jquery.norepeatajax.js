// 防止重复ajax请求，基于jquery的请求
define(['jquery'] ,function($){
    var name = 'norepeatajax';
    var requestCache = {};
    var $self = $();
    $(document).ajaxSend(function(ev, xhr, args){
        var operaData = args[name] = {};//增加记录
        // $self.trigger('requestCallback' ,args.url);
        if(requestCache[args.url]){
            // $self.trigger('preventCallback' ,args.url);
            // 插件阻止记录
            operaData.prevent = true;
            // 已经请求了，取消掉
            xhr.abort();
        }else{
            requestCache[args.url] = true;
        }
    }).ajaxComplete(function(ev, xhr, args){
        if(xhr.readyState == 4 || (args[name] && !args[name].prevent)){
            // $self.trigger('completeCallback' ,args.url);
            delete requestCache[args.url];
        }
    });

    return $self;
});