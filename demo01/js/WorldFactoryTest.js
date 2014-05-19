var Scene = function(){
	this.add = function(objectDescriptor){
		//console.log(objectDescriptor.w);		
		//console.log(objectDescriptor.h);
	};
};

var scene = new Scene();
var worldFactory = new WorldFactory(scene);

var map  = {};
for(var i = 0; i < 2000;i++){		
    for(var k = 0;k<2000;k++){
    	if(typeof map[i] == 'undefined'){
    		map[i] = {};
    	}
    	map[i][k] = {
			t : 'road',
			w : i,
			h : k	
		};
    }
}
var startDate = new Date();
worldFactory.init(map);
worldFactory.build(0, 0,10000,10000);
var endDate = new Date();
console.log(endDate.getTime() - startDate.getTime());
