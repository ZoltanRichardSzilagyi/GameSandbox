var ObjectFactory = function() {

	this.create = function(scene, objectDescriptor, x, y) {
		if (objectDescriptor.t = 'land') {
			console.log(x);
			console.log(y);
			console.log('--------------');
			var gt = THREE.ImageUtils.loadTexture("resources/graph/textures/terrain/grasslight-big.jpg");
			var gg = new THREE.PlaneGeometry(objectDescriptor.w, objectDescriptor.h);
			var gm = new THREE.MeshPhongMaterial({
				color : 0xffffff,
				map : gt
			});

			var ground = new THREE.Mesh(gg, gm);
			ground.material.map.repeat.set(2, 2);
			ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
			ground.receiveShadow = true;

			ground.position.x = x;
			ground.position.y = y;
			scene.add(ground);
		}
	};

};

var WorldFactory = function(scene) {
	var scene = scene;
	var map = null;
	var objectFactory = new ObjectFactory();

	this.init = function(mapObject) {
		map = mapObject;
	};

	this.build = function(x, y, u, v) {
		while (x < u) {
			if ( typeof map[x] != 'undefined') {
				while (y < v) {
					var objectDescriptor = map[x][y];
					if ( typeof objectDescriptor != 'undefined') {
						objectFactory.create(scene, objectDescriptor, x, y);
					}
					y++;
				}
			}
			x++;
		}
	};

}; 