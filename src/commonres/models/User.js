define(["ocean", "./BaseModel", "activityConfig"], function(ocean, BaseModel, activityConfig) {

    return ocean.model("user", function() {
        var me = this;
        var loaded = false;
        var loginDone = false;
        this.fields = {
            avatar: {
                mapping: "USER_INFO.AVATAR",
                type: "string"
            },
            id: {
                mapping: "USER_INFO.ID"
            },
            name: {
                mapping: "USER_INFO.LOGIN_ACCOUNT"
            },
            fb: {
                mapping: "USER_INFO.FB_ACCOUNT"
            },
            phone: {
                mapping: "USER_INFO.PHONE"
            },
            type: {
                mapping: "USER_INFO.USER_TYPE"
            },
            email: {
                mapping: "USER_INFO.EMAIL"
            },
            sex: {
                mapping: "USER_INFO.SEX"
            }
        };


        this.loginUrl = {
            "events.gm99.com": {
                "pc": "//passport.gm99.com/?cid=170&scid=twactivity&device=1&forward=",
                "mobile": "//passport.gm99.com/?cid=170&scid=twactivity&device=2&forward="
            },
            "events.37.com": {
                "pc": "",
                "mobile": ""
            },
            "events.ujoy.com": {
                "pc": "//passport.ujoy.com/?device=1&zone=zh&forward=",
                "mobile": "//passport.ujoy.com/?device=2&zone=zh&forward="
            },
            "events.gmthai.com": {
                "pc": "https://www.gmthai.com/member/login/?forward=",
                "mobile": "https://www.gmthai.com/member/login/?forward="
            }
        }

        this.logoutUrl = {
            "events.gm99.com": "//passport.gm99.com/login/logout2",
            "events.37.com": "",
            "events.ujoy.com": "//passport.ujoy.com/login/logout",
            "events.gmthai.com": "//www.gmthai.com/member/login/logout"
        }

        /*
        @param callback 加载成功的回调函数
        		@param errmsg 如果加载发生错误的时候，返回错误信息，如果加载成功，返回空字符串""。
        		@param record 加载成功后，数据经过处理后，会被复制到当前的作用域 this 上，然后将this 返回。
        		@param activiti_res 出国前两者提供的信息都无法满足你的需求，我会把原始的ajax的respone  返回给你，你自己处理。
        */
        this.load = function(callback) {
            var domain = activityConfig.getApiDomain();
            var activity_id = activityConfig.getActivityId();
            var url = domain + "/static_activity/activity_info?name=" + activity_id;
            ocean.ajax.jsonp(url, {}, function(errmsg, activity_info, activiti_res) {
                loaded = true;
                if (errmsg) {
                    loginDone = false;
                    callback(errmsg, me, activity_info, activiti_res);
                } else {
                    loginDone = !!activity_info.activitys.USER_INFO;
                    me.setMappingRecord(activity_info.activitys);
                    callback("", me, activity_info, activiti_res);
                }
            });
        };

        /*
        @param callback 获取登录状态成功的回调函数
        		@param loginDone 是否登录成功
        */
        this.getLoginStatus = function(callback) {
            if (loaded) {
                callback(loginDone, me);
            } else {
                this.load(function() {
                    callback(loginDone, me);
                });
            }
        }

        this.getInfo = function(callback) {
            if (loaded) {
                callback(me);
            } else {
                this.load(function() {
                    callback(me);
                });
            }
        }

        this.login = function() {
            var host = window.location.host;
            var platform = ocean.deviceChecker.isPhone() ? "mobile" : "pc";
            var loginHref = this.loginUrl[host][platform] + window.encodeURIComponent(window.location.href);
            window.location.href = loginHref;
        }

        this.logout = function() {
            var host = window.location.host;
            var loginUrl = this.logoutUrl[host];
            $.ajax({
                url: loginUrl,
                type: 'get',
                data: {
                    forward: window.encodeURIComponent(window.location.href)
                },
                jsonp: 'callback',
                async: true,
                dataType: 'jsonp',
                success: function(logout_res) {
                    if (!!logout_res.result) {
                        window.location.href = decodeURIComponent(logout_res.forward);
                    }
                }
            });
        }

    }, "baseModel");
});