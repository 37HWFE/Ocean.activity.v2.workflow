define(['jquery',"HeaderBuider"], function($,HeaderBuider) {

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "gm99Header.html";

        this.getInitRenderParams = function(callback){
            callback({
                forward : window.encodeURIComponent(window.location.href)
            });
        }

        this.ready = function(){
            headerController.init();
        }
    }

    var headerController =  {
        checkLogin: function() {
            // 检查登陆状态
            $.ajax({
                url : '//passport.gm99.com/ajax/get_user_json',
                type : 'get',
                data : { },
                jsonp: 'callback',
                async : true,
                dataType : 'jsonp',
                success : function(json){
                    var loginBefore = $('#login-before'),
                        loginAfter = $('#login-after');
                    if (json.result == 1) {
                        loginBefore.remove();
                        loginAfter.html('Hi, <a class="cm-li-a" href="//www.gm99.com/center" target="_blank" >' + json.data.LOGIN_ACCOUNT + '</a> <a id="h-logout-btn" class="cm-li-a" href="javascript:;"><i class="co iconfont">&#xe649;</i>登出</a>');

                        window.USER = json.data;

                        $("#h-logout-btn").on("click", function() {
                            $.ajax({
                                url: '//passport.gm99.com/login/logout2',
                                type : 'get',
                                data : {
                                    forward: window.location.href
                                },
                                jsonp: 'callback',
                                async : true,
                                dataType : 'jsonp',
                                success: function(json){
                                    if (json.result === 1) {
                                        window.location.href = decodeURIComponent(json.forward);
                                    }
                                }
                            });
                        });
                    }
                }
            });
            
        },
        popGMGame: function() {
           var cmGB = $('#cm-game-box');
            $("#cm-gm").hover(function(){
                cmGB.show(300);
            },function(){
                cmGB.hide();
            });
        },
        initAd: function() {
            // 加载顶部广告图
            $.ajax({
                url: '//www.gm99.com/ajax/get_slides',
                type : 'get',
                data : { },
                jsonp: 'callback',
                async : true,
                dataType : 'jsonp',
                success: function(data){
                    if (data && data.length !== 0) {
                        var html = '<img src="'+ data[0].PIC_THUMB_URL +'" alt="" class="cm-pic-small" id="cm-pic-small">'+ '<a target="_blank" href="'+ data[0].URL +'" class="cm-pic-big" id="cm-pic-big">'+ '<img src="'+ data[0].PIC_URL +'">'+ '</a>';
                        $('#cm-ads').html(html).on("mouseover mouseout",function(event){
                            if(event.type == "mouseover"){
                                $('#cm-pic-small').fadeOut(50);
                                $('#cm-pic-big').fadeIn(130);
                            }else if(event.type == "mouseout"){
                                $('#cm-pic-small').fadeIn(130);
                                $('#cm-pic-big').fadeOut(50);
                            }
                        });
                    }
                }
            });
        },
        initWebGame: function() {
            // 加载网页游戏列表
            $.ajax({
                url : '//m.gm99.com/ajax/get_web_game',
                async : true,
                dataType : 'jsonp',
                success : function(json){
                    var temp = '';
                    $.each(json, function(i,item){
                        var icon = (item.ICON == 'new') ? 'N' : (item.ICON == 'hot') ? '&#xe619;' : '';

                        if(i < 23){
                            temp += '<a target="_balnk" class="cm-game-name" href="//www.gm99.com/' + item.ENNAME + '/">' + item.NAME + '<span class="iconfont ' + item.ICON + '">' + icon + '</span></a>';
                        }
                    });
                    $('#cm-yy-list').html(temp + '<a target="_balnk" class="cm-game-name" href="//www.gm99.com/web_game/">更多 +</a>');
                }
            });
        },
        initMobileGame: function() {
            // 加载手机游戏列表
            $.ajax({
                url : '//m.gm99.com/ajax/get_mov_game',
                async : true,
                dataType : 'jsonp',
                success : function(json){
                    var temp = '',
                        more = (json.length > 5) ? '<a target="_balnk" class="cm-game-name" href="//www.gm99.com/web_game">更多 +</a>' : '';
                    $.each(json, function(i,item){

                        if (parseInt(item.STATE) >= 0) {
                            var iconFont = (item.ICON == '2') ? 'new;' : (item.ICON == '1') ? 'hot' : '',
                                icon = (item.ICON == '2') ? '&#x3444;' : (item.ICON == '1') ? '&#xe619;' : '';

                            if (i < 5) {
                                temp += '<a target="_balnk" class="cm-game-name" href="//m.gm99.com/' + item.ENNAME + '">' + item.NAME + '<span class="iconfont ' + iconFont + '">' + icon + '</span></a>';
                            }
                        }
                    });
                    $('#cm-sy-list').html(temp + more);
                }
            });
        },

        // 获取url指定参数
        getUrlParams: function(key) {
            var url = window.location.href;
            var r = '[\?&]+' + key + '=([^&]+)*';
            var b = url.match(new RegExp(r, 'i'));
            return b ? b[1] : '';
        },

        getActivityId : function(){
            var aid,
                locationMatch = location.href.match(/\w*\/(?:m|\?|index.html|$)/);
            aid = locationMatch ? locationMatch[0].split("/")[0] : this.getUrlParams('e');
            return aid;
        },

        InitStat: function(){  //活动统计接口
            var activityId = this.getActivityId();
            $.ajax({
                url: '//events.gm99.com/ajax/log/id/'+activityId+'/gid/'+activityId,
                type: 'get',
                dataType: 'jsonp',
                jsonp: 'callback'
            })
            .done(function(json) {});
            
        },
        init: function() {
            window.USER = null;
            this.checkLogin();
            this.popGMGame();
            this.initAd();
            this.initWebGame();
            this.initMobileGame();
            this.InitStat();
        }
    };

    return new Builder();
});
