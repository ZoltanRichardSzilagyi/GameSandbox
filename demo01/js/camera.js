var CameraTest = function(){
	
	var Screen = {
		width : window.innerWidth,
		height : window.innerHeight,
		ratio : window.innerWidth / window.innerHeight
	};	
	
	var render;
	var camera;
	var scene;
	
	this.run = function(){
		createScene();		
		addObjects();
		document.getElementsByTagName('body')[0].appendChild(renderer.domElement);
		animate();
	};
	
	var createScene = function(){
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(Screen.width, Screen.height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapCascade = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, Screen.ratio, 1, 2000);
		camera.position.set(0, 0, 2000);
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;

		var light = new THREE.DirectionalLight(0xffffff, 2.25);
		light.position.set(0, 0, 500);
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
		
				
	};
	
	var addObjects = function(){
		var gg = new THREE.PlaneGeometry(1600, 1600);
		var gm = new THREE.MeshPhongMaterial({
			color : 0xffffff
		});

		var ground = new THREE.Mesh(gg, gm);
		ground.receiveShadow = true;
		ground.rotation.x = 0;		
		scene.add(ground);
	};
	
	var animate = function() {
		requestAnimationFrame(animate);
		render();
	};

	var render = function() {
		renderer.render(scene, camera);
	};
	
	
};

window.onload = function(){
	var cameraTest = new CameraTest();
	cameraTest.run();	
};
