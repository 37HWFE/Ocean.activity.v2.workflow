define(['jquery',"HeaderBuider"], function($,HeaderBuider) {
   

   var Builder =  function (){
        HeaderBuider.call(this);

        this.templateUrl  = "vgmHeader.html";

        this.ready = function(){
            //to do
        };

        this.getInitRenderParams = function(callback){
           	//to do 
        }

    }

    return new Builder();
})