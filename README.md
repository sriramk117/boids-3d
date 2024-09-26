# 3D Simulation of Boids 
This is a 3D simulation of the boids algorithm - a mathematical program that attempts to replicate the flocking behavior of crows. This demonstration closely follows Conrad Parker's pseudocode explanation of boids algorithm ([link here](http://www.kfish.org/boids/pseudocode.html#ref1)) and Craig Reynold's [description of the algorithm](https://www.red3d.com/cwr/boids/). 

The simulation was made using the Three.js framework to render an interactive and appealing 3D atmosphere for the algorithm. I wrote this completely using HTML and CSS styling.

## Algorithm Overview + Controls Guide
In general, the algorithm simulates flocking behaviors by controlling the velocity of individual boids (each boid resembles a single bird) using information from the other boids in the flock. This allows for overarching control over the interactions between the boids giving us this flock movement. The algorithm follows three rules: 
- **Cohesion:** The boids will try to stay close to where most of the other boids are.
- **Separation:** Boids try to avoid colliding with other boids.
- **Alignment:** Each boid tries to match the velocity of the boids closely surrounding it.

The extent to which each of these rules apply to the 3D simulation (in other words their priority) can be controlled in the implemented graphical user interface (GUI). There are sliders for the priority values (or scalars) of each of these rules named Cohesion Scalar, Separation Scalar, and Alignment Scalar, respectively.

You can also control the **visual range** of the boids by playing around with the "Visual Range" slider. The visual range represents how much each of the boids can see around itself (in other words the range around the boid in which other boids can influence its behavior). 

Finally, there is a slider to control the **maximum speed** (magnitude of the velocity vector) the boids can fly at and a control to visualize the **bounding box** that the boids try to stay inside of. You'll see that the boids can often fly outside of the bounding box - this was to create a smoother and more life-like simulation of the boids as a stricter bound would lead to boids bouncing on the bounding box's walls. 

## Running Simulation
I recommend zooming out to see a full view of the flock and experimenting with the GUI controls. Enjoy!

### Steps to run simulation 
Assuming you already have the repository installed locally...
Download necessary tools/dependencies:
```
# three.js
npm install --save three

# vite
npm install --save-dev vite
```
Run simulation:
```
npx vite
```
