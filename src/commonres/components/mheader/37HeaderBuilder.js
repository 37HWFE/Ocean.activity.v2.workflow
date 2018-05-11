define(['jquery',"HeaderBuider"], function($,HeaderBuider) {

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "37Header.html";

        this.ready = function(){
            console.log('Page is ready.')
        };

        this.getInitRenderParams = function(callback,platform){
            console.log('Init your tpl params.')
        }

    }

    return new Builder();
})