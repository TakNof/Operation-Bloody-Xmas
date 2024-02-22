class SkeletonIdleState extends EnemyState{
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
        this.enemy.play(this.enemy.getSpriteAnimations("Idle").getAnimationName(), true);
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

class SkeletonWalkState extends EnemyState{
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
        const {a, d, left, right, shift, space} = this.enemy.controls;

        if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.enemy.stateMachine.transitionToState('Idle');
        }

        if(this.enemy.body.onFloor()){
            if(space.isDown){
                this.enemy.stateMachine.transitionToState('Jump');
            }else if(shift.isDown){
                this.enemy.stateMachine.transitionToState("Run");
            }else{
                this.enemy.play(this.enemy.getSpriteAnimations("Walk").getAnimationName(), true);
            }
        }

        if(left.isDown || a.isDown){
            this.enemy.setVelocityX(-this.enemy.defaultVelocity);
            this.enemy.flipX = true;

        }else if(right.isDown || d.isDown){
            this.enemy.setVelocityX(this.enemy.defaultVelocity);
            this.enemy.flipX = false;
        }

        this.updateChildren();
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

class SkeletonRunState extends EnemyState{
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
        const {a, s, d, left, down, right, shift, space} = this.enemy.controls;

        if(this.enemy.body.onFloor()){
            if(space.isDown){
                this.enemy.stateMachine.transitionToState('Jump');
            }else if(down.isDown ^ s.isDown){
                this.enemy.stateMachine.transitionToState("Slide");
            }else{
                this.enemy.play(this.enemy.getSpriteAnimations("Run").getAnimationName(), true);
            }
        }

        if(left.isDown || a.isDown){
            this.enemy.setVelocityX(-this.enemy.defaultVelocity*this.enemy.velocityMultiplier);
            this.enemy.flipX= true;

        }else if(right.isDown || d.isDown){
            this.enemy.setVelocityX(this.enemy.defaultVelocity*this.enemy.velocityMultiplier);
            this.enemy.flipX= false;
        }
        
        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.enemy.stateMachine.transitionToState('Walk');
        }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.enemy.stateMachine.transitionToState('Idle');
        }

        this.updateChildren();
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

class SkeletonJumpState extends EnemyState{
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
class SkeletonSlideState extends EnemyState{
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