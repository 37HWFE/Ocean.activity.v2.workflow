define(function() {
    var location = window.location;
    return {

        getHref: function() {
            return location.href;
        },

        getParam: function(paramName, newhref) {
           var href = newhref || location.search.substr(1);
           var reg = new RegExp("(^|&)"+ paramName +"=([^&]*)(&|$)");
           var matchResult = href.match(reg);
           var param = matchResult ? decodeURI(matchResult[2]) : "";
           return param;
        },

        hasParameter: function(parameterName) {
            return new RegExp(parameterName).test(location.href);
        },

        setParamToNewHref: function(href, paramName, paramVal) {
            if (this.getParam(paramName, href)) {
                return href;
            }
            href += this.isHrefHasParam(href) ? "&" : "?";
            href += paramName + "=" + encodeURIComponent(paramVal);
            return href;
        },
        hrefHasParam: function(href) {
            return href.split("?").length > 1;
        },

        redireactTo: function(href) {
            widnow.location.href = href;
        },

        getPathName: function() {
            return location.pathname;
        },

        getDomain: function() {
            return location.host;
        },

       getSpecialDomain: function() {
            return location.hostname.replace(/\w*\./, "");
        },

        // @return  当前页面布袋参数的url
        getHrefWithoutParameter: function() {
            return location.origin + location.pathname;
        }
    };
});