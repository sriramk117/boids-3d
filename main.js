import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

const boids = [];
var num_boids = 50;
var x_bound = 0;
var y_bound = 0;
var z_bound = 0;

class Boid {
    constructor(geometry, material) {
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.mesh = new THREE.Mesh( geometry , material );
    }
}

// Initialize the positions of the boids
var geometry = new THREE.SphereGeometry( 0.05, 32, 16 );
var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

// Create boids
for (let i = 0; i < num_boids; i++) {
    boids.push(new Boid( geometry , material ));
    scene.add(boids[i].mesh);
}

initialize_positions();

function animate() {
    draw_boids();
    update_boids();
	renderer.render( scene, camera );
}

function initialize_positions() {
    // Initialize the positions of the boids
    for (var i = 0; i < num_boids; i++) {
        boids[i].position.x = x_bound + (Math.random() * 2 - 1) * 5;
        boids[i].position.y = y_bound + (Math.random() * 2 - 1) * 5;
        boids[i].position.z = z_bound + (Math.random() * 2 - 1) * 5;
    }
}

function draw_boids() {
    // Update the positions of the boids in the scene
    boids.forEach(boid => {
        boid.mesh.position.set(boid.position.x, boid.position.y, boid.position.z);
    });
}

function rule1(b)  {
   // Rule 1: Boids try to fly towards the centre of mass of neighbouring boids 
   // calculate the center of mass 
   var center_of_mass = new THREE.Vector3();

   for (let i = 0; i < num_boids; i++) {
       if (b != boids[i]) {
           center_of_mass.add(boids[i].position);
       }
   }

   center_of_mass.divideScalar(num_boids - 1);

   return (center_of_mass.sub(b.position)).divideScalar(100); 
}

function rule2(b) {
    // Rule 2: Boids try to keep a small distance away from other objects (including other boids)
    var displacement = new THREE.Vector3();
    var dist = new THREE.Vector3();

    for (let i = 0; i < num_boids; i++) {
        if (boids[i] != b && boids[i].position.distanceTo(b.position) < 0.1) {
            dist.subVectors(boids[i].position, b.position);
            displacement.sub(dist);
        }
    }

    return displacement;
}

function rule3(b) {
    // Rule 3: Boids try to match velocity with near boids
    var avg_velocity = new THREE.Vector3();

    for (let i = 0; i < num_boids; i++) {
        if (b != boids[i]) {
            avg_velocity.add(boids[i].velocity);
        }
    }

    avg_velocity.divideScalar(num_boids - 1);
    avg_velocity.sub(b.velocity);
    return avg_velocity.divideScalar(8);

}

function update_boids() {
    // Update the positions of the boids
    var v1;
    var v2;
    var v3;
    var b;

    for (let i = 0; i < num_boids; i++) {
        b = boids[i];
        v1 = rule1(b);
        v2 = rule2(b);
        v3 = rule3(b);

        boids[i].velocity.add(v1);
        boids[i].velocity.add(v2);
        boids[i].velocity.add(v3);

        boids[i].position.add(boids[i].velocity);
    }
}