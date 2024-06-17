import { GUI } from 'dat.gui'

export default class InteractiveControls {
    constructor(cohesionScalar, separationScalar, alignmentScalar, visualRange, limV) {
        //this.numBoids = numBoids;
        this.cohesionScalar = cohesionScalar;
        this.separationScalar = separationScalar;
        this.alignmentScalar = alignmentScalar;
        this.visualRange = visualRange;
        this.limV = limV; 
        this.boundingBox = false;
        //this.stats = undefined;
    }

    init() {
        // Create stats
        //this.stats = new Stats();
        //document.body.appendChild(stats.dom);

        // Create GUI and add controllers
        const gui = new GUI();
        //gui.add(this, 'numBoids', 100, 1000, 100).name('Add Boids');
        gui.add(this, 'cohesionScalar', 0, 0.1, 0.001).name('Cohesion Scalar');
        gui.add(this, 'separationScalar', 0, 0.5, 0.01).name('Separation Scalar');
        gui.add(this, 'alignmentScalar', 0, 0.5, 0.05).name('Alignment Scalar');
        gui.add(this, 'visualRange', 0, 2, 0.5).name('Visual Range');
        gui.add(this, 'limV', 0, 0.5, 0.01).name('Speed Limit');
        gui.add(this, 'boundingBox').name('Show Bounding Box');
    }

    /*getNumBoids() {
        return this.numBoids;
    }*/

    getCohesionScalar() {
        return this.cohesionScalar;
    }

    getSeparationScalar() {
        return this.separationScalar;
    }

    getAlignmentScalar() {
        return this.alignmentScalar;
    }

    getVisualRange() {
        return this.visualRange;
    }

    getLimV() {
        return this.limV;
    }

    getStats() {
        return this.stats;
    }
} 
