import '../scss/main.scss';
// var css = require('!css-loader!resolve-url-loader!sass-loader?sourceMap!../scss/main.scss');

require(['jquery', 'ocean', 'activityConfig'],
    function(jQuery, ocean, activityConfig) {
        console.log('test');
        ocean.setQuery(jQuery);
        activityConfig.stat();

        require(['jquery', 'header', 'footer', './service'],
            function($, header, footer, service) {
                service.init();

                function setHeaderFooter() {
                    var domain = "events.ujoy.com" //ocean.location.getDomain();
                    header.render(domain, ".cm-top-bg");
                }

                var ujoyExchange = {
                    state: {
                        user: null,
                        avatar: null
                    },
                    init: function() {
                        this.checkVNLink();
                        this.getEventInfo();
                        this.bindEvent();
                    },

                    /**
                     * 公共头部部分逻辑
                     * 紧急添加去除越南渠道图标入口，20161202
                     * 去除规则：无登陆状态和没玩过越南游戏，隐藏图标，有玩过越南游戏，显示图标；
                     * @return {[type]} [description]
                     */
                    checkVNLink: function() {
                        var $vnLink = $('.vn-link');
                        $.ajax({
                            url: '//www.ujoy.com/ajax/play_history?game_id=16',
                            type: 'get',
                            data: {},
                            xhrFields: {
                                withCredentials: true
                            },
                            jsonp: 'callback',
                            async: true,
                            dataType: 'jsonp',
                            success: function(json) {
                                if (json.result === 1) {
                                    if (json.data.is_play === 1) {
                                        $vnLink.show();
                                    } else {
                                        $vnLink.hide();
                                    }
                                }
                            }
                        })
                    },

                    getEventInfo: function() {
                        var me = this;
                        $.getJSON('//eventsapi.ujoy.com/static_activity/activity_info?name=ujoyExchange&callback=?', function(infoRes, textStatus) {
                            if (infoRes.result == 1) {
                                var data = infoRes.data;
                                me.state.user = data.activitys && data.activitys.USER_INFO && data.activitys.USER_INFO.LOGIN_ACCOUNT;
                                me.state.avatar = data.activitys && data.activitys.USER_INFO && data.activitys.USER_INFO.AVATAR;

                                me.initHeader()
                            }
                        });
                    },

                    bindEvent: function() {
                        var me = this;

                        // 登出
                        $('body').on('click', '#J_logout', function(event) {
                            event.preventDefault();
                            me.logout();
                        });

                        if (typeof IE != 'undefined' && IE == 9) {
                            // 模拟输入框placeholder
                            $('body').on('focus', '.form-control', function(event) {
                                event.preventDefault();
                                $(this).siblings('.placeholder').hide();
                            });

                            $('body').on('blur', '.form-control', function(event) {
                                event.preventDefault();
                                var val = $.trim($(this).val());
                                if (val) return;
                                $(this).siblings('.placeholder').show();
                            });

                            $('body').on('click', '.placeholder', function(event) {
                                event.preventDefault();
                                $(this).hide();
                                $(this).siblings('.form-control').focus();
                            });
                        }
                    },

                    initHeader: function() {
                        if (!this.state.user) return;
                        $('.ujoy-header').addClass('ujoy-header-islogin');
                        $('.J_avatar').attr('src', this.state.avatar);
                        $('#J_login_before').addClass('hide');
                        $('#J_login_after').removeClass('hide');
                        $('#J_user').text(this.state.user);
                    },

                    logout: function() {
                        var forward = window.location.href;
                        $.getJSON('//passport.ujoy.com/login/logout?callback=?', {
                            forward: forward
                        }, function(res) {
                            if (res.result == 1) {
                                window.location.href = forward;
                            } else {
                                service.dialog('logoutFail');
                            }
                        });
                    }
                }

                ujoyExchange.init();
            });
    });