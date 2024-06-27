import * as THREE from 'three';
// Helper class to manage min and max properties with a minimum difference constraint
export class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;           // The object containing the properties
        this.minProp = minProp;   // min property
        this.maxProp = maxProp;   // max property
        this.minDif = minDif;     // The minimum difference between min and max
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        // Ensure max is at least min + minDif
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        // Update min to enforce the min difference constraint
        this.min = this.min;
    }
} 
// Helper class to manage color properties in the GUI
export class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;  // The name of the color property
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}
// Function to add GUI controls for a THREE.Vector3 object

export function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
}

// Function to add an AxesHelper to an object
export function AddAxesHelper(object) {
        const axes = new THREE.AxesHelper(50); // 50 is the size of the axes
        // Set the material to not use depth testing, so it's always visible
        axes.material.depthTest = false;
        // Set the render order to ensure it renders on top
        axes.renderOrder = 1;
        object.add(axes);
}