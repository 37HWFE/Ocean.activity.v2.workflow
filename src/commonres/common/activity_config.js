define(["ocean"], function(ocean) {
    var location = window.location;
    if (/\:/.test(location.host)) {
        ocean.debugMode = true;
    }
    return {
        getApiDomain: function() {
            var hostName = ocean.debugMode ? "gm99.com" : location.hostname.replace(/\w*\./, "");
            var childDomains = {
                "krevents.37.com": "//kreventsapi.",
                "other": "//eventsapi."
            }
            var eventDomain = window.location.hostname;
            var apiChildDomain = childDomains[eventDomain] || childDomains["other"];
            return apiChildDomain + hostName;
        },

        getLocationParam : function(paramName, newhref) {
            var href = newhref;
            if (window.location.search) {
                href = href || window.location.search.split("?")[1];
            } else {
                href = href || window.location.href.split("?")[1];
            }
            var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
            var matchResult = "";
            if (href) {
                matchResult = href.match(reg);
            }

            var param = matchResult ? decodeURI(matchResult[2]) : "";

            return param;
        },

        getActivityId: function() {
            var aictivityId = "";
            var href = window.location.pathname;
            if(/events\.37\.com/.test(window.location.origin)){
                href = href.replace(/(\/en\/)|(\/fr\/)|(\/tr\/)|(\/pt\/)|(\/de\/)/,"/")
            }
            try{
                aictivityId = href.match(/\w*\/(?:(m\/(?:\?|([\w|\-|_]*\.html)|$))|\?|([\w\-|_]*\.html)|$)/)[0].split("/")[0];
            }
            catch(e){
                aictivityId =  this.getLocationParam(href);
            }
            return aictivityId;
        },
        stat: function() {
            var url = [
                this.getApiDomain() + '/static_activity/visit_log',
                '?name=' + this.getActivityId(),
                '&source_url=' + window.location.href,
                '&referer_url=' + document.referrer,
                '&cid=' + ocean.location.getParam('cid'),
                '&scid=' + ocean.location.getParam('scid')
            ].join('');
            ocean.ajax.jsonp(url, {}, function() {});
        }
    }
});