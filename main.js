import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import InteractiveControls from './InteractiveControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 5;
controls.update();

var boids = [];
var numBoids = 10;
var prevNumBoids = -1;
var limV = 0.15;
var visualRange = 1; 
var xBound = 5;
var yBound = 5;
var zBound = 5;
var cohesionScalar = 0.005;
var separationScalar = 0.05;
var alignmentScalar = 0.15;
var boundingBox = false;

const guiControls = new InteractiveControls(0.005, 0.2, 0.15, 1, 0.15);
guiControls.init();

class Boid {
    constructor(geometry, material) {
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.mesh = new THREE.Mesh( geometry , material );
    }
}

// Initialize the positions of the boids
var geometry = new THREE.SphereGeometry( 0.05, 32, 16 );
var material = new THREE.MeshBasicMaterial( { color: 0xaed6f1 } );

function init() {
    // Create boids
    boids = [];
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid( geometry , material ));
        scene.add(boids[i].mesh);
    }

    // Initialize the positions of the boids
    initializePositions();
}

init();

function animate() {
    drawBoids();
    updateData();
    if (boundingBox) {
        drawBoundingBox();
    } else {
        removeBoundingBox();
    }
    updateBoids();
    controls.update();
	renderer.render( scene, camera );
}

function initializePositions() {
    // Initialize the positions of the boids
    for (var i = 0; i < numBoids; i++) {
        boids[i].position.x = (Math.random() * 2 - 1) * 10;
        boids[i].position.y = (Math.random() * 2 - 1) * 10;
        boids[i].position.z = (Math.random() * 2 - 1) * 10;
    }
}

function updateData() {
    //numBoids = guiControls.getNumBoids();
    cohesionScalar = guiControls.getCohesionScalar();
    separationScalar = guiControls.getSeparationScalar();
    alignmentScalar = guiControls.getAlignmentScalar();
    visualRange = guiControls.getVisualRange();
    limV = guiControls.getLimV();
    boundingBox = guiControls.boundingBox;
    //guiControls.getStats().update();
}

function drawBoids() {
    // Update the positions of the boids in the scene
    boids.forEach(boid => {
        boid.mesh.position.set(boid.position.x, boid.position.y, boid.position.z);
    });
}

function rule1(j)  {
   // Rule 1: Boids try to fly towards the centre of mass of neighbouring boids 
   // calculate the center of mass 
   var center_of_mass = new THREE.Vector3();
   var neighbours = 0;

   for (let i = 0; i < numBoids; i++) {
       if (j != i && boids[i].position.distanceTo(boids[j].position) < visualRange) {
           center_of_mass.add(boids[i].position);
           neighbours++;
       }
   }

   if (neighbours == 0) {
       return new THREE.Vector3();
   }
   center_of_mass.divideScalar(neighbours);

   return (center_of_mass.sub(boids[j].position)).multiplyScalar(cohesionScalar); 
}

function rule2(j) {
    // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
    var separation = 0.5;
    var displacement = new THREE.Vector3();
    var dist = new THREE.Vector3();

    for (let i = 0; i < numBoids; i++) {
        if (j != i && boids[i].position.distanceTo(boids[j].position) < separation) {
            dist.subVectors(boids[j].position, boids[i].position);
            displacement.add(dist);
        }
    }

    return displacement.multiplyScalar(separationScalar);
}

function rule3(j) {
    // Rule 3: Boids try to match velocity with near boids
    var avg_velocity = new THREE.Vector3();
    var neighbours = 0;

    for (let i = 0; i < numBoids; i++) {
        if (j != i && boids[i].position.distanceTo(boids[j].position) < visualRange) {
            avg_velocity.add(boids[i].velocity);
            neighbours++;
        }
    }
    if (neighbours == 0) {
        return new THREE.Vector3();
    }
    avg_velocity.divideScalar(neighbours);
    avg_velocity.sub(boids[j].velocity);
    return avg_velocity.multiplyScalar(alignmentScalar);

}

function bound(j) {
    // Align velocity of boids so they try to stay within the bounds of the scene 
    var limiter = new THREE.Vector3();
    var bounce = 0.01; 
    if (boids[j].position.x > xBound) {
        limiter.x = -bounce;
    } else if (boids[j].position.x < -xBound) {
        limiter.x = bounce;
    }
    if (boids[j].position.y > yBound) {
        limiter.y = -bounce;
    } else if (boids[j].position.y < -yBound) {
        limiter.y = bounce;
    }
    if (boids[j].position.z > zBound) {
        limiter.z = -bounce;
    } else if (boids[j].position.z < -zBound) {
        limiter.z = bounce;
    }

    return limiter;
}

function limitSpeed(j) {
    // Limit the speed of the boids
    if (boids[j].velocity.length() > limV) {
        boids[j].velocity.divideScalar( boids[j].velocity.length() );
        boids[j].velocity.multiplyScalar( limV );
    }
}

function updateBoids() {
    // Update the positions of the boids
    var v1;
    var v2;
    var v3;
    var v4;

    for (let i = 0; i < numBoids; i++) {
        v1 = rule1(i); boids[i].velocity.add(v1);
        v2 = rule2(i); boids[i].velocity.add(v2);
        v3 = rule3(i); boids[i].velocity.add(v3);
        v4 = bound(i); boids[i].velocity.add(v4);

        limitSpeed(i);

        boids[i].position.add(boids[i].velocity);
    }
}

function drawBoundingBox() {
    // Draw the bounding box of the scene
    const geometry = new THREE.BoxGeometry( xBound * 2, yBound * 2, zBound * 2);
    const edgesGeometry = new THREE.EdgesGeometry( geometry );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const cube = new THREE.LineSegments( edgesGeometry, material );
    scene.add( cube );
}

function removeBoundingBox() {
    // Remove the bounding box of the scene
    if (scene.children.length > numBoids) {
        scene.remove(scene.children[scene.children.length - 1]);
    }
}