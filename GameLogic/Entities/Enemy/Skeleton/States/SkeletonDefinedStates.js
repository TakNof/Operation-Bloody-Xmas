class SkeletonIdleState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.enemy.setVelocityX(0);
        this.enemy.play(this.enemy.getSpriteAnimations("Idle").getAnimationName(), true);

        this.timeout = setTimeout(() =>{
            this.enemy.getStateMachine().transitionToState("Patrol");
        
        }, getRndInteger(2, 3)*1000)
    }

    updateState(){
        this.enemy.setVelocityX(0);
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance){
            clearTimeout(this.timeout);
            this.enemy.getStateMachine().transitionToState("Chase");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonPatrolState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.enemy.play(this.enemy.getSpriteAnimations("Walk").getAnimationName(), true);
        this.enemy.setVelocityX(-this.enemy.defaultVelocity);
        this.enemy.flipX = true;

        this.firstTimeout = setTimeout(() =>{
            this.enemy.setVelocityX(this.enemy.defaultVelocity);
            this.enemy.flipX = false;
            
            this.secondTimeout = setTimeout(() =>{
                this.enemy.stateMachine.transitionToState("Idle");                    
            }, getRndInteger(2, 3)*1000)
        }, getRndInteger(2, 3)*1000)
    }

    updateState(){
        this.enemy.onWallFound();
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance){
            clearTimeout(this.firstTimeout);
            clearTimeout(this.secondTimeout);
            this.enemy.getStateMachine().transitionToState("Chase");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonChaseState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){}

    updateState(){
        const {player} = this.enemy.getScene();

        this.enemy.onWallFound();
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.attackDistance){
            this.enemy.getStateMachine().transitionToState("Attack");
        }else if(this.enemy.getDistanceToPlayer() >= this.enemy.config.chaseDistance){
            this.enemy.lastPlayerSeenPosition = player.getPosition();
            this.enemy.getStateMachine().transitionToState("Search");
        }else{
            this.enemy.play(this.enemy.getSpriteAnimations("Walk").getAnimationName(), true);
            this.enemy.flipX = player.getPositionX() < this.enemy.getPositionX();
            let sign = this.enemy.flipX ? -1: 1;

            this.enemy.setVelocityX(sign*this.enemy.defaultVelocity);
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonSearchState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){}

    updateState(){
        this.enemy.onWallFound();
        this.reachedPlayerLastSeenPosition = false;

        if(Math.abs(this.enemy.lastPlayerSeenPosition.x - this.enemy.getPositionX()) <= 10 && this.enemy.getDistanceToPlayer() > this.enemy.config.chaseDistance){
            this.reachedPlayerLastSeenPosition = true;

            this.enemy.setVelocityX(0);
            this.enemy.play(this.enemy.getSpriteAnimations("Idle").getAnimationName(), true);
            if(!this.interval){
                this.interval = setInterval(() =>{
                    this.enemy.flipX = !this.enemy.flipX;
                }, 2000);

                this.timeout = setTimeout(() =>{
                    clearInterval(this.interval);
                    this.enemy.getStateMachine().transitionToState("Patrol");
                }, getRndInteger(4, 6)*1000)
            }
        }else if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance){
            clearInterval(this.interval);
            clearTimeout(this.timeout);
            this.enemy.getStateMachine().transitionToState("Chase");
            

        }else if(!this.reachedPlayerLastSeenPosition){
            this.enemy.play(this.enemy.getSpriteAnimations("Walk").getAnimationName(), true);
            this.enemy.flipX = this.enemy.lastPlayerSeenPosition.x < this.enemy.getPositionX();
            let sign = this.enemy.flipX ? -1: 1;

            this.enemy.setVelocityX(sign*this.enemy.defaultVelocity);
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonAttackState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        const {scene} = this.enemy;
        this.entryTime = scene.time.now;
        this.enemy.setVelocityX(0)
        this.enemy.play(this.enemy.getSpriteAnimations("Idle").getAnimationName());
    }

    updateState(){
        const {scene, config} = this.enemy;

        if(scene.time.now >= this.entryTime + config.attackDelay) {
            this.enemy.play(this.enemy.getSpriteAnimations("Attack").getAnimationName());
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonBlockState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.enemy.setVelocityY(-600);
        this.enemy.play(this.enemy.getSpriteAnimations("Jump").getAnimationName(), true);
    }

    updateState(){
        if(this.enemy.getStateMachine().getStateHistory()[this.enemy.getStateMachine().getStateHistory().length - 2] === "Run"){
            this.enemy.stateMachine.transitionToState("Run");
        }else{
            this.enemy.stateMachine.transitionToState("Walk");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}
class SkeletonDamagedState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.startingSlideTime = this.enemy.getScene().time.now;
        this.totalSlideTime = 500;
        this.enemy.setFrictionX(1);
        this.previousSize = this.enemy.getSize();
        this.enemy.setOwnSize({x: 128, y: 64})

        for(let i = 0; i < 24; i++){
            if(this.enemy.flipX){
                this.enemy.body.setOffset(i*4,100);
            }else{
                this.enemy.body.setOffset(i,100);
            }
        }
    }

    updateState(){
        const {a, d, left, right, shift, space} = this.enemy.controls;

        if(this.enemy.body.onFloor()){
            if(space.isDown){
                this.enemy.stateMachine.transitionToState('Jump');
            }else{
                this.enemy.play(this.enemy.getSpriteAnimations("Slide").getAnimationName(), true);
            }
        }

        if(this.enemy.getScene().time.now - this.startingSlideTime >= this.totalSlideTime){
            if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.enemy.stateMachine.transitionToState('Walk');
            }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.enemy.stateMachine.transitionToState('Idle');
            }
        }

        this.updateChildren();
    }

    exitState(){
        this.enemy.setFrictionX(0);
        this.enemy.setOwnSize(this.previousSize);
    }

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonDeadState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.isOnProgress = true;
        console.log("Entering Attack State");

        let sign = this.enemy.flipX ? -1 : 1;
        this.enemy.getScene().tweens.add({
            targets: this.enemy.getCurrentWeapon(),
            angle: sign*180,
            duration: 100,
            ease: "Linear",
            yoyo: true,
            onComplete: () => {
                this.isOnProgress = false;
            },
        });
    }

    updateState(){
        this.updateChildren(true, false, true);
        
        if(!this.isOnProgress){
            this.enemy.getScene().input.off('pointerdown', function (pointer){
                this.enemy.getStateMachine().transitionToState("Attack");
            }, this.enemy.getScene());
    

            this.enemy.getStateMachine().transitionToState("Idle");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}