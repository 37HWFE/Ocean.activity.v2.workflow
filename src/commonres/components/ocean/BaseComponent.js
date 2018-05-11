define(["createClass"],function(createClass){
	return createClass(function(){
		var len = arguments.length;
		var componentName = arguments[len -1];
		document.createElement(componentName);
	});
});