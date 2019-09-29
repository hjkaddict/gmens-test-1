// Created by Bjorn Sandvik - thematicmapping.org
const testing = function () {

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
	//scene.background = new THREE.Color(0xff0000);

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 20.0;

	var renderer = new THREE.WebGLRenderer( {alpha:true});
	renderer.setSize(width, height);


	var geom = new THREE.BoxGeometry(0.5, 0.5, 0.0001);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    
    var cube = new THREE.Mesh(geom, material);
    cube.position.copy(new THREE.Vector3(0, 0, 0));
    cube.lookAt(new THREE.Vector3(0, 0, 0));

	scene.add(cube);
	

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		controls.update();
		//sphere.rotation.y += 0.0005;
		//clouds.rotation.y += 0.0005;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}


}

testing()