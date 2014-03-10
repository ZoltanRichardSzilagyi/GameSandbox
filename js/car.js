var Screen = {
	width : window.innerWidth,
	height : window.innerHeight,
	ratio : window.innerWidth / window.innerHeight
};
var Plan = function() {

	var scene;
	var camera;
	var renderer;
	var stats;
	var gyro;
	var clock;
	
	var car;

	this.start = function() {
		init();
		createScene();
		createWorld();

		document.getElementsByTagName('body')[0].appendChild(renderer.domElement);
		document.getElementsByTagName('body')[0].appendChild(stats.domElement);
		animate();
	};

	var init = function() {
		stats = new Stats();
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(Screen.width, Screen.height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMapEnabled = true;

		renderer.shadowMapCascade = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		
		clock = new THREE.Clock();
	};

	var createScene = function() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45, Screen.ratio, 1, 2000);
		camera.position.set(0, 0, 2000);

		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
		gyro = new THREE.Gyroscope();
		gyro.add(camera);		

		scene.add(camera);
		scene.add(new THREE.AmbientLight(0x222222));

		var light = new THREE.DirectionalLight(0xffffff, 2.25);
		light.position.set(0, 0, 500);
		light.castShadow = true;
		light.shadowMapWidth = 1024;
		light.shadowMapHeight = 1024;
		light.shadowMapDarkness = 0.95;
		light.shadowCameraVisible = true;

		light.shadowCascade = true;
		light.shadowCascadeCount = 3;
		light.shadowCascadeNearZ = [-1.000, 0.995, 0.998];
		light.shadowCascadeFarZ = [0.995, 0.998, 1.000];
		light.shadowCascadeWidth = [1024, 1024, 1024];
		light.shadowCascadeHeight = [1024, 1024, 1024];

		scene.add(light);
	};

	var createWorld = function() {
		var gt = THREE.ImageUtils.loadTexture("resources/graph/textures/terrain/grasslight-big.jpg");
		var gg = new THREE.PlaneGeometry(16000, 16000);
		var gm = new THREE.MeshPhongMaterial({
			color : 0xffffff,
			map : gt
		});

		var ground = new THREE.Mesh(gg, gm);
		ground.material.map.repeat.set(64, 64);
		ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
		ground.receiveShadow = true;
		scene.add(ground);
		
		
		car = new Camaro();
		car.create(scene, gyro);
		//car.add(gyro);
		
		
		window.onkeydown = function(event) {
			switch(event.keyCode) {
				case 38:
					car.control.up = true;
				break;
				
				case 40:
					car.control.down = true;
				break;
				
				case 37:
					car.control.left = true;
				break;
				
				case 39:
					car.control.right = true;
				break;
			}
		};
		
	};

	var animate = function() {
		requestAnimationFrame(animate);
		render();
	};

	var render = function() {
		var delta = clock.getDelta();
		car.move(delta);
		renderer.render(scene, camera);
		stats.update();
	};

};

window.onload = function() {
	var plan = new Plan();
	plan.start();
};
