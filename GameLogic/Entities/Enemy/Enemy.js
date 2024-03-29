/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    */

    constructor(scene, originInfo, config){
        super(scene, originInfo, config);        

        this.setPositionInFreeSpace();

        this.setPathFinder();

        this.playerInSight = false;
        this.stunned = false;

        this.lastAttackTimer = config.attackDelay;
        this.showInfo = false;

        if(this.showInfo){
            this.setInfoTexts();
        }
    }

    /**
     * Sets the distance between the player and the enemy using the player's position. 
     */
    setDistanceToPlayer(){
        this.distanceToPlayer = Phaser.Math.Distance.Between(
            this.getPositionX(),
            this.getPositionY(),
            this.getScene().player.getPositionX(),
            this.getScene().player.getPositionY()
        );            
    }
    
    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    getDistanceToPlayer(){
        return this.distanceToPlayer;
    }
    
    setPathFinder(){
        this.pathFinder = new PathFinder(this.getScene(), this);
    }

    getPathFinder(){
        return this.pathFinder;
    }

    jump(){
        if(this.body.onFloor()){
            this.setVelocityY(this.config.jumpVelocity);
        }
    }

    moveToPoint(){
        if(this.getPathFinder().path.length == 0){
            this.getPathFinder().clearPath();
            // console.log("Deleting path");
            return;
        }

        let target = this.getPathFinder().path[1] ? this.getPathFinder().path[1] : this.getPathFinder().path[0];
        let dx = target.x*64 + 32 - this.x;
        let dy = target.y*64 + 32 - this.y;

        if(Math.abs(dx) < 1 && Math.abs(dy) < this.body.height/2){
            if(this.getPathFinder().markers.length > 0){
                this.getPathFinder().markers[0].destroy();
                this.getPathFinder().markers.shift();
            }
            this.getPathFinder().path.shift();
            // console.log("Deleting step");
            return;
        }

        if(this.body.onWall() || this.body.onFloor()){
            this.flipX = dx <= 1;
            let sign = this.flipX ? -1: 1;
            if(Math.abs(dx) >= 1){
                this.setVelocityX(sign*this.config.defaultVelocity);
            }else{
                this.setVelocityX(0);
            }
        }
        
        
        let currentTile = this.scene.pathFindingGrid[Math.floor(this.getPositionY()/64)][Math.floor(this.getPositionX()/64)];
        
        if(currentTile == 1 && (this.flipX ? this.getPositionX() - this.body.halfWidth % 64 < 10 : this.getPositionX() % 64 > 54) || Math.abs(dy) >= this.body.height){
            this.jump();
        }
    }

    isPointAhead(point){
        let dx = point.x*64 + 32 - this.x;
        return (dx > 0 && !this.flipX) || (dx < 0 && this.flipX);
    }

    updateRaycaster(){
        this.getRaycaster().ray.setRay(this.getPositionX(), this.getPositionY(),
            Phaser.Math.Angle.Between(
                this.getPositionX(), this.getPositionY(), this.getScene().player.getPositionX(), this.getScene().player.getPositionY()
            )
        );
    
        this.playerInSight = this.getRaycaster().ray.cast().object == this.getScene().player && this.getDistanceToPlayer() <= this.config.chaseDistance; 
    }

    setInfoTexts(){
        this.infoToShow = [`State: ${this.getStateMachine().currentState.stateKey}`, `Player in Sight: ${this.playerInSight}`, `VelocityX: ${this.getVelocityX()}`];
        
        this.infoTexts = new Array(this.infoToShow.length);
        for(let i = 0; i < this.infoTexts.length; i++){
            this.infoTexts[i] = this.scene.add.text(0, 0, "", {fontSize: '24px',fill: '#ffffff'});
        }
    }

    updateInfoTexts(){
        this.infoToShow = [`State: ${this.getStateMachine().currentState.stateKey}`, `Player in Sight: ${this.playerInSight}`, `VelocityX: ${this.getVelocityX()}`];
        for(let i = 0; i < this.infoTexts.length; i++){
            this.infoTexts[i].x = this.x - 60;
            this.infoTexts[i].y = this.y - 100 + (i * 24);
            this.infoTexts[i].text = this.infoToShow[i];
        }
    }

    update(){
        if(this.active){
            this.setDistanceToPlayer();
            this.getStateMachine().update();
            this.updateRaycaster();
            // if(this.body.onWall()){
            //     this.jump();
            // }
            if(this.showInfo){
                this.updateInfoTexts();
            }
            
        }
        // console.log(this.getStateMachine().getStateHistory());
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group{
    /**
     * The constructor for the Cacodemon class.
     * @constructor
     * @param {Phaser.Scene} scene2D The scene to place the sprites in the game.
     * @param {Number} amount The amount of enemies to place.
     * @param {Number} maxSize The maximum amount of enemies to place.
     * @param {Object} config The enemy object to make the copies of.
     */
    constructor(scene, amount, maxSize, config){
        super(scene.physics.world, scene);
        this.maxSize = maxSize;

        let className = this.__checkClassConstructor(config.name.charAt(0).toUpperCase() + config.name.slice(1), "Enemy");
        for(let i = 0; i < amount; i++){
            this.add(new className(scene, {x: 0, y:0}, config))
        }

        scene.physics.add.collider(this, this);
    }

    /**
     * This method allows to call any desired class, as long as it exists.
     * @param {String} className 
     * @param {String} classParent 
     * @returns {class}
     */
    __checkClassConstructor(className, classParent){
        const classConstructor = eval(className);
        const classParentConstructor = eval(classParent);
        if (classParentConstructor) {
            if (classConstructor && classConstructor.prototype instanceof classParentConstructor) {
                return classConstructor;
            }
        }else if (classConstructor) {
            return classConstructor;
        } else {
            throw new Error(`The class "${className}" isn't defined or itn't an instanse of "${classParent}".`);
        }
    }    

    /**
     * Custom method to call the same method to all children in the group.
     * @param {String} methodName the name of the method to call.
     * @param  {...any} args the arguments to pass to the method.
     */
    callAll(methodName, ...args) {
        this.getChildren().forEach(function (enemy) {
            if(args === null){
                enemy[methodName]();
            }else{
                enemy[methodName](...args);
            }
        });
    };
}