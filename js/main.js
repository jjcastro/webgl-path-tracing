
////////////////////////////////////////////////////////////////////////////////
// main program
////////////////////////////////////////////////////////////////////////////////

var gl;
var ui;
var error;
var canvas;
var inputFocusCount = 0;

var angleX = 0;
var angleY = 0;
var zoomZ = 2.5;
var eye = Vector.create([0, 0, 0]);
var light = Vector.create([0.4, 0.5, -0.6]);

var nextObjectId = 0;

var MATERIAL_DIFFUSE = 0;
var MATERIAL_MIRROR = 1;
var MATERIAL_GLOSSY = 2;
var material = MATERIAL_DIFFUSE;
var glossiness = 0.6;

var YELLOW_BLUE_CORNELL_BOX = 0;
var RED_GREEN_CORNELL_BOX = 1;
var environment = YELLOW_BLUE_CORNELL_BOX;

var color1 = "#000000";
var color2 = "#000000";

function tick(timeSinceStart) {
  eye.elements[0] = zoomZ * Math.sin(angleY) * Math.cos(angleX);
  eye.elements[1] = zoomZ * Math.sin(angleX);
  eye.elements[2] = zoomZ * Math.cos(angleY) * Math.cos(angleX);

  document.getElementById('glossiness-factor').style.display = (material == MATERIAL_GLOSSY) ? 'inline' : 'none';

  ui.updateMaterial();
  ui.updateGlossiness();
  ui.updateEnvironment();
  ui.updateColor();
  ui.update(timeSinceStart);
  ui.render();
}

function makeStacks() {
  var objects = [];

  // lower level
  objects.push(new Cube(Vector.create([-0.5, -0.75, -0.5]), Vector.create([0.5, -0.7, 0.5]), nextObjectId++));

  // further poles
  objects.push(new Cube(Vector.create([-0.45, -1, -0.45]), Vector.create([-0.4, -0.45, -0.4]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.4, -1, -0.45]), Vector.create([0.45, -0.45, -0.4]), nextObjectId++));
  objects.push(new Cube(Vector.create([-0.45, -1, 0.4]), Vector.create([-0.4, -0.45, 0.45]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.4, -1, 0.4]), Vector.create([0.45, -0.45, 0.45]), nextObjectId++));

  // upper level
  objects.push(new Cube(Vector.create([-0.3, -0.5, -0.3]), Vector.create([0.3, -0.45, 0.3]), nextObjectId++));

  // closer poles
  objects.push(new Cube(Vector.create([-0.25, -0.7, -0.25]), Vector.create([-0.2, -0.25, -0.2]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.2, -0.7, -0.25]), Vector.create([0.25, -0.25, -0.2]), nextObjectId++));
  objects.push(new Cube(Vector.create([-0.25, -0.7, 0.2]), Vector.create([-0.2, -0.25, 0.25]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.2, -0.7, 0.2]), Vector.create([0.25, -0.25, 0.25]), nextObjectId++));

  // upper level
  objects.push(new Cube(Vector.create([-0.25, -0.25, -0.25]), Vector.create([0.25, -0.2, 0.25]), nextObjectId++));

  return objects;
}

