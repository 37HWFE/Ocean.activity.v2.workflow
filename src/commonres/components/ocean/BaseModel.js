define(['./Validator', "./createClass"], function(Validtor, createClass) {
    var ModelFactory = function() {
        var me = this;
        var validtor = new Validtor();
        /*map local model to server model*/
        this.getPostMappingRecord = function() {
            var newRecord = {};
            var fields = me['fields'];
            for (var element in fields) {
                var mappings = (fields[element]['mapping'] || element).split(".");
                var record = me[element];
                for (var i = mappings.length - 1; i >= 0; i++) {
                    record[mappings[i]] = record;
                }
                newRecord[mapping] = record;
            }
            return newRecord;
        };


        //map server model to local model
        this.setMappingRecord = function(record) {
            var fields = me['fields'];
            var newRecrod = {};
            for (var el in fields) {
                var mappings = (fields[el]['mapping'] || el).split(".");
                var val = record;
                for (var i = 0, len = mappings.length; i < len; i++) {
                    val = val ? val[mappings[i]] : null;
                }
                me[el] = val;
                newRecrod[el] = val;
            }
            return newRecrod;
        };

        this.save = function(callback) {
            if (model.doSave && "function" == typeof model.doSave)
                model.doSave(callback);
        };

        this.resetRecrod = function(newRecrod) {
            var fields = me['fields'];
            for (var el in fields) {
                me[el] = newRecrod[el] || me[el];
            }
        };

        this.set = function(proName, val) {
            me[proName] = val;
        };

        this.validate = function(callback) {
            var validaResult = validtor.validRecord(me, me['fields']);
            callback(validaResult);
        };

        this.initMappingFields = function() {
            var fields = me['fields'];
            for (var el in fields) {
                if (!fields[el]['mapping']) {
                    fields[el]['mapping'] = el;
                }
            }
        };

        this.loadResponse = function(errmsg, responseData, callback) {
            if (errmsg) {
                callback(errmsg, "");
            } else {
                me.setMappingRecord(responseData);
                callback("", me);
            }
        };

    }

    return createClass(ModelFactory);
});