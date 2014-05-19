var Bus = function() {

	var bus = null;

	var speed = 0;

	var orientation = 0;

	var scale = 100;

	var scene;

	this.setScene = function(sceneObj) {
		scene = sceneObj;
	};

	this.control = {
		up : false,
		down : false,
		left : false,
		right : false
	};

	this.create = function(scene, gyro, callback) {
		var loader = new THREE.OBJMTLLoader();
		loader.load('resources/graph/models/bus/bus.obj', 'resources/graph/models/bus/bus.mtl', function(object) {
			object.traverse(function(child) {

				if ( child instanceof THREE.Mesh) {
					if (child.material.map != null) {
						console.log(child);
						child.material.map.anisotropy = 16;
					};
				};
			});

			object.scale.x = scale;
			object.scale.y = scale;
			object.scale.z = scale;
			object.castShadow = true;
			object.rotation.x = Math.PI / 2;
			object.rotation.y = Math.PI / 2;
			object.add(gyro);
			bus = object;
			scene.add(bus);
			new callback();
		});

	};

	this.move = function(delta) {
		if (bus != null) {
			if (this.control.up == true) {
				speed += 10;
				this.control.up = false;
			} else if (this.control.down == true) {
				speed -= 10;
				this.control.down = false;
			} else if (this.control.left == true) {
				orientation += delta * 2.5 * speed / 500;
				this.control.left = false;
			} else if (this.control.right == true) {
				orientation -= delta * 2.5 * speed / 500;
				this.control.right = false;
			}
			var forwardDelta = speed * delta;
			var x = bus.position.x;
			var y = bus.position.y;

			var sinOrientation = Math.sin(orientation);
			var cosOrientation = Math.cos(orientation);

			var newX = cosOrientation * forwardDelta;
			bus.position.x += newX;
			var newY = sinOrientation * forwardDelta;
			bus.position.y += newY;
			bus.rotation.y = orientation;
			// collision detection
			var farX = newX * 1000;
			var farY = newY * 1000;

			var originPoint = new THREE.Vector3(bus.position.x, bus.position.y, bus.position.z);
			var directionVector = new THREE.Vector3(farX, farY, bus.position.z);
			var ray = new THREE.Raycaster(originPoint, originPoint.clone().normalize(), directionVector.clone().normalize());
			var collisionResults = ray.intersectObjects(scene.children, true);

			if (collisionResults.length > 0) {
				for (var i = 0; i < collisionResults.length; i++) {
					var object = collisionResults[i];
					if (object.distance < 280) {
						if(object.object instanceof THREE.Mesh){
							object.object.collision();
						}
						
						object.object.rotation.y = Math.PI / 2;
						/*						
						var mat = new THREE.LineBasicMaterial({
							color : 0xffffff
						});

						var geometry = new THREE.Geometry();
						geometry.vertices.push(bus.position);
						geometry.vertices.push(object.point);
						var line = new THREE.Line(geometry, mat);
						scene.add(line);
						*/
					}
				}
			}

		}
	};

};
