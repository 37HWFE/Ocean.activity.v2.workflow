define(['zepto',"HeaderBuider"], function($,HeaderBuider) {

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "gm99Header.html";

        this.getInitRenderParams = function(callback){
            callback({
                forward : window.encodeURIComponent(window.location.href)
            });
        }

        this.ready = function(){
            logicBuilder.init();
        }
    }

    var logicBuilder = {
        init: function(){
            var me = this;

            this.checkLogin(function(data){
                $('#J_user').text(data.LOGIN_ACCOUNT).show();
                $('#J_login').hide();
                $('#J_logout').show();
            });

            $('body').on('click', '#J_logout', function(event) {
                event.preventDefault();
                me.logout();
            });
        },

        checkLogin: function(loginSucc,loginFail){
            $.getJSON('//passport.gm99.com/ajax/get_user_json?callback=?',{},function(res){
                if(res.result == 1){
                    loginSucc && loginSucc(res.data);
                }else{
                    loginFail && loginFail();
                }
            });
        },

        logout: function () {
            $.getJSON('//passport.gm99.com/login/logout2?callback=?', {
                forward: window.location.href
            },function(logoutRes) {
                if (logoutRes.result == 1) {
                    window.location.href = decodeURIComponent(window.location.href);
                }else{
                    alert(logoutRes.msg);
                }
            });
        }
    }

    return new Builder();
});
