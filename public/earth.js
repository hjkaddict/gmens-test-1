// Created by Bjorn Sandvik - thematicmapping.org
(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius = 0.8,
		segments = 32,
		rotation = 2.5;

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0xff0000);

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 2.0;

	var renderer = new THREE.WebGLRenderer( {alpha:true});
	renderer.setSize(width, height);

	// Light setup
	var light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(5, 3, 5);
	scene.add(light);

	scene.add(new THREE.AmbientLight(0xffffff, 1));


	var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation;
	scene.add(sphere)

	var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0005;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture('https://gmens-test-1.s3.eu-central-1.amazonaws.com/2_no_clouds_4k-removed.png'),
				transparent: true,
				side: THREE.DoubleSide,
				bumpMap: THREE.ImageUtils.loadTexture('https://gmens-test-1.s3.eu-central-1.amazonaws.com/elev_bump_4k.jpg'),
				bumpScale: 0.005,
				specularMap: THREE.ImageUtils.loadTexture('https://gmens-test-1.s3.eu-central-1.amazonaws.com/water_4k.png'),
				specular: new THREE.Color('grey')
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),
			new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture('https://gmens-test-1.s3.eu-central-1.amazonaws.com/fair_clouds_4k.png'),
				transparent: true,
				side: THREE.DoubleSide
			})
		);
	}

}());