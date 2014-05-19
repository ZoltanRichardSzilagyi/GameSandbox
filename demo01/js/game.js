var Loader = function(){
	
	var scripts = new Array();
	
	var images = new Array();
	
	var progress = 0;
	var resourcesNum = 0;
	var interval;
		
	this.preloadScript = function(script){
		resourcesNum++;
		scripts.push("js/" + script + ".js");
	};
		
	this.initialize = function(){
		interval = setInterval(function(){
			console.log(resourcesNum + ".....");
			if(resourcesNum == 0){
				clearInterval(interval);
				var game = new Game();
				game.start();				
			}
		},1000);
		for(var i = 0; i < scripts.length; i++){
			loadScript(scripts[i]);
		}	
	};
	
	var loadScript = function(scriptSrc){
		 var scriptElement = document.createElement("script");
		 scriptElement.setAttribute("src",scriptSrc);
		 scriptElement.onload = function(){	 			 	
			console.log('loaded');
			resourcesNum--;
		 };
		 document.getElementsByTagName('head')[0].appendChild(scriptElement);
	};
		
};

window.onload = function(){
	var loader =  new Loader();
	loader.preloadScript("library/three-rev64/three");
	loader.preloadScript("library/three-rev64/MD2CharacterComplex");	
	loader.preloadScript("stage");
	loader.initialize();	 
};


