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
        this.player.setVelocityX(0);

        if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && this.player.controls.shift.isDown) {
            this.player.getStateMachine().transitionToState('Run');
        }else if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && !this.player.controls.shift.isDown){
            this.player.getStateMachine().transitionToState('Walk');
        }
        
        if(this.player.body.onFloor()){
            if(this.player.controls.space.isDown){
                this.player.getStateMachine().transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Idle").getAnimationName(), true);
            }
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
        if(!(this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        if(this.player.body.onFloor()){
            if(this.player.controls.space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(this.player.controls.shift.isDown){
                this.player.stateMachine.transitionToState("Run");
            }else{
                this.player.play(this.player.getSpriteAnimations("Walk").getAnimationName(), true);
            }
        }

        if(this.player.controls.left.isDown || this.player.controls.a.isDown){
            this.player.setVelocityX(-this.player.defaultVelocity);
            this.player.flipX= true;

        }else if(this.player.controls.right.isDown || this.player.controls.d.isDown){
            this.player.setVelocityX(this.player.defaultVelocity);
            this.player.flipX= false;
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
        if(this.player.body.onFloor()){
            if(this.player.controls.space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(this.player.controls.down.isDown ^ this.player.controls.s.isDown){
                this.player.stateMachine.transitionToState("Slide");
            }else{
                this.player.play(this.player.getSpriteAnimations("Run").getAnimationName(), true);
            }
        }

        if(this.player.controls.left.isDown || this.player.controls.a.isDown){
            this.player.setVelocityX(-this.player.defaultVelocity*this.player.velocityMultiplier);
            this.player.flipX= true;

        }else if(this.player.controls.right.isDown || this.player.controls.d.isDown){
            this.player.setVelocityX(this.player.defaultVelocity*this.player.velocityMultiplier);
            this.player.flipX= false;
        }
        
        if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && !this.player.controls.shift.isDown){
            this.player.stateMachine.transitionToState('Walk');
        }else if(!(this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && !this.player.controls.shift.isDown){
            this.player.stateMachine.transitionToState('Idle');
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
        if(this.player.getStateMachine().getStateHistory()[this.player.getStateMachine().getStateHistory().length - 2] === "Run"){
            this.player.stateMachine.transitionToState("Run");
        }else{
            this.player.stateMachine.transitionToState("Walk");
        }
    }

    updateState(){}

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
        this.player.setFriction(100);
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
        if(this.player.body.onFloor()){
            if(this.player.controls.space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Slide").getAnimationName(), true);
            }
        }

        if(this.player.getScene().time.now - this.startingSlideTime >= this.totalSlideTime){
            if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && this.player.controls.shift.isDown){
                this.player.stateMachine.transitionToState('Run');
            }else if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && !this.player.controls.shift.isDown){
                this.player.stateMachine.transitionToState('Walk');
            }else if(!(this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown) && !this.player.controls.shift.isDown){
                this.player.stateMachine.transitionToState('Idle');
            }
        }
    }

    exitState(){
        this.player.setFriction(0);
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