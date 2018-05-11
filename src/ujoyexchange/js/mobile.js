import '../scss/mobile.scss'; 

require(['zepto','ocean'], function (zepto, ocean) {

    ocean.setQuery(zepto);

    require(['activityConfig', './service'], function (activityConfig, service) {
        service.init();
        activityConfig.stat();
    });
});
