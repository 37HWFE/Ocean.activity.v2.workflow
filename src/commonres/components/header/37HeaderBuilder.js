define(['jquery',"HeaderBuider"], function($,HeaderBuider) {

    // 工具类
    var utils = {
        // GBK字符集实际长度计算
        strLen:function(str){
            var realLength = 0;
            var len = str.length;
            var charCode = -1;
            for(var i = 0; i < len; i++){
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) { 
                    realLength += 1;
                }else{ 
                    // 如果是中文则长度加3
                    realLength += 2;
                }
            } 
            return realLength;
        },

        //截取字符串 包含中文处理 (串,长度,增加...) 
        subString:function(str, len, hasDot) {
            var newLength = 0;
            var newStr = "";
            var chineseRegex = /[^\x00-\xff]/g;
            var singleChar = "";
            var strLength = str.replace(chineseRegex, "**").length;
            for (var i = 0; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(chineseRegex) != null) {
                    newLength += 2;
                } else {
                    newLength++;
                }
                if (newLength > len) {
                    break;
                }
                newStr += singleChar;
            }

            if (hasDot && strLength > len) {
                newStr += "...";
            }
            return newStr;
        }
    }

    // 语言库
    var LANG = {
        'en': {
            'news': 'NEWS',
            'games': 'GAMES',
            'recharge': 'RECHARGE',
            'forum': 'FORUM',
            'support': 'SUPPORT',
            'account': 'ACCOUNT',
            'my_gift': 'MY GIFT',
            'log_out': 'LOG OUT',
            'recently_played': 'Recently Played'
        },
        'fr': {
            'news': 'NEWS',
            'games': 'JEUX',
            'recharge': 'RECHARGE',
            'forum': 'FORUM',
            'support': 'SUPPORT',
            'account': 'COMPTE',
            'my_gift': 'MES CADEAUX',
            'log_out': 'DÉCONNEXION',
            'recently_played': 'Joué récemment'
        },
        'tr': {
            'news': 'HABERLER',
            'games': 'OYUN',
            'recharge': 'YÜKLEME',
            'forum': 'FORUM',
            'support': 'DESTEK',
            'account': 'HESAP',
            'my_gift': 'HEDİYE',
            'log_out': 'ÇIKIŞ',
            'recently_played': 'Recently Played'
        },
        'de': {
            'news': 'NACHRICHTEN',
            'games': 'SPIELE',
            'recharge': 'AUFLADEN',
            'forum': 'FORUM',
            'support': 'SUPPORT',
            'account': 'KONTO',
            'my_gift': 'Meine Geschenke',
            'log_out': 'abmelden',
            'recently_played': 'Kürzlich gespielt'
        },
        'pt': {
            'news': 'NOTÍCIAS',
            'games': 'JOGOS',
            'recharge': 'RECARGA',
            'forum': 'FÓRUM',
            'support': 'SUPORTE',
            'account': 'CONTA',
            'my_gift': 'Meu PRESENTE',
            'log_out': 'SAIR',
            'recently_played': 'Tocado recentemente'
        }
    }

    // 全局对象，接口
    var _control = {
        // 给该类对象注入属性变量
        injectAttr: function(key, val){
            this[key] = val;
        },

        // 获取类属性
        getter: function(key){
            return this[key];
        }
    }

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "37Header.html";

        this.ready = function(){
            _HeaderAction.init();
        };

        this.getInitRenderParams = function(callback,platform){
            platform = platform || {
                id: 1,
                abbreviation: 'en'
            };

            _control.injectAttr('platformId', platform.id)
            _control.injectAttr('platform', platform.abbreviation)
           	callback({
                platformId: platform.id, // 英文平台, id为1
                platform: platform.abbreviation, // 英文平台, id为1
                title: '37games公共头部',
                lang: LANG[platform.abbreviation]  // 多语言文本
            });
        }

    }

    // header模块逻辑处理
    var _HeaderAction = {
        state: {
            gamesBoxOpen: false,
            accountBoxOpen: false,  // 个人资料
            countryBoxOpen: false
        },
        el: {
            $root: $('body'),
            $game: null,
            $gamesBox: null,
            $haveAccountA: null,
            $accountBox: null,
            $countryBox: null,
            $select: null
        },

        init: function(){
            if (window.PIE) {
                $('.pie').each(function() {
                    PIE.attach(this);
                });
            }

            this.actionGetUserInfo();

            this.bindEvent();
        },

        elSetter: function(key,val){
            this.el[key] = this.el[key] ? this.el[key] : val;
        },

        elGetter: function(key, val){
            if(!this.el[key]){
                this.elSetter(key, val);
            }

            return this.el[key];
        },

        bindEvent: function(){
            var me = this;

            // 点击页面其他地方，隐藏下拉框
            $(document).on("click",function (e) {
                var game = me.elGetter('$game', $("header .games")).get(0),
                    gamesBox = me.elGetter('$gamesBox', $("header .gamesBox")).get(0),
                    haveAccountA = me.elGetter('$haveAccountA', $("header .haveAccount a")).get(0),
                    accountBox = me.elGetter('$accountBox', $("header .accountBox")).get(0),
                    country = $("header .select").get(0),
                    countryBox = me.elGetter('$countryBox', $("header .countryBox")).get(0),
                    event=window.event||e,
                    target = event.target||event.srcElement;
                if (game !==target && !$.contains(game, target) && gamesBox!==target&& !$.contains(gamesBox,target)) {
                    me.hideGameBox(me.elGetter('$gamesBox', $("header .gamesBox")));
                }
                if (haveAccountA !==target && !$.contains(haveAccountA, target)&&accountBox!==target&& !$.contains(accountBox,target)) {
                    me.hideAccountBox(me.elGetter('$accountBox', $("header .accountBox")));
                }
                if (country !==target && !$.contains(country, target)&&countryBox!==target&& !$.contains(countryBox,target)) {
                    me.hideCountryBox(me.elGetter('$countryBox', $("header .countryBox")));
                }
            });

            // 展开游戏下拉面板
            this.el.$root.on('click', 'header .games', function(event) {
                event.preventDefault();
                if(me.state.gamesBoxOpen){
                    me.hideGameBox(me.elGetter('$gamesBox', $("header .gamesBox")));
                }else{
                    me.actionGetGameLists();
                }
            });

            this.el.$root.on('click', "header .haveAccount a", function(event) {
                event.preventDefault();
                /* Act on the event */
                if(me.state.accountBoxOpen){
                    me.hideAccountBox(me.elGetter('$accountBox', $("header .accountBox")));
                }else{
                    me.showAccountBox(me.elGetter('$accountBox', $("header .accountBox")));
                }
            });

            $("header .select").click(function() {
                if(me.state.countryBoxOpen){
                    me.hideCountryBox(me.elGetter('$countryBox', $("header .countryBox")));
                }else{
                    me.showCountryBox(me.elGetter('$countryBox', $("header .countryBox")));
                }
                
            });

            // 退出登录
            $("header .logout").click(function(event) {
                /* Act on the event */
                me.logout();
            });
        },

        actionGetGameLists: function(){
            var me = this,
                plat = _control.getter('platformId');
            $.getJSON('//eventsapi.37.com/static_activity/index_game?callback=?', {platformid: plat}, function(gamesRes, textStatus) {
                if(gamesRes.data.length > 0){
                    me.setGameList(gamesRes.data);
                }
            });
        },

        setGameList: function(games){
            var html = "",
                len = games.length;

            for(var i=0,l=len-1; i<l; i++){
                html += "<li><a href=\""+ games[i].SITE_URL +"\">";
                html += "<img src=\""+ games[i].GAME_SMALL_LOGO_PIC +"\">";
                html += "<span class=\"text\">"+ games[i].REAL_NAME +"</span></a></li>";
            }

            if(_control.getter("platformId") == 1) { // 欧美英文平台
                html += "<li><a href=\""+ games[i].SITE_URL +"\">";
                html += "<img src=\""+ games[i].GAME_SMALL_LOGO_PIC +"\">";
                html += "<span class=\"text\">"+ games[i].REAL_NAME +"</span></a></li>";
                html += "<li class=\"last\"><a href=\"//play.37.com\"><img src=\"//hw37ptres-a.akamaihd.net/images/play/icon-playcenter.png\"><span class=\"text\">Games Catalog</span></a></li>"
            }else{
                html += "<li class=\"last\"><a href=\""+ games[i].SITE_URL +"\">";
                html += "<img src=\""+ games[i].GAME_SMALL_LOGO_PIC +"\">";
                html += "<span class=\"text\">"+ games[i].REAL_NAME +"</span></a></li>";
            }
            $('#J_game_box').html(html);
            // 展开下拉框
            this.showGamesBox(this.elGetter('$gamesBox', $("header .gamesBox")));
        },

        showGamesBox: function($el) {  //打开下拉框
            $el.show();
            this.hideAccountBox(this.elGetter('$accountBox', $("header .accountBox")));
            this.hideCountryBox(this.elGetter('$countryBox', $("header .countryBox")));

            this.elGetter('$game', $("header .games")).addClass('hover');

            this.state.gamesBoxOpen = true;
        },

        hideGameBox:function($el) { //隐藏下拉框
            $el.hide();
            this.elGetter('$game', $("header .games")).removeClass('hover');
            this.state.gamesBoxOpen = false;
        },

        // 个人资料
        showAccountBox:function($el) { //打开下拉框
        
            $el.show();
            this.hideGameBox(this.elGetter('$gamesBox', $("header .gamesBox")));
            this.hideCountryBox(this.elGetter('$countryBox', $("header .countryBox")));
            this.elGetter('$haveAccountA', $("header .haveAccount a")).addClass('hover');
            this.state.accountBoxOpen = true;        
        },

        hideAccountBox:function($el) { //隐藏下拉框
    
            $el.hide();

            this.elGetter('$haveAccountA', $("header .haveAccount a")).removeClass('hover');
            this.state.accountBoxOpen = false;
        },

        showCountryBox:function($el) { //打开下拉框
        
            $el.show();
            this.hideGameBox(this.elGetter('$gamesBox', $("header .gamesBox")));
            this.hideAccountBox(this.elGetter('$accountBox', $("header .accountBox")));
            this.state.countryBoxOpen = true;
            this.elGetter('$select', $('header .middle .select')).addClass('select-blue');
        },

        hideCountryBox:function($el) { //隐藏下拉框
        
            $el.hide();

            this.state.countryBoxOpen = false;
            this.elGetter('$select', $('header .middle .select')).removeClass('select-blue');
        },

        logout: function(){

            var plat = _control.getter('platformId');

            $.getJSON('//passport.37.com/account/login/logout?callback=?', {platformid: plat}, function(logoutRes, textStatus) {

                if(typeof logoutRes.data.url!='undefined'&&typeof logoutRes.data.url[0]!='undefined'){
                    // 平台与论坛同步退出
                    require([logoutRes.data.url[0],logoutRes.data.url[1]],function(){
                        window.location.href=logoutRes.data.forward;
                    });
                }else{
                    window.location.href=logoutRes.data.forward;
                }
            });
        },

        actionGetUserInfo: function(){
            var me = this,
                plat = _control.getter('platformId');

            $.getScript('//passport.37.com/account/users_info?platform='+plat, function() {
                me.setGameBox(user);
                me.setAccount(user);

            });
        },

        // 设置游戏下拉框
        setGameBox: function(user){
            var $gamesBox = this.elGetter('$gamesBox', $("header .gamesBox"));
            // 登录框登录成功后内容
            if (user != null && user.PLAY_HISTORY != '') {
                var playHistory = $.parseJSON(user.PLAY_HISTORY); //玩过的游戏,只有三个
                // 玩过游戏列表渲染
                this.setPlayHistory(playHistory);
            }
        },

        setAccount: function(user){
            var $noAccount = $("header .noAccount");
            var $haveAccont = $("header .haveAccount");

            if (user != null) {
                // 个人资料项
                $noAccount.hide(); //隐藏菜单noAccount项
                if(utils.strLen(user.LOGIN_ACCOUNT)>10){
                    var accout=utils.subString(user.LOGIN_ACCOUNT,10,true);
                }else{
                    var accout=user.LOGIN_ACCOUNT;
                }
                $haveAccont.show();//展现菜单haveAccount项
                $haveAccont.find('.accountName').html(accout);
                $haveAccont.find('.img').html(user.AVATAR_PIC);
                
                //用户头像
                if (user.AVATAR_PIC != '') { 
                    $("header .smallPhoto img").attr('src', user.AVATAR_PIC);
                }
            }
        },

        setPlayHistory: function(datas) {
            var len = datas.length;
            if(len > 0){
                var html = "<ul><li class=\"first\">"+ LANG[_control.getter("platform")].recently_played +"</li>";
                for(var i=0; i<len; i++){
                    html += "<li><a href=\"//playgame.37.com/play_games/play/pid/"+ _control.getter("platformId") +"/gid/"+ datas[i].GAME_ID +"/sid/"+ datas[i].SERVER_SID + "\">";
                    html += "<div class=\"rightLeft\"><img src=\""+ datas[i].GAME_SMALL_LOGO_PIC +"\"></div>";
                    html += "<div class=\"rightRight\"><div class=\"rightUp\">"+ datas[i].GAME_NAME +"</div>";
                    html += "<div class=\"rightDown\">S "+ datas[i].SERVER_SID +"</div></div></a></li>"
                }
                html += "</ul>";

                $("#J_history").html(html);
            }
        }
        
    }

    return new Builder();
})