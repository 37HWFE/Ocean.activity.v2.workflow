define(function(require, exports, module) {

    var jsencrypt = require('jsencrypt'); // 引入rsa库

    function Rsa(){
        if(typeof jsencrypt === 'undefined') return;
        this.jsencrypt = new jsencrypt.JSEncrypt();

        // 设置公钥
        this.jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----");
    }

    /**
     * rsa加密
     * @param  {string} [str] [待加密字符串]
     * @return {string} [经过rsa加密的字符串]
     */
    Rsa.prototype.encode = function(str,confuse){
        var enStr = confuse ? confuse + "|" + str : str;
        return encodeURIComponent(this.jsencrypt.encrypt(enStr)); // rsa+uri编码
    }

    // 对外暴露接口
    module.exports = Rsa;
});