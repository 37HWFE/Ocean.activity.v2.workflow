(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports.slide3d = factory(root.jQuery);
    }
}(this, function ($) {

function Slide3d(config) {
    var self = this;
    // 轮播图资源
    var imgs = self.imgs = config.data;
    // 轮播图容器
    self.wrap = config.wrap;
    self.max = imgs.length - 1;
    // 图片数组指针(顺时针)
    self.index = 2;
    // 顺时针时背后元素的指针
    self.domIndex = 1;
    // 图片数组指针(逆时针)
    self.index2 = self.max-1;
    // 逆时针时背后元素指针
    self.domIndex2 = 2;
    // 初始化轮播图dom
    self.init();
}
Slide3d.prototype = {
    // 轮播的5个图位
    pos:[
        'right poa',
        'behind_right poa',
        'behind_left poa',
        'left poa',
        'center poa'
    ],
    // 5个图位dom
    dom:[
        'right',
        'behind_right',
        'behind_left',
        'left',
        'center'
    ],
    // 初始化轮播图dom
    init:function() {
        var self = this;
        var imgs = self.imgs;
        var max = imgs.length - 1;
        var str = '<img id="right" src="'+imgs[1]+'" class="right poa" alt=""/>\
            <img id="left" src="'+imgs[max]+'" class="left poa" alt=""/>\
            <img id="center" src="'+imgs[0]+'" class="center poa" alt=""/>\
            <img id="behind_right" src="'+imgs[2]+'" class="behind_right poa" alt=""/>\
            <img id="behind_left" src="'+imgs[max-1]+'" class="behind_left poa" alt=""/>';

        self.wrap.innerHTML = str;
    },
    next:function() {
        this.move('right');
    },
    prev:function() {
        this.move('left');
    },
    // 轮播切换
    move:function(dir) {
        var self = this;
        var pos = self.pos;
        var rotate = self.rotate;

        if(dir == 'left'){
             pos.push(pos.shift());
             self.rotate();
             self.resetPos2();
        }else{
             pos.unshift(pos.pop());
             self.rotate();
             self.resetPos();
        }
    },
    // 将旋转后的位置赋值给dom（产生旋转效果）
    rotate:function() {
        var self = this;
        var pos = self.pos;
        right.className = pos[0];
        behind_right.className = pos[1];
        behind_left.className = pos[2];
        left.className = pos[3];
        center.className = pos[4];
    },
    // 从数组剩余元素中抽取一个新元素到轮播后方图位
    resetPos:function() {
        var self = this;
        var max = self.max;
        var dom = self.dom;
        var imgs = self.imgs;
        (self.index++,self.domIndex++,self.index2++,self.domIndex2++);

        if(self.index>max){
            self.index = 0;
        }
        if(self.domIndex>4){
            self.domIndex = 0;
        }
        if(self.index2>max){
            self.index2 = 0;
        }
        if(self.domIndex2>4){
            self.domIndex2 = 0;
        }
        window[dom[self.domIndex]].setAttribute('src',imgs[self.index]);
    },
    resetPos2:function() {
        var self = this;
        var max = self.max;
        var dom = self.dom;
        var imgs = self.imgs;
        (self.index--,self.domIndex--,self.index2--,self.domIndex2--);

        if(self.index<0){
            self.index = max;
        }
        if(self.domIndex<0){
            self.domIndex = 4;
        }
        if(self.index2<0){
            self.index2 = max;
        }
        if(self.domIndex2<0){
            self.domIndex2 = 4;
        }
        window[dom[self.domIndex2]].setAttribute('src',imgs[self.index2]);
    }
};
return Slide3d;

}));