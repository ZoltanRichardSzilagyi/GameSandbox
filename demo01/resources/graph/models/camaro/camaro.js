var Camaro = function() {
	
	
	var car = null;
	
	var speed = 0;
	
	var orientation = 0;
	
	this.control = {
		
		up : false,
		down : false,
		left : false,
		right : false		
	};

	this.move = function(delta){
		if(car!= null){
			if(this.control.up == true){
				speed +=5;
				this.control.up = false;
			}else if(this.control.down == true){
				speed -= 5;
				this.control.down = false;
			}else if(this.control.left == true){
				orientation += delta * 2.5; 
				this.control.left = false;
			}else if(this.control.right == true){
				orientation -= delta * 2.5;
				this.control.right = false;
			}
			var forwardDelta = speed * delta;
			
			var x = car.position.x;
			var y = car.position.y;

			var sinOrientation = Math.sin(orientation);
			var cosOrientation = Math.cos(orientation);
			
			car.position.x = x + sinOrientation * forwardDelta;
			car.position.y = y + cosOrientation * forwardDelta;			
			car.rotation.y = orientation;

		}
	};

	var camaroMaterials = {

		body : {

			Orange : new THREE.MeshLambertMaterial({
				color : 0xff6600,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.3
			}),

			Blue : new THREE.MeshLambertMaterial({
				color : 0x226699,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.3
			}),

			Red : new THREE.MeshLambertMaterial({
				color : 0x660000,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.5
			}),

			Black : new THREE.MeshLambertMaterial({
				color : 0x000000,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.5
			}),

			White : new THREE.MeshLambertMaterial({
				color : 0xffffff,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.5
			}),

			Carmine : new THREE.MeshPhongMaterial({
				color : 0x770000,
				specular : 0xffaaaa,
				//envMap : textureCube,
				combine : THREE.MultiplyOperation
			}),

			Gold : new THREE.MeshPhongMaterial({
				color : 0xaa9944,
				specular : 0xbbaa99,
				shininess : 50,
				//envMap : textureCube,
				combine : THREE.MultiplyOperation
			}),

			Bronze : new THREE.MeshPhongMaterial({
				color : 0x150505,
				specular : 0xee6600,
				shininess : 10,
				//envMap : textureCube,
				combine : THREE.MixOperation,
				reflectivity : 0.5
			}),

			Chrome : new THREE.MeshPhongMaterial({
				color : 0xffffff,
				specular : 0xffffff,
				//envMap : textureCube,
				combine : THREE.MultiplyOperation
			})

		},

		chrome : new THREE.MeshLambertMaterial({
			color : 0xffffff,
			//envMap : textureCube
		}),

		darkchrome : new THREE.MeshLambertMaterial({
			color : 0x444444,
			//envMap : textureCube
		}),

		glass : new THREE.MeshBasicMaterial({
			color : 0x223344,
			//envMap : textureCube,
			opacity : 0.25,
			combine : THREE.MixOperation,
			reflectivity : 0.25,
			transparent : true
		}),

		tire : new THREE.MeshLambertMaterial({
			color : 0x050505
		}),

		interior : new THREE.MeshPhongMaterial({
			color : 0x050505,
			shininess : 20
		}),

		black : new THREE.MeshLambertMaterial({
			color : 0x000000
		})

	};

	var createScene = function(geometry) {
	
		var s = 75, m = new THREE.MeshFaceMaterial();

		m.materials[0] = camaroMaterials.body["Orange"];
		// car body
		m.materials[1] = camaroMaterials.chrome;
		// wheels chrome
		m.materials[2] = camaroMaterials.chrome;
		// grille chrome
		m.materials[3] = camaroMaterials.darkchrome;
		// door lines
		m.materials[4] = camaroMaterials.glass;
		// windshield
		m.materials[5] = camaroMaterials.interior;
		// interior
		m.materials[6] = camaroMaterials.tire;
		// tire
		m.materials[7] = camaroMaterials.black;
		// tireling
		m.materials[8] = camaroMaterials.black;
		// behind grille

		var mesh = new THREE.Mesh(geometry, m);
		mesh.rotation.y = 1;
		mesh.scale.set(s, s, s);
		return mesh;

	};


	this.create = function(scene, gyro) {
		var loader = new THREE.BinaryLoader();
		loader.load("resources/graph/models/camaro/CamaroNoUv_bin.js", function(geometry) {
			car = createScene(geometry);
			
			car.rotation.x = -Math.PI/2;
			//car.rotation.y = Math.PI/2;
			car.position.z = 0;						
			
			car.scale.x = 15;
			car.scale.y = 15;
			car.scale.z = 15;
			
			scene.add(car);
			car.add(gyro);
		});	

	};
	

};
