var WorldObjectFactory = function() {

	this.scene = null;
	var that = this;
	

	var factories = {

		'road' : function(objectDescriptor, callback) {
			var texture = THREE.ImageUtils.loadTexture("resources/graph/textures/objects/road.jpg");
			var gr = new THREE.PlaneGeometry(500, 500);
			texture.anisotropy = 16;
			var grock = new THREE.MeshPhongMaterial({
				color : 0x111111,
				map : texture
			});
			var rockGround = new THREE.Mesh(gr, grock);
			//rockGround.material.map.repeat.set(4, 4);
			//rockGround.material.map.wrapS = rockGround.material.map.wrapT = THREE.RepeatWrapping;
			rockGround.receiveShadow = true;
			return rockGround;

		},
		'rock' : function(objectDescriptor, callback) {
			var gr = new THREE.PlaneGeometry(objectDescriptor.x1, objectDescriptor.y1);
			var grock = new THREE.MeshPhongMaterial({
				color : 0xf1ff33,
			});
			var rockGround = new THREE.Mesh(gr, grock);
			rockGround.receiveShadow = true;
			return rockGround;
		},
		'lamp' : function(objectDescriptor, call) {
			var loader = new THREE.OBJMTLLoader();
			loader.load('resources/graph/models/street-lamp/StreetLamp.obj', 'resources/graph/models/street-lamp/StreetLamp.mtl', function(object) {

				object.collision = new function(){
				console.log('collision');
				};

				object.traverse(function(child) {

					if ( child instanceof THREE.Mesh) {
						if (child.material.map != null) {
							child.material.map.anisotropy = 16;
						};
					};
				});

				object.scale.x = 20;
				object.scale.y = 20;
				object.scale.z = 20;
				//object.position.x = objectDescriptor.x;
				//object.position.y = objectDescriptor.y;
				object.castShadow = true;
				object.rotation.x = Math.PI / 2;
				object.rotation.y = Math.PI;

				/*
				 * TODO fix light problems
				 var light = new THREE.PointLight( 0xffffff, 10, 5 );
				 light.position.x = objectDescriptor.x;
				 light.position.y = objectDescriptor.y;
				 light.position.z = 200;
				 //light.rotation.y = Math.PI;
				 that.scene.add(light);*/
				
				var collisionGeom = new THREE.CubeGeometry(50, 50, 500);
				var material = new THREE.MeshNormalMaterial({
					color : 0xff3388,
					transparent: true,
					opacity: 0
				});
				cube = new THREE.Mesh(collisionGeom, material);
				cube.position.x = objectDescriptor.x;
				cube.position.y = objectDescriptor.y;
				cube.position.z = 0;
				cube.add(object);
				that.scene.add(cube);
			});
		},
		'diner' : function(objectDescriptor, call) {
			var loader = new THREE.OBJMTLLoader();
			loader.load('resources/graph/models/restaurant/Diner_Restaurant.obj', 'resources/graph/models/restaurant/Diner_Restaurant.mtl', function(object) {
				object.traverse(function(child) {

					if ( child instanceof THREE.Mesh) {
						if (child.material.map != null) {
							child.material.map.anisotropy = 16;
						};
					};
				});

				object.scale.x = 50;
				object.scale.y = 50;
				object.scale.z = 50;
				object.position.x = objectDescriptor.x;
				object.position.y = objectDescriptor.y;
				object.castShadow = true;
				object.rotation.x = Math.PI / 2;
				//object.rotation.y = Math.PI;
				that.scene.add(object);
			});
		},
		'corn' : function(objectDescriptor, call) {
			var loader = new THREE.OBJMTLLoader();
			loader.load('resources/graph/models/corn/corn.obj', 'resources/graph/models/corn/corn.mtl', function(object) {
				object.traverse(function(child) {

					if ( child instanceof THREE.Mesh) {
						if (child.material.map != null) {
							child.material.map.anisotropy = 16;
						};
					};
				});

				object.scale.x = 50;
				object.scale.y = 50;
				object.scale.z = 50;
				object.position.x = objectDescriptor.x;
				object.position.y = objectDescriptor.y;
				object.castShadow = true;
				object.rotation.x = Math.PI / 2;
				//object.rotation.y = Math.PI;
				that.scene.add(object);
			});
		}
	};

	this.create = function(objectDescriptor) {
		var type = objectDescriptor.t;
		var factory = factories[type];
		if (factory == 'undefined' || factory == null) {
			console.log('Illegal object type: ' + type);
			return null;
		}
		return new factory(objectDescriptor);
	};

};

var WorldEditor = function() {

	var objectFactory = new WorldObjectFactory();
	var CollisionGeometry;
	
	THREE.Mesh.prototype.collision = function(object){
		console.log('collision --');
	};
	this.build = function(map, scene) {
		objectFactory.scene = scene;
		var objects = map.objects;
		for (var i = 0; i < objects.length; i++) {
			var objectDescriptor = objects[i];
			var object = objectFactory.create(objectDescriptor, new function(object){
			scene.add(object);
			});
			if (Object.keys(object).length != 0) {
				console.log(object);
				object.position.z = 1;
				object.position.x = objectDescriptor.x;
				object.position.y = objectDescriptor.y;
				scene.add(object);
			}
		}
	};

};
