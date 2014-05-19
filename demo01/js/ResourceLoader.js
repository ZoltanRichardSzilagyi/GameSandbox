var ResourceLoader = function() {

	var resourcesNum = 0;

	var resourcesLoaded = 0;

	var loaderPollIntervalMs = 200;

	var loaderPollInterval;

	var ResourceTypeBasePath = {
		texture : 'resources/graph/textures/',
		model : 'resources/grap/models/',
		sound : 'resources/sound/'
	};

	this.create = function() {
		return new ResourceLoader();
	};

	var resources = {
	};

	var resourceRepository = {

		texture : [],

		model : [],

		sound : []
	};
	
	var ImageElementFactory = function() {
		this.create = function(url) {
			console.log('create sound dom element');
			return createElement('img');
		};
	};

	var SoundElementFactory = function() {
		this.create = function(url) {
			console.log('create sound dom element');
			return createElement('audio');
		};
	};

	var createElement = function(elementType) {
		var element = document.createElement(elementType);
		element.setAttribute("src", url);
		return element;
	};

	var domElementFactories = {
		texture : new ImageElementFactory(),
		model : null,
		sound : new SoundElementFactory()
	};

	this.addTexture = function(path) {
		resourceRepository.texture.push(path);
		addResource(path);
	};

	this.addModel = function(path) {
		resourceRepository.model.push = (path);
		addResource(path);
	};

	this.addSound = function(path) {
		resourceRepository.sound.push(path);
		addResource(path);
	};

	var addResource = function(path) {
		resources[path] = null;
		resourcesNum++;
	};

	this.loadResources = function(callBack) {
		for (var resourceContainerType in resourceRepository) {
			var resourceContainer = resourceContainer[resourceContainerType];
			var basePath = ResourceTypeBasePath[resourceContainerType];
			var domElementFactory = domElementFactories[resourceContainerType];
			loaderPollInterval = setInterval(function() {
				if (resourcesNum == resourcesLoaded) {
					new callBack();
				}
			}, loaderPollIntervalMs);
			loadResources(resourceContainerType, resourceContainer, basePath, domElementFactory);

		};
	};

	var loadResources = function(resourceType, resourceContainer, basePath, domElementFactory) {
		for (var i = 0; i < resourceContainer.length; i++) {
			var resourcePath = basePath + resourceContainer;
			var domElement = domElementFactory.create(resourcePath);
			domElement.onload = function() {
				loadResources++;
			};
		}
	};

};

var rl = new ResourceLoader();
