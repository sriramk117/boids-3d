import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 5;
controls.update();

const boids = [];
var num_boids = 100;
var separation = 0.5;
var lim_v = new THREE.Vector3(0.07, 0.07, 0.07);
var visual_range = 0.8;
var x_bound = 5;
var y_bound = 5;
var z_bound = 5;

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

// Create boids
for (let i = 0; i < num_boids; i++) {
    boids.push(new Boid( geometry , material ));
    scene.add(boids[i].mesh);
}

initialize_positions();

function animate() {
    draw_boids();
    update_boids();
    controls.update();
	renderer.render( scene, camera );
}

function initialize_positions() {
    // Initialize the positions of the boids
    for (var i = 0; i < num_boids; i++) {
        boids[i].position.x = (Math.random() * 2 - 1) * 10;
        boids[i].position.y = (Math.random() * 2 - 1) * 10;
        boids[i].position.z = (Math.random() * 2 - 1) * 10;
    }
}

function draw_boids() {
    // Update the positions of the boids in the scene
    boids.forEach(boid => {
        boid.mesh.position.set(boid.position.x, boid.position.y, boid.position.z);
    });
}

function rule1(j)  {
   // Rule 1: Boids try to fly towards the centre of mass of neighbouring boids 
   // calculate the center of mass 
   var center_of_mass = new THREE.Vector3();

   for (let i = 0; i < num_boids; i++) {
       if (j != i) {
           center_of_mass.add(boids[i].position);
       }
   }

   center_of_mass.divideScalar(num_boids - 1);

   return (center_of_mass.sub(boids[j].position)).divideScalar(100); 
}

function rule2(j) {
    // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
    var factor = 0.05;
    var displacement = new THREE.Vector3();
    var dist = new THREE.Vector3();

    for (let i = 0; i < num_boids; i++) {
        if (j != i && boids[i].position.distanceTo(boids[j].position) < separation) {
            dist.subVectors(boids[j].position, boids[i].position);
            displacement.add(dist);
        }
    }

    return displacement.multiplyScalar(factor);
}

function rule3(j) {
    // Rule 3: Boids try to match velocity with near boids
    var factor = 0.125;
    var avg_velocity = new THREE.Vector3();
    var neighbours = 0;

    for (let i = 0; i < num_boids; i++) {
        if (j != i && boids[i].position.distanceTo(boids[j].position) < visual_range) {
            avg_velocity.add(boids[i].velocity);
            neighbours++;
        }
    }
    if (neighbours == 0) {
        return new THREE.Vector3();
    }
    avg_velocity.divideScalar(neighbours);
    avg_velocity.sub(boids[j].velocity);
    return avg_velocity.multiplyScalar(factor);

}

function bound(j) {
    var limiter = new THREE.Vector3();
    var limiter_constant = 0.02; 
    if (boids[j].position.x > x_bound) {
        limiter.x = -limiter_constant;
    } else if (boids[j].position.x < -x_bound) {
        limiter.x = limiter_constant;
    }
    if (boids[j].position.y > y_bound) {
        limiter.y = -limiter_constant;
    } else if (boids[j].position.y < -y_bound) {
        limiter.y = limiter_constant;
    }
    if (boids[j].position.z > z_bound) {
        limiter.z = -limiter_constant;
    } else if (boids[j].position.z < -z_bound) {
        limiter.z = limiter_constant;
    }

    return limiter;
}

function limit_velocity(j) {
    // Limit the velocity of the boids
    if (boids[j].velocity.length() > lim_v.length()) {
        boids[j].velocity.divideScalar(boids[j].velocity.length());
        boids[j].velocity.multiplyScalar(lim_v.length());
    }
}

function update_boids() {
    // Update the positions of the boids
    var v1;
    var v2;
    var v3;
    var v4;

    for (let i = 0; i < num_boids; i++) {
        v1 = rule1(i); boids[i].velocity.add(v1);
        v2 = rule2(i); boids[i].velocity.add(v2);
        v3 = rule3(i); boids[i].velocity.add(v3);
        v4 = bound(i); boids[i].velocity.add(v4);

        limit_velocity(i);

        boids[i].position.add(boids[i].velocity);
    }
}