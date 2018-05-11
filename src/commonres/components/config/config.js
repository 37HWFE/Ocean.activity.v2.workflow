define(function () {
    var host = ('process.env.NODE_ENV' === 'development') ? "http://mhdapi.37.com/" : "http://hdapi.37.com/";
    return {
        apiUrl: {
            getServer: host + '?c=api&a=get_server_list&alias_info=dtsbook20160918&f=d201609/dtsbook20160918',
            getRole:host + '?c=api&a=get_role_list&alias_info=dtsbook20160918&f=d201609/dtsbook20160918',
            getCareer:host + '?c=api&a=get_career_list&alias_info=dtsbook20160918&f=d201609/dtsbook20160918',
            checkCode:host + '?c=api&a=check_rand_key&alias_info=dtsbook20160918&f=d201609/dtsbook20160918',
            enrol:host + '?c=api&a=book&alias_info=dtsbook20160918&f=d201609/dtsbook20160918',
            checkEnrole:host + '?c=api&a=my_book&alias_info=dtsbook20160918&f=d201609/dtsbook20160918'
        }
    }
});