class Cookie extends Item{
    /**
     * The constructor of the Cookie class.
     * @constructor
     * @param {*} scene 
     * @param {*} originInfo 
     */
    constructor(scene, originInfo){
        super(scene, originInfo, "Cookie", 64);

        this.ShieldRegenAmount = 60;
    }
}