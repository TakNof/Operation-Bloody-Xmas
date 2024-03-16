class Milk extends Item{
    /**
     * The constructor of the Milk class.
     * @constructor
     * @param {*} scene 
     * @param {*} originInfo 
     */
    constructor(scene, originInfo){
        super(scene, originInfo, "Milk", 64);
        this.HealthRegenAmount = 80;
    }
}