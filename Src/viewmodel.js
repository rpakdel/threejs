var viewModel;

var ViewModel = function () {
  var self = this;
  var container;
  var scene;
  var camera;
  var renderer;
  var controls;
  var model;
  var material;
  var slideout_content;

  this.serverModels = ko.observableArray();

  this.init = function () {
    self.initTHREE();
    self.checkServerModels();
    setTimeout(self.checkServerModels, 3000);
  }

  this.initTHREE = function () {
    container = document.getElementById("threeContainer");
    slideout_content = document.getElementById("slideout_inner");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener('resize', self.onWindowResize, false);
    
    container.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.2;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.minDistance = 1.1;
    controls.maxDistance = 100;

    controls.keys = [65, 83, 68]; // [ rotateKey, zoomKey, panKey ]
    controls.addEventListener('change', self.render);

    self.render();
    self.animate();
  }

  this.onWindowResize = function () {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    controls.handleResize();

    self.render();
  }

  this.render = function() {
    renderer.render(scene, camera);
  }

  this.animate = function() {
    requestAnimationFrame(self.animate);
    controls.update();
  }

  this.loadModel = function (data, event) {
    scene.remove(model);


    var id = event.currentTarget.id;
    var geometry;
    if (id == "box") {
      geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    else if (id == "circle") {
      geometry = new THREE.CircleGeometry(2, 32);
    }
    else if (id == "cylinder") {
      geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    }
    
    if (geometry)
    {
      model = new THREE.Mesh(geometry, material);
      scene.add(model);
    }
    
    self.render();
  }

  this.checkServerModels = function() {
    $.get(
        'api/models',
        function (data) {
          self.serverModels.removeAll();
          self.serverModels.push.apply(self.serverModels, data);
      });
  }

  this.loadServerModel = function (id) {
    $.get(
        'api/models/' + id(),
        function (data) {

        });
  }
};

function initViewModel()
{
  viewModel = new ViewModel();
  viewModel.init();
  ko.applyBindings(viewModel);
}