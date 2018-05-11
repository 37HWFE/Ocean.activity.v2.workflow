define(['jquery',"HeaderBuider"], function($,HeaderBuider) {
   

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "gmthaiHeader.html";

        this.ready = function(){
            logicBuilder.init();
        };

        this.getInitRenderParams = function(callback){
            callback({
                forward : window.encodeURIComponent(window.location.href)
            });
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
            $.getJSON('//www.gmthai.com/ajax/user_info_ajax?callback=?',{},function(res){
                if(res.result == 1){
                    loginSucc && loginSucc(res.data);
                }else{
                    loginFail && loginFail();
                }
            });
        },

        logout: function () {
            $.getJSON('//www.gmthai.com/member/login/logout/?callback=?', {
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
})