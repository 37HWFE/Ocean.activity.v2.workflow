define(['jquery', 'HeaderBuider', 'jqueryCookies', 'jqueryMsSlidePic'], function($, HeaderBuider) {
  var Builder = function() {
    HeaderBuider.call(this);
    this.templateUrl = 'gmthaiHeader.html';
    this.getInitRenderParams = function(callback) {
      callback({
        forward: window.location.href
      });
    }
    this.ready = function() {
      headerController.init();
    }
  }
  var headerController = {
    // 0: login, 1: register, 3: index
    top_box_type: 3,
    // 域名
    $Http: '//www.gmthai.com',
    /**
     * 初始化头部
     * @return {[type]} [description]
     */
    init: function() {
      var me = this;
      me.initAd();
      me.checkLogin();
      me.btnClick();
      me.popUp();
    },
    /**
     * 初始化顶栏广告图
     * @return {[type]} [description]
     */
    initAd: function() {
      var me = this;
      var el = {
        $topSlide: $('#topSlide')
      };
      var slidePicThumb = function() {
        var slideNum = parseInt($topSlide.find('.ms-slide-pic-num').find('.curr').text(), 10) || 1;
        $topSlide.find('.ms-slide-pic-num').hide();
        if (topPicThumb.hasOwnProperty(slideNum - 1)) {
          $('.top_gift_icon').css({
            width: '234px',
            background: 'url(' + topPicThumb[(slideNum - 1)] + ')'
          });
        }
      };
      // 加载顶部广告图
      $.ajax({
        url: '//eventsapi.gmthai.com/static_activity/article_pop?websiteid=1&type=pop&position=website_top&num=4',
        type: 'get',
        data: {},
        jsonp: 'callback',
        async: true,
        dataType: 'jsonp',
        success: function(res) {
          var data = res.data;
          if (data && data.length !== 0) {
            var topPics = [];
            var topPicThumb = {};
            var topPicConfig = {
              width: 991,
              height: 181,
              speed: 3000
            };
            for (var i = 0; i < data.length; i++) {
              topPics[i] = {
                img: data[i].PIC_URL,
                url: data[i].URL,
                title: data[i].TITLE,
                target: data[i].TARGET
              };
              topPicThumb[i] = data[i].PIC_THUMB_URL;
            }
            if (topPics.length != 0) {
              $topSlide.msSlidePic(topPics, topPicConfig);
              slidePicThumb();
              setInterval(function() {
                slidePicThumb();
              }, 3000);
            }
          }
        }
      });
    },
    /**
     * 检查登录状态
     * @return {[type]} [description]
     */
    checkLogin: function() {
      var me = this;
      var el = {
        $topOperation: $('.top_operation'),
        $topLoginedUser: $('.top_logined_user'),
        $topLogined: $('.top_logined'),
        $logoutBtn: $('.J_logout_btn'),
        $topLoginBtn: $('.top_login_btn'),
        $topRegisterBtn: $('#top_register_btn')
      };
      $.ajax({
        url: me.$Http + '/ajax/user_info_ajax',
        type: 'get',
        data: {},
        jsonp: 'callback',
        async: true,
        dataType: 'jsonp',
        success: function(res) {
          // 登录
          if (res.result == 1) {
            el.$topOperation.hide();
            el.$topLoginedUser.empty().html(res.data.LOGIN_ACCOUNT);
            el.$topLogined.removeClass('hide').show();
            // 绑定登出按钮事件
            el.$logoutBtn.on('click', function() {
              $.get(me.$Http + '/member/login/logout/', {
                forward: window.location.href
              }, function(res) {
                if (res.hasOwnProperty('bbs_sync') && res['bbs_sync']) {
                  $('head').append(res['bbs_sync'].replace('\\', ''));
                }
                if (res.result == 1) {
                  setTimeout(function() {
                    window.top.location.href = decodeURIComponent(res.forward) || '/';
                  }, 1000);
                }
              }, 'jsonp');
            });
          }
          // 未登录
          else {
            el.$topLogined.hide();
            el.$topLoginBtn.on('click', function() {
              me.__topLoginAjax();
            });
            el.$topRegisterBtn.on('click', function() {
              me.__topRegisterAjax();
            });
          }
        }
      });
    },
    /**
     * 按钮事件绑定
     * @return {[type]} [description]
     */
    btnClick: function() {
      var me = this;
      var el = {
        $topLoginBtn: $('.top_login_btn'),
        $topLoginBox: $('.top_login_box')
      }
      var uname = $.cookies.get('uname');
      if (uname != null || uname == '') {
        $('#lruname').val(uname);
      }
      el.$topLoginBtn.on('click', function() {
        var checkVal = el.$topLoginBox.find('input[name="lremember_me"]').attr('checked');
        var uname = el.$topLoginBox.find('input[name="lruname"]').val();
        var password = el.$topLoginBox.find('input[name="lrpassword"]').val();
        if (uname == null || uname == '' || password == null || password == '') {
          return false;
        } else if (checkVal == 'checked') {
          $.cookies.set('uname', uname, {
            hoursToLive: 168
          });
        }
      });
      document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
          if (me.top_box_type == 0) {
            me.__topLoginAjax();
          } else if (me.top_box_type == 1) {
            me.__topRegisterAjax();
          }
        }
      }
    },
    /**
     * 弹出层事件
     * @return {[type]} [description]
     */
    popUp: function() {
      var me = this;
      var el = {
        $topGift: $('.top_gift'),
        $topPic: $('.top_pic'),
        $topGiftIcon: $('.top_gift_icon'),
        $topLogin: $('.top_login'),
        $topRegister: $('.top_register'),
        $topRegisterPad: $('.top_register_pad'),
        $topLoginPad: $('.top_login_pad')
      };
      var speed = 300;
      el.$topGift.hover(function() {
        el.$topPic.fadeIn(speed);
        el.$topGiftIcon.fadeOut(speed);
      }, function() {
        el.$topGiftIcon.fadeIn(speed);
        el.$topPic.fadeOut(speed);
      });
      el.$topLogin.on('click', function(event) {
        event ? event.stopPropagation() : event.cancelBubble = true;
        el.$topRegisterPad.addClass('hide');
        el.$topLoginPad.removeClass('hide');
        me.top_box_type = 0;
      });
      el.$topRegister.on('click', function(event) {
        event ? event.stopPropagation() : event.cancelBubble = true;
        el.$topLoginPad.addClass('hide');
        el.$topRegisterPad.removeClass('hide');
        me.top_box_type = 1;
      });
      $(document).on('click', function() {
        el.$topLoginPad.addClass('hide');
        el.$topRegisterPad.addClass('hide');
        me.top_box_type = 3;
      });
    },
    /**
     * 登录请求
     * @return {[type]} [description]
     */
    __topLoginAjax: function() {
      var me = this;
      var isRemember;
      isRemember = $('#remember_me').is(":checked") ? 1 : 0;
      $.get(me.$Http + '/member/login/request', {
        uname: $('#lruname').val(),
        password: $('#lrpassword').val(),
        forward: window.location.href,
        remember: isRemember
      }, function(res) {
        if (res.result == 1) {
          window.location.reload();
        } else {
          if (res.hasOwnProperty('msg')) {
            alert(res.msg);
          }
        }
      }, 'jsonp');
    },
    /**
     * 注册请求
     * @return {[type]} [description]
     */
    __topRegisterAjax: function() {
      var me = this;
      var myreg = /^[A-Za-z0-9_@\-\.]{4,100}$/;
      var rusername = $('#runame').val();
      var rpassword = $('#rpassword').val();
      var rpassword2 = $('#rpassword2').val();
      if (!rusername) {
        alert(' กรุณากรอกชื่อบัญชีให้ถูก ยาว4-20ตัวอักษร รวมเลข ตัวอังกฤษและอันเดอร์สกอร์');
      } else if (!rpassword || !rpassword2) {
        alert('กรุณากรอกรหัสที่ถูกต้อง');
      } else if (!myreg.test(rusername)) {
        alert('กรุณากรอกชื่อบัญชีที่ถูกต้อง');
      } else {
        $.ajax({
          url: me.$Http + "/member/register/fast_request",
          data: {
            'uname': rusername,
            'password': rpassword,
            'repassword': rpassword2
          },
          type: 'get',
          dataType: 'jsonp',
          success: function(res) {
            if (res.result == 1) {
              var hrefArgs = me.__getArgs(location.href);
              if (hrefArgs.hasOwnProperty('activity_id')) {
                $.get(location.pathname + (location.pathname.substr(-1) == '/' ? '' : '/') + 'statistics_sign' + location.search, { account: rusername });
              }
              top.location.href = location.href;
            } else {
              alert(res.msg);
            }
          }
        });
      }
    },
    /**
     * 获取参数
     * @param  {[string]} url [链接]
     * @return {[type]}     [description]
     */
    __getArgs: function(url) {
      var args = {};
      var referrer = document.referrer;
      // 取查询字符串，以 & 符分开成数组
      var pairs = referrer.substring(referrer.indexOf('?') + 1, url.length).split('&');
      var pairsLen = pairs.length;
      for (var i = 0; i < pairsLen; i++) {
        // 查找 "name=value" 对，若不成对，则跳出循环继续下一对
        var pos = pairs[i].indexOf('=');
        if (pos == -1) {
          continue;
        }
        // 取参数名，參數值
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        // 存成对象的一个属性
        args[argname] = decodeURIComponent(value);
      }
      return args;
    }
  };
  return new Builder();
});