function makeTableAndChair() {
  var objects = [];

  // table top
  objects.push(new Cube(Vector.create([-0.5, -0.35, -0.5]), Vector.create([0.3, -0.3, 0.5]), nextObjectId++));

  // table legs
  objects.push(new Cube(Vector.create([-0.45, -1, -0.45]), Vector.create([-0.4, -0.35, -0.4]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.2, -1, -0.45]), Vector.create([0.25, -0.35, -0.4]), nextObjectId++));
  objects.push(new Cube(Vector.create([-0.45, -1, 0.4]), Vector.create([-0.4, -0.35, 0.45]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.2, -1, 0.4]), Vector.create([0.25, -0.35, 0.45]), nextObjectId++));

  // chair seat
  objects.push(new Cube(Vector.create([0.3, -0.6, -0.2]), Vector.create([0.7, -0.55, 0.2]), nextObjectId++));

  // chair legs
  objects.push(new Cube(Vector.create([0.3, -1, -0.2]), Vector.create([0.35, -0.6, -0.15]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.3, -1, 0.15]), Vector.create([0.35, -0.6, 0.2]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.65, -1, -0.2]), Vector.create([0.7, 0.1, -0.15]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.65, -1, 0.15]), Vector.create([0.7, 0.1, 0.2]), nextObjectId++));

  // chair back
  objects.push(new Cube(Vector.create([0.65, 0.05, -0.15]), Vector.create([0.7, 0.1, 0.15]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.65, -0.55, -0.09]), Vector.create([0.7, 0.1, -0.03]), nextObjectId++));
  objects.push(new Cube(Vector.create([0.65, -0.55, 0.03]), Vector.create([0.7, 0.1, 0.09]), nextObjectId++));

  // sphere on table
  objects.push(new Sphere(Vector.create([-0.1, -0.05, 0]), 0.25, nextObjectId++));

  return objects;
}

function makeSphereAndCube() {
  var objects = [];
  objects.push(new Cube(Vector.create([-0.25, -1, -0.25]), Vector.create([0.25, -0.75, 0.25]), nextObjectId++));
  objects.push(new Sphere(Vector.create([0, -0.75, 0]), 0.25, nextObjectId++));
  return objects;
}

function makeSphereColumn() {
  var objects = [];
  objects.push(new Sphere(Vector.create([0, 0.75, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, 0.25, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, -0.25, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, -0.75, 0]), 0.25, nextObjectId++));
  return objects;
}

function makeCubeAndSpheres() {
  var objects = [];
  objects.push(new Cube(Vector.create([-0.25, -0.25, -0.25]), Vector.create([0.25, 0.25, 0.25]), nextObjectId++));
  objects.push(new Sphere(Vector.create([-0.25, 0, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([+0.25, 0, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, -0.25, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, +0.25, 0]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, 0, -0.25]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0, 0, +0.25]), 0.25, nextObjectId++));
  return objects;
}

