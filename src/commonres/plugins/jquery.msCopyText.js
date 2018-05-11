//要包含這個文件 <script type="text/javascript" src="/js/ZeroClipboard.min.js"></script>
//使用方法  $('#copyText').msCopyText( '{$follow_url}', { showTextId :'pop7_share'} );
//   $('按鈕對象ID').msCopyText( '要顯示的文本', { showTextId :'要顯示文本的對象ID'} );

;(function ($) {
    $.fn.msCopyText = function (copyText, options) {
        //設置默認變數
        $.fn.msCopyText.defaults = {
            showTextId: 'showText'  //要顯示文本內容的對象
        };
        //合并默認參數
        var opts = $.extend({}, $.fn.msCopyText.defaults, options);
        //把對象放進 $this
        var $this = $(this);

        $this.attr({ 'data-clipboard-text': copyText});

        $('#' + opts.showTextId).empty().text(copyText);

        var clip = new ZeroClipboard($this, {
            moviePath: "//www.gmresstatic.com/js/plugins/zeroclipboard/ZeroClipboard.swf"      //FLASH地址
        });

        clip.on( "ready", function( readyEvent ) {
          // alert( "ZeroClipboard SWF is ready!" );

          clip.on( "aftercopy", function( event ) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            // event.target.style.display = "none";
            // alert("Copied text to clipboard: " + event.data["text/plain"] );
            alert("複製成功,請按Ctrl+V進行粘貼");
          } );
        } );
        // clip.on('complete', function (client, args) {
        //     alert("複製成功,請按Ctrl+V進行粘貼");
        // });
    }
})(jQuery);