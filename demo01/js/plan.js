var Screen  = {
	width : window.innerWidth,
	height : window.innerHeight,
	ratio : window.innerWidth / window.innerHeight 
};
var Plan = function(){
	
	var scene;
	var camera;
	var renderer;
	var stats;
	
	this.start = function(){
		init();
		createScene();
		document.getElementsByTagName('body')[0].appendChild(renderer.domElement);
		document.getElementsByTagName('body')[0].appendChild(stats.domElement);		
		animate();
	};
	
	var init = function(){
		stats = new Stats();
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(Screen.width, Screen.height);
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45,Screen.ratio,1,2000);
		camera.position.set(0,0,1500);
		console.log(camera);
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
		
	};
	
	var createScene = function(){
		scene.add(camera);
		scene.add(new THREE.AmbientLight(0x222222));
		var planGeometry = new THREE.PlaneGeometry(16000,16000);
		var gt = THREE.ImageUtils.loadTexture("resources/graph/textures/terrain/grasslight-big.jpg");
		var planMaterial = new THREE.MeshPhongMaterial({
			color : 0x222222,
			map : gt
		});
		var plan = new THREE.Mesh(planGeometry, planMaterial);
		plan.material.map.repeat.set(64, 64);
		plan.material.map.wrapS = plan.material.map.wrapT = THREE.RepeatWrapping;

		plan.rotation.x = -0.89;
		console.log(plan);
		scene.add(plan);
		
		
		var light = new THREE.DirectionalLight(0xffffff,2.25);
		light.position.set(0,0,450);
		scene.add(light);
	};
	
	var animate = function(){
		requestAnimationFrame(animate);
		render();
	};
	
	var render = function(){
		renderer.render(scene, camera);
		stats.update();
	};
	
	
	
};


window.onload = function(){
	var plan = new Plan();
	plan.start();
};