function makeSpherePyramid() {
  var root3_over4 = 0.433012701892219;
  var root3_over6 = 0.288675134594813;
  var root6_over6 = 0.408248290463863;
  var objects = [];

  // first level
  objects.push(new Sphere(Vector.create([-0.5, -0.75, -root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0.0, -0.75, -root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0.5, -0.75, -root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([-0.25, -0.75, root3_over4 - root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0.25, -0.75, root3_over4 - root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0.0, -0.75, 2.0 * root3_over4 - root3_over6]), 0.25, nextObjectId++));

  // second level
  objects.push(new Sphere(Vector.create([0.0, -0.75 + root6_over6, root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([-0.25, -0.75 + root6_over6, -0.5 * root3_over6]), 0.25, nextObjectId++));
  objects.push(new Sphere(Vector.create([0.25, -0.75 + root6_over6, -0.5 * root3_over6]), 0.25, nextObjectId++));

  // third level
  objects.push(new Sphere(Vector.create([0.0, -0.75 + 2.0 * root6_over6, 0.0]), 0.25, nextObjectId++));

  return objects;
}

var XNEG = 0, XPOS = 1, YNEG = 2, YPOS = 3, ZNEG = 4, ZPOS = 5;

function addRecursiveSpheresBranch(objects, center, radius, depth, dir) {
  objects.push(new Sphere(center, radius, nextObjectId++));
  if(depth--) {
    if(dir != XNEG) addRecursiveSpheresBranch(objects, center.subtract(Vector.create([radius * 1.5, 0, 0])), radius / 2, depth, XPOS);
    if(dir != XPOS) addRecursiveSpheresBranch(objects, center.add(Vector.create([radius * 1.5, 0, 0])),      radius / 2, depth, XNEG);
    
    if(dir != YNEG) addRecursiveSpheresBranch(objects, center.subtract(Vector.create([0, radius * 1.5, 0])), radius / 2, depth, YPOS);
    if(dir != YPOS) addRecursiveSpheresBranch(objects, center.add(Vector.create([0, radius * 1.5, 0])),      radius / 2, depth, YNEG);
    
    if(dir != ZNEG) addRecursiveSpheresBranch(objects, center.subtract(Vector.create([0, 0, radius * 1.5])), radius / 2, depth, ZPOS);
    if(dir != ZPOS) addRecursiveSpheresBranch(objects, center.add(Vector.create([0, 0, radius * 1.5])),      radius / 2, depth, ZNEG);
  }
}

function makeRecursiveSpheres() {
  var objects = [];
  addRecursiveSpheresBranch(objects, Vector.create([0, 0, 0]), 0.3, 2, -1);
  return objects;
}

window.onload = function() {
  gl = null;
  error = document.getElementById('error');
  canvas = document.getElementById('canvas');
  try { gl = canvas.getContext('experimental-webgl'); } catch(e) {}

  if(gl) {
    error.innerHTML = 'Loading...';

    // keep track of whether an <input> is focused or not (will be no only if inputFocusCount == 0)
    var inputs = document.getElementsByTagName('input');
    for(var i= 0; i < inputs.length; i++) {
      inputs[i].onfocus = function(){ inputFocusCount++; };
      inputs[i].onblur = function(){ inputFocusCount--; };
    }

    material = parseInt(document.getElementById('material').value, 10);
    color1 = document.getElementById('color1').value;
    color2 = document.getElementById('color2').value;
    ui = new UI();
    ui.setObjects(makeSphereColumn());
    var start = new Date();
    error.style.zIndex = -1;
    setInterval(function(){ tick((new Date() - start) * 0.001); }, 1000 / 60);
  } else {
    error.innerHTML = 'Your browser does not support WebGL.<br>Please see <a href="http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">Getting a WebGL Implementation</a>.';
  }
};

function elementPos(element) {
  var x = 0, y = 0;
  while(element.offsetParent) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  }
  return { x: x, y: y };
}

function eventPos(event) {
  return {
    x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
    y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop
  };
}

function canvasMousePos(event) {
  var mousePos = eventPos(event);
  var canvasPos = elementPos(canvas);
  return {
    x: mousePos.x - canvasPos.x,
    y: mousePos.y - canvasPos.y
  };
}

var mouseDown = false, oldX, oldY;

document.onmousedown = function(event) {
  var mouse = canvasMousePos(event);
  oldX = mouse.x;
  oldY = mouse.y;

  if(mouse.x >= 0 && mouse.x < 512 && mouse.y >= 0 && mouse.y < 512) {
    mouseDown = !ui.mouseDown(mouse.x, mouse.y);

    // disable selection because dragging is used for rotating the camera and moving objects
    return false;
  }

  return true;
};

document.onmousemove = function(event) {
  var mouse = canvasMousePos(event);

  if(mouseDown) {
    // update the angles based on how far we moved since last time
    angleY -= (mouse.x - oldX) * 0.01;
    angleX += (mouse.y - oldY) * 0.01;

    // don't go upside down
    angleX = Math.max(angleX, -Math.PI / 2 + 0.01);
    angleX = Math.min(angleX, Math.PI / 2 - 0.01);

    // clear the sample buffer
    ui.renderer.pathTracer.sampleCount = 0;

    // remember this coordinate
    oldX = mouse.x;
    oldY = mouse.y;
  } else {
    var canvasPos = elementPos(canvas);
    ui.mouseMove(mouse.x, mouse.y);
  }
};

document.onmouseup = function(event) {
  mouseDown = false;

  var mouse = canvasMousePos(event);
  ui.mouseUp(mouse.x, mouse.y);
};

document.onkeydown = function(event) {
  // if there are no <input> elements focused
  if(inputFocusCount == 0) {
    // if backspace or delete was pressed
    if(event.keyCode == 8 || event.keyCode == 46) {
      ui.deleteSelection();

      // don't let the backspace key go back a page
      return false;
    }
  }
};
