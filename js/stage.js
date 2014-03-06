var Screen = {
	width : document.documentElement.clientWidth,
	height : document.documentElement.clientHeight
};

var World = {
	width : 16000,
	height : 16000
};

var Game = function() {

	var controls = {
		moveForward : false,
		moveBackward : false,
		moveLeft : false,
		moveRight : false,
		jump : false
	};

	var camera;
	var scene;
	var render;
	var clock;
	var baseCharacter;
	var projector;
	var stats;
	var sound;
	var moveSound;
	var dynamicObjects = [];

	this.start = function() {
		initWorld();
	};

	var initWorld = function() {
		moveSound = loadSound('move.mp3');
		moveSound.addEventListener('ended', function() {
			if (controls.moveForward || controls.moveBackward) {
				this.play();
			} else {
				this.stop();
			}

		}, false);
		sound = loadSound('selected.wav');
		bindEvents();
		createScene();
	};

	var bindEvents = function() {
		window.onkeydown = function(event) {
			switch(event.keyCode) {
				case 38:
					controls.moveForward = true;
					break;
				case 40:
					controls.moveBackward = true;
					break;
				case 37:					
					controls.moveLeft = true;
					break;
				case 39:
					controls.moveRight = true;
					break;
			}

			if (event.keyCode == 38 || event.keyCode == 40) {
				moveSound.play();
			}
		};

		window.onkeyup = function(event) {
			switch(event.keyCode) {
				case 32:
					var position = baseCharacter.meshWeapon.parent.position;
					var geometry = new THREE.CubeGeometry(200, 200, 200);

					var cm = THREE.ImageUtils.loadTexture("/resources/graph/textures/objects/crate.jpg");
					var material = new THREE.MeshLambertMaterial({
						map : cm
					});

					cm.anisotropy = 16;

					cube = new THREE.Mesh(geometry, material);
					cube.position.x = position.x;
					cube.position.y = position.y;
					cube.position.z = position.z;
					cube.castShadow = true;
					cube.receiveShadow = true;
					scene.add(cube);
					break;
				case 38:
					controls.moveForward = false;
					break;
				case 40:
					controls.moveBackward = false;
					break;
				case 37:
					controls.moveLeft = false;
					break;
				case 39:
					controls.moveRight = false;
					break;
			}
		};

		document.onclick = function(event) {
			var mouseVector = new THREE.Vector3();
			mouseVector.x = 2 * (event.clientX / Screen.width) - 1;
			mouseVector.y = -(event.clientY / Screen.height) * 2 + 1;

			raycaster = projector.pickingRay(mouseVector.clone(), camera);
			var intersects = raycaster.intersectObjects(scene.children, true);
			sound.play();
			// visualize ray
			//console.log(intersects);
			//console.log(intersects[0].object);
			// var mat = new THREE.LineBasicMaterial({
			// color : 0xffffff
			// });
			//
			// var geometry = new THREE.Geometry();
			// geometry.vertices.push(baseCharacter.root.position);
			// geometry.vertices.push(intersects[0].object.position);
			// var line = new THREE.Line(geometry, mat);
			// scene.add(line);

		};

	};

	var createScene = function() {
		stats = new Stats();

		camera = new THREE.PerspectiveCamera(45, Screen.width / Screen.height, 1, 4000);
		camera.position.set(0, 400, 1500);
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x87cefa, 1200, 5500);
		scene.add(camera);
		camera.rotation.x = -0.25;
		camera.rotation.y = 0;
		camera.rotation.z = 0;

		scene.add(new THREE.AmbientLight(0x222222));

		var light = new THREE.DirectionalLight(0xffffff, 2.25);
		light.position.set(200, 450, 500);

		light.castShadow = true;
		light.shadowMapWidth = 1024;
		light.shadowMapHeight = 1024;
		light.shadowMapDarkness = 0.95;
		//light.shadowCameraVisible = true;

		light.shadowCascade = true;
		light.shadowCascadeCount = 3;
		light.shadowCascadeNearZ = [-1.000, 0.995, 0.998];
		light.shadowCascadeFarZ = [0.995, 0.998, 1.000];
		light.shadowCascadeWidth = [1024, 1024, 1024];
		light.shadowCascadeHeight = [1024, 1024, 1024];

		scene.add(light);

		var gt = THREE.ImageUtils.loadTexture("resources/graph/textures/terrain/grasslight-big.jpg");
		var gg = new THREE.PlaneGeometry(16000, 16000);
		var gm = new THREE.MeshPhongMaterial({
			color : 0xffffff,
			map : gt
		});
		gt.anisotropy = maxAnisotropy;
		var ground = new THREE.Mesh(gg, gm);
		ground.rotation.x = -Math.PI / 2;
		ground.material.map.repeat.set(64, 64);
		ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
		ground.receiveShadow = true;		
		scene.add(ground);
		
		var rock = THREE.ImageUtils.loadTexture("resources/graph/textures/terrain/rock.png");
		rock.anisotropy = maxAnisotropy;
		var gr = new THREE.PlaneGeometry(1600, 1600);
		var grock = new THREE.MeshPhongMaterial({
			color : 0xffffff,
			map : rock
		});
		var rockGround = new THREE.Mesh(gr,grock);
		rockGround.rotation.x = -Math.PI / 2;
		rockGround.material.map.repeat.set(1,1);
		rockGround.material.map.wrapS = rockGround.material.map.wrapT = THREE.RepeatWrapping;
		rockGround.receiveShadow = true;
		rockGround.position.y = 1;
		rockGround.position.x = 200;
		rockGround.position.z = 200;
		scene.add(rockGround);

		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		var maxAnisotropy = renderer.getMaxAnisotropy();
		
		renderer.setSize(Screen.width, Screen.height);
		renderer.setClearColor(scene.fog.color, 1);

		document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

		document.getElementsByTagName('body')[0].appendChild(stats.domElement);

		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMapEnabled = true;

		renderer.shadowMapCascade = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		//renderer.shadowMapDebug = true;

		clock = new THREE.Clock();

		var configOgro = {

			baseUrl : "resources/graph/models/animated/ogro/",

			body : "ogro-light.js",
			skins : ["grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png", "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png", "sharokh.png"],
			weapons : [["weapon-light.js", "weapon.jpg"]],
			animations : {
				move : "run",
				idle : "stand",
				jump : "jump",
				attack : "attack",
				crouchMove : "cwalk",
				crouchIdle : "cstand",
				crouchAttach : "crattack"
			},

			walkSpeed : 750,
			crouchSpeed : 175

		};

		baseCharacter = new THREE.MD2CharacterComplex();
		baseCharacter.scale = 5;
		baseCharacter.loadParts(configOgro);

		baseCharacter.root.position.x = 200;
		baseCharacter.root.position.y = 0;
		baseCharacter.root.position.z = 200;

		baseCharacter.controls = controls;
		baseCharacter.root.castShadow = true;
		baseCharacter.root.receiveShadow = true;
		baseCharacter.onLoadComplete = function() {
			baseCharacter.enableShadows(true);
			baseCharacter.setWeapon(0);
		};

		scene.add(baseCharacter.root);

		var geometry = new THREE.CubeGeometry(200, 200, 200);

		var cm = THREE.ImageUtils.loadTexture("/resources/graph/textures/objects/crate.jpg");
		var material = new THREE.MeshLambertMaterial({
			map : cm
		});

		cm.anisotropy = maxAnisotropy;

		cube = new THREE.Mesh(geometry, material);
		cube.position.x = 0;
		cube.position.y = 100;
		cube.position.z = 300;
		cube.castShadow = true;
		cube.receiveShadow = true;
		cube.rotation.y = 0.35;
		scene.add(cube);

		projector = new THREE.Projector();
		var gyro = new THREE.Gyroscope();
		gyro.add(camera);
		baseCharacter.root.add(gyro);

		var loader = new THREE.JSONLoader();
		loader.load('resources/graph/models/animated/bar/bar.js', function(geometry) {
			mesh = new THREE.Mesh(geometry, material);
			mesh.scale.set(5,5,5);
			mesh.position.y = 0;
			mesh.position.x = 1200;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add(mesh);
		});
		window.scene = scene;
		animate();
	};

	var animate = function() {
		requestAnimationFrame(animate);
		var delta = clock.getDelta();
		baseCharacter.update(delta);

		render();

	};

	var render = function() {
		if (controls.moveForward == false && controls.moveBackward == false) {
			moveSound.pause();
		}
		renderer.render(scene, camera);
		stats.update();
	};

	var loadSound = function(soundName) {
		var audioElement = document.createElement('audio');
		audioElement.setAttribute("src", 'resources/sound/' + soundName);
		document.getElementsByTagName('body')[0].appendChild(audioElement);
		return audioElement;
	};
};

window.onload = function() {
	var game = new Game();
	game.start();
};
