class Milk extends Entity{
    /**
     * The constructor of the Milk class.
     * @constructor
     * @param {*} scene 
     * @param {*} originInfo 
     */
    constructor(scene, originInfo, key, size){
        super(scene, originInfo, key);

        scene.physics.add.existing(this, false);
        this.setVisible(false);
        this.setActive(false);

        this.setOwnSize(size);
        this.HealthRegenAmount = 80;
    }

    /**
    * Sets the size of the sprite.
    * @param {Number} size 
    */
    setOwnSize(size){
        this.size = size;
        if(!size.x){
            this.setSize(size, size, true);
        }else{
            this.setSize(size.x, size.y, true);
        }
    }  
}