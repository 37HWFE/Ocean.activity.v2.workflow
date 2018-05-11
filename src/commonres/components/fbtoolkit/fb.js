/**
 * @func: fb相关功能
 * @author:丘东伟
 * @time: 2016-4-25
 */

define(function (require, exports, module) {
    var fb = {
        opts:null,
        init: function (options,callback) {
            this.opts = options;
            if (options.appId && options.appId != "") {
                window.fbAsyncInit = function() {
                    FB.init({
                        appId: options.appId,
                        // status: true,
                        // cookie: true,
                        xfbml: true,
                        // oauth: true,
                        version: 'v2.6'
                    });

                    callback && callback instanceof Function?callback():"";
                };

                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/zh_TW/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }else{
                alert('請初始化APP_ID');
            }
        },

        // 分享功能
        share: function (callbacks) {
            var info = {
                method: 'feed',
                link: this.opts.link,
                picture: this.opts.picture,
                title: this.opts.title,
                description: this.opts.description
            };
            FB.getLoginStatus(function(response) {
                var fb_name = '';
                var fb_id = '';
                if (response.status === 'connected') {
                    fb_id = response.authResponse.userID;

                    FB.api('/me', function(resp) {
                        fb_name = resp.name;
                    });
                    // 检测用户登录信息
                    FB.ui(info, function(res) {
                        if (res && !res.error_message && typeof callbacks.success === "function") {
                            callbacks.success(fb_name, fb_id);
                        } else if (callbacks.fail && typeof callbacks.fail === "function") {
                            callbacks.fail(res);
                        }
                    });
                } else {
                    FB.login(function(response) {
                        fb_id = response.authResponse.userID;

                        FB.api('/me', function(response) {
                            fb_name = response.name;
                        });
                        FB.ui(info, function(res) {
                            console.log(res)
                            if (res && !res.error_message && typeof callbacks.success === "function") {
                                callbacks.success(fb_name, fb_id);
                            } else if (callbacks.fail && typeof callbacks.fail === "function") {
                                callbacks.fail(res);
                            }
                        });
                    });
                }
            });
        }
    };

    // 对外暴露接口
    module.exports = fb;

    // 挂载到window下
    // window.fb = fb;

});