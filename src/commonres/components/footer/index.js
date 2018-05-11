define(["ocean"],function(ocean){
	var $ = ocean.query;
	var Footer = function(){
		
		var FOOTER_TEMPLATE_URL = {
			"events.gm99.com" : "gm99Footer.html",
			"events.ujoy.com" : "ujoyFooter.html",
			"events.37.com" : "37Footer.html",
			"events.gmthai.com" : "gmthaiFooter.html",
			"defaultTemplate" : "gm99Footer.html",
			get : function(domain){
				return this[domain] || this["defaultTemplate"];
			}
		};

		var gameClass = 15;

		var ratingImgSrc = "//www.gm99.com/images/common/game_rating_{class}.jpg";

		var doRender = function(template,selector){
			ratingImgSrc = ratingImgSrc.replace("{class}",gameClass);
			var html = template.replace(/\{ratingImgSrc\}/g,ratingImgSrc);
			$(selector).html(html);
		};	

		this.setGameRating = function(newClass){
			gameClass = newClass;
			return this;
		}

		this.render = function(domain,selector){
			var templateUrl = "../../footers/" + FOOTER_TEMPLATE_URL.get(domain);
			$.get(templateUrl,function(headerTemplate){
				doRender(headerTemplate,selector);
			});
		};
	}

	return new Footer();
});