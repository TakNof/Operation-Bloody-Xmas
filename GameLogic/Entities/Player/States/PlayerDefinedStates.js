class PlayerIdleState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){

        const {a, d, left, right, shift, space} = this.player.controls;

        this.player.setVelocityX(0);

        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && shift.isDown) {
            this.player.getStateMachine().transitionToState('Run');
        }else if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.getStateMachine().transitionToState('Walk');
        }
        
        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.getStateMachine().transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Idle").getAnimationName(), true);
            }
        }

        this.updateChildren();

        this.player.getScene().input.on('pointerdown', function (pointer){
            if(this.player.getStateMachine().currentState.stateKey != "Attack"){
                this.player.getStateMachine().transitionToState("Attack");
            }
        }, this.player.getScene());
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

class PlayerWalkState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){
        const {a, d, left, right, shift, space} = this.player.controls;

        if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(shift.isDown){
                this.player.stateMachine.transitionToState("Run");
            }else{
                this.player.play(this.player.getSpriteAnimations("Walk").getAnimationName(), true);
            }
        }

        if(left.isDown || a.isDown){
            this.player.setVelocityX(-this.player.defaultVelocity);
            this.player.flipX = true;

        }else if(right.isDown || d.isDown){
            this.player.setVelocityX(this.player.defaultVelocity);
            this.player.flipX = false;
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

class PlayerRunState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){
        const {a, s, d, left, down, right, shift, space} = this.player.controls;

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(down.isDown ^ s.isDown){
                this.player.stateMachine.transitionToState("Slide");
            }else{
                this.player.play(this.player.getSpriteAnimations("Run").getAnimationName(), true);
            }
        }

        if(left.isDown || a.isDown){
            this.player.setVelocityX(-this.player.defaultVelocity*this.player.velocityMultiplier);
            this.player.flipX= true;

        }else if(right.isDown || d.isDown){
            this.player.setVelocityX(this.player.defaultVelocity*this.player.velocityMultiplier);
            this.player.flipX= false;
        }
        
        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.stateMachine.transitionToState('Walk');
        }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
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

class PlayerJumpState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.setVelocityY(-600);
        this.player.play(this.player.getSpriteAnimations("Jump").getAnimationName(), true);
    }

    updateState(){
        if(this.player.getStateMachine().getStateHistory()[this.player.getStateMachine().getStateHistory().length - 2] === "Run"){
            this.player.stateMachine.transitionToState("Run");
        }else{
            this.player.stateMachine.transitionToState("Walk");
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
class PlayerSlideState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.startingSlideTime = this.player.getScene().time.now;
        this.totalSlideTime = 500;
        this.player.setFrictionX(1);
        this.previousSize = this.player.getSize();
        this.player.setOwnSize({x: 128, y: 64})

        for(let i = 0; i < 24; i++){
            if(this.player.flipX){
                this.player.body.setOffset(i*4,100);
            }else{
                this.player.body.setOffset(i,100);
            }
        }
    }

    updateState(){
        const {a, d, left, right, shift, space} = this.player.controls;

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Slide").getAnimationName(), true);
            }
        }

        if(this.player.getScene().time.now - this.startingSlideTime >= this.totalSlideTime){
            if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Walk');
            }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Idle');
            }
        }

        this.updateChildren();
    }

    exitState(){
        this.player.setFrictionX(0);
        this.player.setOwnSize(this.previousSize);
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

class PlayerAttackState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.isOnProgress = true;
        console.log("Entering Attack State");

        let sign = this.player.flipX ? -1 : 1;
        this.player.getScene().tweens.add({
            targets: this.player.getCurrentWeapon(),
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
            this.player.getScene().input.off('pointerdown', function (pointer){
                this.player.getStateMachine().transitionToState("Attack");
            }, this.player.getScene());
    

            this.player.getStateMachine().transitionToState("Idle");
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