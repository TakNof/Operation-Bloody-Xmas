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
        if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown)) {
            this.player.getStateMachine().transitionToState('Walk');
        }else if(this.player.body.onFloor()){
            if(this.player.controls.space.isDown){
                this.player.getStateMachine().transitionToState('Jump');
            }else{
                this.player.setVelocityX(0);
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
        if((this.player.controls.left.isDown ^ this.player.controls.right.isDown) ^ (this.player.controls.a.isDown ^ this.player.controls.d.isDown)){
            if(this.player.body.onFloor()){
                if(this.player.controls.space.isDown){
                    this.player.stateMachine.transitionToState('Jump');
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
        }else{
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
        this.player.stateMachine.transitionToState("Walk");
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