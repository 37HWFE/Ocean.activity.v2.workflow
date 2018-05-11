define(["ocean","./tips", "Utils"],function(ocean,tips, Utils){
    // 在入口js(pc.js mobile.js 已经针对PC 和mobile 分别引入jquery和 zepto)
    // 然后以调用ocean.setQuery()API注入到ocean 的query属性中
    // 在后续的模块，无需再判断当前的运行环境是PC还是mobile 来分解加载jquery 或zepto 模块。
    // 而是直接使用入口程序注入的依赖 ocean.query；
    // 开发的时候，请把这部分注释删除掉
    window.$ = ocean.query;

    var utils = new Utils();
    //ocean 提供了API来绑定事件，大家可以尽情试用
    /*
        var fbShre = function(){
            //todo share
        };

        ocean.clickEvents({
            ".selector" : fbShre
        })

    */
   // 获取当前浏览器语言版本
   var currlang;
    var type = navigator.appName;
　　if (type == "Netscape"){
    　　var lang = navigator.language;//获取浏览器配置语言，支持非IE浏览器
　　}else{
    　　var lang = navigator.userLanguage;//获取浏览器配置语言，支持IE5+ == navigator.systemLanguage
　　};
　　var currlang = lang.substr(0, 2);//获取浏览器配置语言前两位

    var TIPS;var lists;
    var zone = currlang;
    if (utils.getParam('zone')) {
      zone = utils.getParam('zone') || 'th';
    }
    switch(zone) {
      case "zh":
        TIPS = tips.ZH;
        break;
      case "tw":
        TIPS = tips.TW;
        break;
      case "en":
        TIPS = tips.EN;
        break;
    }
    return {
        state: {
            game: null,
            server: null,
            role: null,
            roleName: null,
            dialogId: null,  // 当前选择列表类型
            popId: null,  // 弹窗类型
            isGames: false,  // 是否已经获取games
            games: null,  // 游戏s
            servers: null,  // 伺服器s
            roles: null,  // 角色s
            records: []  // 兑奖记录
        },

        games: {
            '14': '永恒纪元',
            '17': 'War of Rings',
            '20': '权利与荣耀',
            '27': '青云诀'
        },

        el: {
            $mask: $('#J_mask'),
            $mask2: $('#J_mask2'),
            $dialog: $('#J_dialog'),
            $lists: $('#J_lists'),
            $record: $('#J_record')
        },

        init : function(){
            this.initLang();
            this.bindEvent();
            this.autoAction();
            this.initMask2Height();

        },
        initLang: function() {
          $("[data-lang='curr-lang']").text(TIPS.currlang);
          $("[data-lang='homepage']").text(TIPS.homepage);
          $("[data-lang='recharge']").text(TIPS.recharge);
          $("[data-lang='service']").text(TIPS.service);
          $("[data-lang='login']").text(TIPS.login);
          $("[data-lang='register']").text(TIPS.register);
          $("[data-lang='account']").text(TIPS.account);
          $("[data-lang='logout']").text(TIPS.logout);
          $("[data-lang='code-exchange']").text(TIPS.codeexchange);
          $("[data-lang='chose-game']").text(TIPS.chosegame);
          $("[data-lang='chose-server']").text(TIPS.choseserver);
          $("[data-lang='chose-character']").text(TIPS.chosecharacter);
          $("[data-lang='input-gift-code']").attr("placeholder", TIPS['input-gift-code']);
          $("[data-lang='input-verify-code']").attr("placeholder", TIPS['input-verify-code']);
          $("[data-lang='exchange']").text(TIPS.exchange);
          $("[data-lang='exchange-log']").text(TIPS.exchangelog);
          $("[data-lang='noticetitle']").text(TIPS.noticetitle);
          $("[data-lang='line1']").text(TIPS.line1);
          $("[data-lang='line2']").text(TIPS.line2);
          $("[data-lang='line3']").text(TIPS.line3);
        },
        initMask2Height:function(){
            var me = this;

            var documentHeight = $(document).height() || 0;
            var _style = documentHeight?{height:documentHeight+"px"}:{position:"fixed",height:"100%"};

            me.el.$mask2.css(_style)
        },
        bindEvent: function(){
            var me = this;
            // 选择列表
            $('body').on('click', '.J_select', function(event) {
                event.preventDefault();
                var index = $(this).index();
                if(!me.state.game || index == 0){
                    me.state.dialogId = 'game';
                }else if(!me.state.server || index == 1){
                    me.state.dialogId = 'server';
                }else if(!me.state.role || index == 2){
                    me.state.dialogId = 'role';
                }else{
                    return;
                }
                me.showDialog();
            });

            // 关闭弹窗
            $('body').on('click', '.mask,.mask2,#J_exit', function(event) {
                event.preventDefault();
                me.hidePop();
            });

            // 列表选择
            $('body').on('click', '.list', function(event) {
                event.preventDefault();
                var id = $(this).data('id');
                if(!id) return;
                me.selected(id,$(this).data('name'));
                me.hideDialog();
            });

            // 兑奖
            $('body').on('click', '#J_change', function(event) {
                event.preventDefault();
                me.doChange();
            });

            // 兑奖记录
            $('body').on('click', '#J_btn_record', function(event) {
                event.preventDefault();
                me.showRecord();
            });

            // 刷新验证码
            $('body').on('click', '.J_fresh', function(event) {
                event.preventDefault();
                me.refreshCode();
            });
        },

        selected: function(id,name){
            var dialogId = this.state.dialogId;

            switch(dialogId){
                case 'game': {
                    this.state.game = id;
                    $('#J_game').text(name);
                    break;
                }
                case 'server': {
                    this.state.server = id;
                    $('#J_server').text(name);
                    break;
                }
                case 'role': {
                    this.state.role = id;
                    this.state.roleName = name;
                    $('#J_role').text(name);
                    break;
                }
            }
        },

        getDialogLists: function(fn){
            var id = this.state.dialogId;
            switch(id){
                case 'game':{
                    this.getGames(fn);
                    break;
                }
                case 'server':{
                    this.getServers(fn);
                    break;
                }
                case 'role':{
                    this.getRoles(fn);
                    break;
                }
                default:{
                    this.getGames(fn);
                    break;
                }
            }
        },

        getGames: function(fn){
            var me = this;
            if(this.state.isGames){
                typeof fn == "function" && fn('game');
            }else{
                $.getJSON('//eventsapi.ujoy.com/serial_exchange/game_lists?callback=?',{},function(res){
                    if(res.result == 1){
                        me.state.games = res.data;
                        me.state.isGames = true;
                        typeof fn == "function" && fn('game');
                    }else{
                        me.dialog(res.code,res.msg);
                        if(res.code == '-1004'){
                            me.doLogin();
                        }
                    }
                });
            }
        },

        getServers: function(fn){
            var me = this;
            $.getJSON('//eventsapi.ujoy.com/serial_exchange/server_lists?callback=?',{
                game_id: this.state.game
            },function(res){
                if(res.result == 1){
                    me.state.servers = res.data;
                     typeof fn == "function" && fn('server');
                }else{
                    me.dialog(res.code,res.msg);
                    if(res.code == '-1004'){
                        me.doLogin();
                    }
                }
            });
        },

        getRoles: function(fn){
            var me = this;
            $.getJSON('//eventsapi.ujoy.com/serial_exchange/get_game_role?callback=?',{
                game_id: this.state.game,
                server_id: this.state.server
            },function(res){
                if(res.result == 1){
                    me.state.roles = res.data;
                     typeof fn == "function" && fn('role');
                }else{
                    me.dialog(res.code,res.msg);
                    if(res.code == '-1004'){
                        me.doLogin();
                    }
                }
            });
        },

        showDialog: function(){
            var me = this;
            this.state.popId = 'dialog';
            this.getDialogLists(function(type){
                var html = '';

                switch(type){
                    case 'game': {
                        lists = me.state.games;
                        for(var key in lists){
                            html += '<li class="list" data-id="'+ key +'" data-name="'+ lists[key] +'">'+ lists[key] +'</li>';
                        }
                        break;
                    }
                    case 'server': {
                        lists = me.state.servers;
                        for(var key in lists){
                            html += '<li class="list" data-id="'+ lists[key].ID +'" data-name="'+ lists[key].NAME +'">'+ lists[key].NAME +'</li>';
                        }
                        break;
                    }
                    case 'role': {
                        lists = me.state.roles;
                        for(var i=0,l=lists.length; i<l; i++){
                            html += '<li class="list" data-id="'+ lists[i].roleID +'" data-name="'+ lists[i].roleName +'">'+ lists[i].roleName +'</li>';
                        }
                        break;
                    }
                }

                html = html ? html : '<li class="list">'+TIPS.nodata+'</li>';
                me.el.$lists.html(html);
                me.el.$mask.show();
                me.el.$dialog.show();
            });
        },

        hideDialog: function(){
            this.state.popId = null;
            this.el.$dialog.hide();
            this.el.$mask.hide();
        },

        showRecord: function(){
            var me = this;
            this.state.popId = 'record';
            this.getRecords(function(){
                var $records = $('#J_records');
                var lists = me.state.records.reverse();
                var html = "";
                var length = lists.length;
                for(var i=0,l=length; i<l; i++){
                    html += '<li class="popup-record">\
                        <div class="popup-left">\
                            <p class="popup-game">'+ lists[i].NAME +'</p>\
                            <p class="popup-code">'+ me.games[lists[i].GAME_ID] +'</p>\
                        </div>\
                        <div class="popup-right">\
                            <p class="popup-role">'+ lists[i].ROLE_NAME +'</p>\
                            <p class="popup-time">'+ lists[i].TIME +'</p>\
                        </div>\
                    </li>';
                }

                if(length <= 0){
                    html = '<li class="nocards">'+TIPS.norecord+'</li>';
                }
                $records.html(html);
                me.el.$mask2.show();
                me.el.$record.show();

                me.autoAlertPosition(me.el.$record);
            })
        },

        hideRecord: function(){
            this.state.popId = null;
            this.el.$record.hide();
            this.el.$mask2.hide();
        },

        hidePop: function(){
            if(!this.state.popId) return;

            if(this.state.popId == 'dialog'){
                this.hideDialog();
            }else{
                this.hideRecord();
            }
        },

        getRecords: function(fn){
            var me = this;
            if(this.state.isRecord){
                typeof fn == 'function' && fn();
            }else{
                $.getJSON('//eventsapi.ujoy.com/serial_exchange/select_award?callback=?',{},function(res){
                    if(res.result == 1){
                        me.state.isRecord = true;
                        me.state.records = res.data;
                        typeof fn == 'function' && fn();
                    }else{
                        me.dialog(res.code,res.msg);
                    }
                })
            }
        },

        doChange: function(){
            if(!this.state.game){
                this.dialog('notGame');
                return;
            }
            if(!this.state.server){
                this.dialog('notServer');
                return;
            }
            if(!this.state.role){
                this.dialog('notRole');
                return;
            }

            var card = $.trim($('#J_card').val());
            if(!card){
                this.dialog('notCard');
                return;
            }

            var code = $.trim($('#J_code').val());
            if(!code){
                this.dialog('notCode');
                return;
            }
            var me = this;
            $.getJSON('//eventsapi.ujoy.com/serial_exchange/get_award?callback=?',{
                game_id: this.state.game,
                server_id: this.state.server,
                role_id: this.state.role,
                role_name: this.state.roleName,
                code: card,
                check_code: code
            },function(res){
                me.refreshCode();
                $('#J_card').val('');
                $('#J_code').val('');
                if(res.result == 1){
                    me.state.isRecord = false;
                    me.dialog('changeSucc');
                }else{
                    me.dialog(res.code,res.msg);
                }
            })
        },

        refreshCode: function(){
            var src = '//eventsapi.ujoy.com/serial_exchange/check_code?r=' + new Date().getTime();
            $('#J_imgcode').attr('src',src);
        },

        dialog: function(code,msg){
            if(TIPS[code]){
                alert(TIPS[code]);
            }else{
                alert(msg);
            }
        },

        doLogin: function(){
            window.location.href = "//passport.ujoy.com/?type=yhjy&zone=zh&forward="+window.location.href;
        },

        autoAction:function(){
            var me = this;

            me.getUrlParams();

            var getServer = function(){
                if(null != me.state.server){
                    me.autoSelectServer(function(){
                        me.autoSelectRole();
                    });
                }
            };

            if(null != me.state.game){
                me.autoSelectGame(getServer);
            }
        },
        getUrlParams:function(){
            var me = this;

            var gid = me.getUrlParamsByName("gid");
            var sid = me.getUrlParamsByName("sid");

            me.state.game = gid;
            me.state.server = sid;
        },
        getUrlParamsByName:function(_name){
            var me = this;

            var url = window.location.href;
            var r = '[\?&]+'+_name+'=([^&]+)*';
            var b = url.match(new RegExp(r,'i'));
            return b ? b[1] : '';
        },

        autoSelectGame:function(_afterFn){
            var me = this;
            var lists;

            me.state.dialogId = "game";
            this.getGames(function(){
                lists = me.state.games;

                for(var key in lists){
                    if(me.state.game == key){
                        me.selected(key,lists[key]);

                        _afterFn && _afterFn instanceof Function?_afterFn():"";

                        break;
                    }
                }
            });
        },
        autoSelectServer:function(_afterFn){
            var me = this;
            var lists;

            me.state.dialogId = "server";
            this.getServers(function(){
                lists = me.state.servers;

                for(var key in lists){
                    var item = lists[key];

                    if(me.state.server == item.SID){
                        me.selected(item.ID,item.NAME);

                        _afterFn && _afterFn instanceof Function?_afterFn():"";

                        break;
                    }
                }
            });
        },
        autoSelectRole:function(_afterFn){
            var me = this;
            var lists;

            me.state.dialogId = "role";
            this.getRoles(function(){
                lists = me.state.roles;
                var length = lists.length || 0;

                if(length <= 0){

                    _afterFn && _afterFn instanceof Function?_afterFn():"";
                }else{
                    var item = lists[0];

                    me.selected(item.roleID,item.roleName);
                    _afterFn && _afterFn instanceof Function?_afterFn():"";
                }
            });
        },
        /**
         * 自动适配弹窗位置，不能使用固定fix
         * @param  {[type]} _panel [description]
         * @return {[type]}        [description]
         */
        autoAlertPosition:function(_panel){
            var $box = _panel;
            var $window = $(window);
            var scrollTop = $window.scrollTop();
            var boxHeight = $box.height();
            var windowHeight = $window.height();

            var top = 0;

            if(windowHeight < boxHeight){
                top = scrollTop + 10;
            }else{
                var mid = (windowHeight - boxHeight) / 2;

                top = mid + scrollTop;
            }

            if (window.device === 'mobile') {
                $box.css({
                    'top': (top / 75) + 'rem',
                    'margin-top': '0'
                });
            } else {
                $box.css('top', top + 'px');
            }
        }
    }

})
